import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../../api/customerApi";
import { viewAllSim } from "../../api/simApi";
import { getAllBills } from "../../api/billApi.js";

const Bills = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSims, setCustomerSims] = useState([]);
  const [bills, setBills] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSim, setSelectedSim] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomer();
      setCustomers(Array.isArray(data) ? data : []); // ✅ Ensure array
    } catch {
      setError("Failed to fetch customers");
    }
  };

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedSim("");
    setBills([]);
    setCustomerSims([]);

    if (customerId) {
      try {
        const sims = await viewAllSim(customerId);
        setCustomerSims(Array.isArray(sims) ? sims : []); // ✅ Ensure array
      } catch {
        setError("Failed to fetch sims for customer");
      }
    }
  };

  const handleSimChange = async (phoneNumber) => {
    setSelectedSim(phoneNumber);
    setBills([]);

    if (phoneNumber) {
      try {
        const data = await getAllBills();

        // ✅ Always normalize bills into an array
        let billsArray = [];
        if (Array.isArray(data)) {
          billsArray = data;
        } else if (data && typeof data === "object") {
          billsArray = [data]; // single object case
        }

        // ✅ Safe filter
        const simBills = billsArray.filter(
          (b) => b?.sim?.phoneNumber?.toString() === phoneNumber.toString()
        );

        setBills(simBills);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError("Failed to fetch bills");
        setBills([]); // ✅ fallback so UI won’t crash
      }
    }
  };

  return (
    <div>
      <h2>Bills</h2>
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

      {/* Bills Table */}
      {selectedSim && bills.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Total Amount (Rs)</th>
              <th>Status</th>
              <th>Generated Date</th>
              <th>SIM Card Type</th>
              <th>Bill Paid Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill?.id || Math.random()}>
                <td>{bill?.id ?? "N/A"}</td>
                <td>{bill?.amount ?? "N/A"}</td>
                <td>{bill?.status ?? "N/A"}</td>
                <td>
                  {bill?.generatedDate
                    ? new Date(bill.generatedDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{bill?.simType ?? "N/A"}</td>
                <td>
                  {bill?.billPaiddate
                    ? new Date(bill.billPaiddate).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No data message */}
      {selectedSim && bills.length === 0 && (
        <p>No Bill data found for this SIM.</p>
      )}
    </div>
  );
};

export default Bills;
