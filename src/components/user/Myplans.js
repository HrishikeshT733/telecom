import React, { useEffect, useState } from "react";
import { getAllPlans } from "../../api/planApi.js";

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");

  // For demo, showing all plans. If you want only user-subscribed plans, you need API for that.
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

  return (
    <div>
      <h2>My Plans</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              <strong>{plan.name}</strong> — ₹{plan.price}, Data: {plan.dataLimit ?? "-"} GB, Calls: {plan.callLimit ?? "-"} mins, validity(in Days):{plan.validity}, Type:{plan.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
