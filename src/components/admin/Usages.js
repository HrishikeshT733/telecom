import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../../api/customerApi";
import { viewAllSim } from "../../api/simApi";
import { getAllUsages } from "../../api/usageApi";

const Usages = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSims, setCustomerSims] = useState([]); 
  const [usages, setUsages] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSim, setSelectedSim] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomer();
      setCustomers(data);
    } catch {
      setError("Failed to fetch customers");
    }
  };

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedSim("");
    setUsages([]);
    setCustomerSims([]);

    if (customerId) {
      try {
        const sims = await viewAllSim(customerId);
        setCustomerSims(sims);
      } catch {
        setError("Failed to fetch sims for customer");
      }
    }
  };

  const handleSimChange = async (phoneNumber) => {
    setSelectedSim(phoneNumber);
    setUsages([]);

    if (phoneNumber) {
      try {
        const data = await getAllUsages();
        // Filter usages for that sim only
        const simUsages = data.filter(
          (u) => u.simCardPhoneNumber?.toString() === phoneNumber.toString()
        );
        setUsages(simUsages);
      } catch {
        setError("Failed to fetch usages");
      }
    }
  };

  return (
    <div>
      <h2>Usages</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Customer Dropdown */}
      <div style={{ marginBottom: "15px" }}>
        <label>
          Customer:&nbsp;
          <select
            value={selectedCustomer}
            onChange={(e) => handleCustomerChange(e.target.value)}
          >
            <option value="">Select Customer</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name} (ID: {cust.id})
              </option>
            ))}
          </select>
        </label>

        &nbsp;&nbsp;

        {/* Sim Phone Number Dropdown */}
        {selectedCustomer && (
          <label>
            Sim Phone Number:&nbsp;
            <select
              value={selectedSim}
              onChange={(e) => handleSimChange(e.target.value)}
              disabled={!customerSims.length}
            >
              <option value="">Select SIM</option>
              {customerSims.map((sim) => (
                <option key={sim.id} value={sim.phoneNumber}>
                  {sim.phoneNumber}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Usages Table */}
      {selectedSim && usages.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Data Used (MB)</th>
              <th>Call Minutes</th>
              <th>Date</th>
              <th>SIM Card ID</th>
              <th>SIM Phone</th>
              <th>SIM Type</th>
            </tr>
          </thead>
          <tbody>
            {usages.map((usage) => (
              <tr key={usage.id}>
                <td>{usage.id}</td>
                <td>{usage.dataUsed}</td>
                <td>{usage.callMinutesUsed}</td>
                <td>{new Date(usage.date).toLocaleDateString()}</td>
                <td>{usage.simCardId}</td>
                <td>{usage.simCardPhoneNumber}</td>
                <td>{usage.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No data message */}
      {selectedSim && usages.length === 0 && (
        <p>No usage data found for this SIM.</p>
      )}
    </div>
  );
};

export default Usages;
