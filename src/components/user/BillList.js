// src/components/user/BillList.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getBillsByCustomer,
  payBillToChangePlan,
  payBillToContinueSamePlan,
} from "../../api/billApi";
import { viewAllSim } from "../../api/simApi";

export default function BillList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize states to empty arrays to prevent undefined
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPhone, setFilterPhone] = useState("ALL");
  const [allPhones, setAllPhones] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchBills(user.id);
      fetchPhones(user.id);
    }
  }, [user]);

  const fetchBills = async (customerId) => {
    try {
      const data = await getBillsByCustomer(customerId);
      setBills(Array.isArray(data) ? data : []); // Safe check
    } catch (err) {
      setError("Failed to fetch bills. Please try again later.");
    }
  };

  const fetchPhones = async (customerId) => {
    try {
      const sims = await viewAllSim(customerId);
      const phones = Array.isArray(sims)
        ? sims.map((sim) => sim.phoneNumber).filter(Boolean)
        : [];
      setAllPhones(phones);
    } catch (err) {
      console.error("Failed to fetch SIM phone numbers", err);
    }
  };

  const handlePayment = async (bill) => {
    const changePlan = window.confirm(
      "Do you want to change your plan after this payment?"
    );

    try {
      if (changePlan) {
        await payBillToChangePlan(user.id, bill.id, {
          simId: bill.sim?.id,
          planId: bill.plan?.id,
          amount: bill.amount,
        });
        alert("Payment successful! Redirecting to change plan page...");
        navigate(`/user/ChangePlanPostpaid`);
      } else {
        await payBillToContinueSamePlan(user.id, bill.id, {
          simId: bill.sim?.id,
          planId: bill.plan?.id,
          amount: bill.amount,
        });
        alert("Payment successful! Continuing with the same plan.");
        fetchBills(user.id);
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  const filteredBills = bills
    .filter(
      (bill) => filterStatus === "ALL" || bill.status?.toUpperCase() === filterStatus
    )
    .filter(
      (bill) => filterPhone === "ALL" || bill.sim?.phoneNumber === filterPhone
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bills</h2>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PENDING">Pending</option>
        </select>

        <label htmlFor="phoneFilter" style={{ marginLeft: "20px" }}>
          Filter by Phone:{" "}
        </label>
        <select
          id="phoneFilter"
          value={filterPhone}
          onChange={(e) => setFilterPhone(e.target.value)}
        >
          <option value="ALL">All</option>
          {allPhones.map((phone) => (
            <option key={phone} value={phone}>
              {phone}
            </option>
          ))}
        </select>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {Array.isArray(filteredBills) && filteredBills.length > 0 ? (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Generated Date</th>
              <th>Paid Date</th>
              <th>Plan</th>
              <th>SIM Phone Number</th>
              <th>SIM Type</th>
              <th>Extra Data Used (GB)</th>
              <th>Extra Call Used (Minutes)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.month}</td>
                <td>₹{bill.amount?.toFixed(2)}</td>
                <td>{bill.status}</td>
                <td>
                  {bill.generatedDate
                    ? new Date(bill.generatedDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {bill.billPaiddate
                    ? new Date(bill.billPaiddate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{bill.plan?.name || "-"}</td>
                <td>{bill.sim?.phoneNumber || "-"}</td>
                <td>{bill.simType || "-"}</td>
                <td>{bill.extraDataUsed ?? 0}</td>
                <td>{bill.extraCallUsed ?? 0}</td>
                <td>
                  {bill.status === "UNPAID" ? (
                    <button onClick={() => handlePayment(bill)}>
                      Make Payment
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bills found.</p>
      )}
    </div>
  );
}
