import React, { useEffect, useState } from "react";
import { getMyUsages } from "../../api/usageApi.js";

export default function MyUsages() {
  const [usages, setUsages] = useState([]);
  const [error, setError] = useState("");

  const [selectedSimType, setSelectedSimType] = useState("");
  const [selectedSimNumber, setSelectedSimNumber] = useState("");

  useEffect(() => {
    fetchUsages();
  }, []);

  const fetchUsages = async () => {
    try {
      const data = await getMyUsages();
      setUsages(data);
    } catch (err) {
      setError("Failed to fetch usage data.");
    }
  };

  // Filter SIM numbers by selected type
  const filteredSimNumbers = usages
    .filter((u) => (selectedSimType ? u.type === selectedSimType : true))
    .map((u) => u.simCardPhoneNumber)
    .filter(Boolean);

  const uniqueSimNumbers = [...new Set(filteredSimNumbers)];

  // Final table data: only show if both dropdowns have a value
  const filteredUsages =
    selectedSimType && selectedSimNumber
      ? usages.filter(
          (u) =>
            u.type === selectedSimType && u.simCardPhoneNumber === selectedSimNumber
        )
      : [];

  return (
    <div>
      <h2>My Usages</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Filters */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        {/* SIM Type Dropdown */}
        <select
          value={selectedSimType}
          onChange={(e) => {
            setSelectedSimType(e.target.value);
            setSelectedSimNumber(""); // reset SIM number when type changes
          }}
        >
          <option value="">Select SIM Type</option>
          <option value="PREPAID">Prepaid</option>
          <option value="POSTPAID">Postpaid</option>
        </select>

        {/* SIM Number Dropdown */}
        <select
          value={selectedSimNumber}
          onChange={(e) => setSelectedSimNumber(e.target.value)}
          disabled={!selectedSimType}
        >
          <option value="">Select SIM Number</option>
          {uniqueSimNumbers.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Sim Card Number</th>
            <th>Sim Type</th>
            <th>Data Used (MB)</th>
            <th>Call Minutes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsages.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                {selectedSimType && selectedSimNumber
                  ? "No usage data found."
                  : "Please select both SIM Type and SIM Number."}
              </td>
            </tr>
          )}
          {filteredUsages.map((usage) => (
            <tr key={usage.id}>
              <td>{usage.simCardPhoneNumber}</td>
              <td>{usage.type}</td>
              <td>{usage.dataUsed}</td>
              <td>{usage.callMinutesUsed}</td>
              <td>
                {new Date(usage.date)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
