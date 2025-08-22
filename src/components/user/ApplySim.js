import React, { useEffect, useState, useContext } from "react";
import { getAllPlans } from "../../api/planApi.js";
import { applySim } from "../../api/simApi.js";
import { AuthContext } from "../../context/AuthContext.js";

export default function ApplySim() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      setPlans(data);
    } catch {
      setError("Failed to load plans.");
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

    const simData = {}; // No need to send phone number now

    try {
      await applySim(simData, user.id, selectedPlanId);
      setSuccessMsg("SIM application submitted successfully.");
      setSelectedPlanId("");
    } catch(err){
      setError(err.response?.data?.message || "Failed to submit SIM application.");
    }
  };

  return (
    <div>
      <h2>Apply for a SIM</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: "10px" }}>
          <label>Select Plan: </label>
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
          Apply
        </button>
      </form>
    </div>
  );
}
