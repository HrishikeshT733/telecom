import React, { useEffect, useState, useContext } from "react";
import { getAllPlans } from "../../api/planApi.js";
import { changePlanPostpaid, simById, viewAllSim ,ActivateNewPlanPostpaid} from "../../api/simApi.js";
import { getBillsByCustomer } from "../../api/billApi.js";
import { AuthContext } from "../../context/AuthContext.js";

export default function ChangePlanPostpaid() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedSimId, setSelectedSimId] = useState("");
  const [sims, setSims] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [simDetails, setSimDetails] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUserSims();
  }, []);

  const fetchUserSims = async () => {
    try {
      const allSims = await viewAllSim(user.id);
      const postpaidSims = allSims.filter(sim => sim.plan.type === "POSTPAID");
      setSims(postpaidSims);
    } catch {
      setError("Failed to load your SIMs.");
    }
  };
const checkEligibility = async (simId) => {
  try {
    const sim = await simById(simId);
    setSimDetails(sim);

    // Unpaid bills check
    let bills = await getBillsByCustomer(user.id);
    bills = bills || []; // ✅ fallback to empty array if null/undefined

    const unpaidBills = bills.filter(
      (bill) => bill.sim.id === parseInt(simId) && bill.status === "UNPAID"
    );

    if (unpaidBills.length > 0) {
      setError("You have unpaid bills. Please pay them before changing the plan.");
      setIsEligible(false);
      return;
    }

    // Active plan check
    if (sim.status === "ACTIVE") {
      setError("You already have an active plan. Wait until it expires before changing.");
      setIsEligible(false);
      return;
    }

    // ✅ Eligible
    setError("");
    setIsEligible(true);
    fetchPlans();
  } catch (err) {
    setError("Failed to check SIM eligibility.");
  }
};




  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      const postpaidPlans = data.filter((plan) => plan.type === "POSTPAID");
      setPlans(postpaidPlans);
    } catch {
      setError("Failed to load plans.");
    }
  };

  const handleSimChange = (e) => {
    const simId = e.target.value;
    setSelectedSimId(simId);
    if (simId) {
      checkEligibility(simId);
    } else {
      setIsEligible(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedPlanId) {
      setError("Please select a plan.");
      return;
    }

    try {
      await ActivateNewPlanPostpaid(selectedSimId, { planId: parseInt(selectedPlanId) });
      setSuccessMsg("Plan changed successfully!");
      setSelectedPlanId("");
      setSelectedSimId("");
      setIsEligible(false);
    } catch (err) {
      setError(err.response?.data || "Failed to change plan.");
    }
  };

  return (
    <div>
      <h2>Change Postpaid Plan</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      {/* SIM selection */}
      <div style={{ marginTop: "10px" }}>
        <label>Select Your SIM: </label>
        <select value={selectedSimId} onChange={handleSimChange}>
          <option value="">-- Select a SIM --</option>
          {sims.map((sim) => (
            <option key={sim.id} value={sim.id}>
              {sim.phoneNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Plan change form */}
      {isEligible && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: "10px" }}>
            <label>Select New Plan: </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              required
            >
              <option value="">-- Select a plan --</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₹{plan.price}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" style={{ marginTop: "15px" }}>
            Change Plan
          </button>
        </form>
      )}
    </div>
  );
}
