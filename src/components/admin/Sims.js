import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../../api/customerApi";
import { viewAllSim } from "../../api/simApi";

const Sims = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSims, setCustomerSims] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerObj, setSelectedCustomerObj] = useState(null);
  const [selectedSim, setSelectedSim] = useState("");

  const [simDetails, setSimDetails] = useState(null);
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
    setSelectedCustomerObj(customers.find((c) => c.id.toString() === customerId.toString()) || null);
    setSelectedSim("");
    setSimDetails(null);
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
    setSimDetails(null);

    if (phoneNumber) {
      const sim = customerSims.find(
        (s) => s.phoneNumber?.toString() === phoneNumber.toString()
      );
      setSimDetails(sim || null);
    }
  };

  return (
    <div>
      <h2>SIM Information</h2>
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

      {/* SIM Info Table */}
      {selectedSim && simDetails && (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>SIM Number (ICCID)</th>
              <th>Status</th>
              <th>Activation Date</th>
              <th>SIM Type</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Plan Name</th>
              <th>Balance</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{simDetails.id}</td>
              <td>{simDetails.simNumber}</td>
              <td>{simDetails.status}</td>
              <td>
                {simDetails.activationDate
                  ? new Date(simDetails.activationDate).toLocaleDateString()
                  : "-"}
              </td>
              <td>{simDetails.simType}</td>
              {/* ✅ Always from selectedCustomer */}
              <td>{selectedCustomerObj?.id}</td>
              <td>{selectedCustomerObj?.name}</td>
              <td>{simDetails.plan.name}</td>
              <td>{simDetails.balance}</td>
              <td>{simDetails.phoneNumber}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* No data message */}
      {selectedSim && !simDetails && <p>No SIM data found.</p>}
    </div>
  );
};

export default Sims;
