import React, { useState, useEffect,useContext } from "react";
import { viewAllSim } from "../../api/simApi";
import { getAllPlans,getPlanById } from "../../api/planApi";
import { AuthContext } from "../../context/AuthContext";
import { rechargeSim } from "../../api/billApi.js";

const RechargeForm = () => {
  const { user } = useContext(AuthContext); // get logged in user details
  const [sims, setSims] = useState([]);
  const [selectedSim, setSelectedSim] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    // Fetch all sims for dropdown
    viewAllSim(user.id)
      .then((data) =>
        setSims(
          data.filter(
            (sim) => sim.simType === "PREPAID" && sim.status === "INACTIVE"
          )
        )
      )
      .catch(console.error);

    // Fetch plans
    getAllPlans().then((data)=>
      setPlans(
        data.filter(
      (plan)=>plan.type==="PREPAID"
    
    )
  )
  ).catch(console.error);
  }, [user]);

  const handlePlanChange = async (planId) => {
    setSelectedPlan(planId);
    if (planId) {
      try {
        const plan = await getPlanById(planId);
        setAmount(plan.price);
      } catch (err) {
        console.error("Error fetching plan:", err);
      }
    } else {
      setAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSim || !selectedPlan) {
      setMessage("Please select SIM and Plan.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await rechargeSim({
        simId: selectedSim,
        planId: selectedPlan,
        amount: amount, // send logged in userId
      });

      setMessage("Recharge successful!");
      setSelectedSim("");
      setSelectedPlan("");
      setAmount("");
    } catch (error) {
      console.error("Recharge failed:", error);
      setMessage(error.response?.data?.message || "Recharge failed. Try again.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Recharge SIM</h2>

      <select
        value={selectedSim}
        onChange={(e) => setSelectedSim(e.target.value)}
        required
      >
        <option value="">Select SIM</option>
        {sims.map((sim) => (
          <option key={sim.id} value={sim.id}>
            {sim.simNumber}
          </option>
        ))}
      </select>

      <select
        value={selectedPlan}
        onChange={(e) => handlePlanChange(e.target.value)}
        required
      >
        <option value="">Select Plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </select>

      <input type="number" value={amount} readOnly placeholder="Amount" />

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Recharge"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default RechargeForm;
