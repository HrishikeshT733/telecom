import React, { useEffect, useState, useContext } from "react";
import { viewAllSim } from "../../api/simApi";
import { AuthContext } from "../../context/AuthContext";

const ActivePlans = () => {
  const [activeSims, setActiveSims] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.id) {
      viewAllSim(user.id)
        .then((data) => {
          const active = data.filter(
            (sim) => sim.status === "ACTIVE" && sim.plan
          );
          setActiveSims(active);
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Collect unique phone numbers for the dropdown
  const phoneOptions = Array.from(
    new Set(activeSims.map((sim) => sim.phoneNumber))
  );

  // Filter sims based on the selected phone number (blank = show all)
  const filteredSims = selectedPhone
    ? activeSims.filter((sim) => sim.phoneNumber === selectedPhone)
    : activeSims;

  return (
    <div>
      <h1>Active Plans</h1>

      {/* Dropdown to select phone number */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="phone-select" style={{ marginRight: "10px" }}>
          Select Phone Number:
        </label>
        <select
          id="phone-select"
          value={selectedPhone}
          onChange={(e) => setSelectedPhone(e.target.value)}
        >
          <option value="">All</option>
          {phoneOptions.map((phone) => (
            <option key={phone} value={phone}>
              {phone}
            </option>
          ))}
        </select>
      </div>

      {filteredSims.length > 0 ? (
        <ul>
          {filteredSims.map((sim) => (
            <li key={sim.id} style={{ marginBottom: "10px" }}>
              <strong>SIM Number:</strong> {sim.simNumber} <br />
              <strong>Phone:</strong> {sim.phoneNumber} <br />
              <strong>Plan:</strong> {sim.plan.name} ({sim.plan.type}) <br />
              <strong>Price:</strong> ₹{sim.plan.price} <br />
              <strong>Data:</strong> {sim.plan.dataLimit} GB |{" "}
              <strong>Calls:</strong> {sim.plan.callLimit} mins <br />
              <strong>Activation Date:</strong> {sim.activationDate} <br />
              <strong>Validity End Date:</strong> {sim.validityEndDate} <br />
              <strong>Balance:</strong> ₹{sim.balance}
            </li>
          ))}
        </ul>
      ) : (
        <p>No active plans found.</p>
      )}
    </div>
  );
};

export default ActivePlans;
