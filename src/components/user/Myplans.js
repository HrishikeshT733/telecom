import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "../../api/planApi.js";
import "./CSS/MyPlans.css";

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("PREPAID"); // toggle
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      setPlans(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load plans.");
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.type === "PREPAID") {
      navigate("/user/Recharge-SIM");
    } else if (plan.type === "POSTPAID") {
      navigate("/user/ChangePlanPostpaid");
    }
  };

  const filteredPlans = plans.filter(plan => plan.type === selectedType);

  return (
    <div className="plans-container">
      <h2>My Plans</h2>

      <div className="plan-toggle">
        <button
          className={selectedType === "PREPAID" ? "active" : ""}
          onClick={() => setSelectedType("PREPAID")}
        >
          Prepaid
        </button>
        <button
          className={selectedType === "POSTPAID" ? "active" : ""}
          onClick={() => setSelectedType("POSTPAID")}
        >
          Postpaid
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {filteredPlans.length === 0 ? (
        <p>No {selectedType} plans found.</p>
      ) : (
        <div className="plans-grid">
          {filteredPlans.map(plan => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.name}</h3>
              <p className="price">₹{plan.price}</p>
              <div className="plan-info">
                <p>Data: {plan.dataLimit ?? "-"} GB</p>
                <p>Calls: {plan.callLimit ?? "-"} mins</p>
                <p>Validity: {plan.validity} days</p>
              </div>
              <button
                className="select-btn"
                onClick={() => handleSelectPlan(plan)}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
