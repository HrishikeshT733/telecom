import React, { useState, useEffect } from "react";
import { getAllSims } from "../../api/simApi.js";
import { getAllCustomer } from "../../api/customerApi.js";
import { resetSimulationDate, getSimulationDate } from "../../api/dashboardApi";
import "./HomeAdmin.css"; // custom css file

export default function HomeAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [simulationDate, setSimulationDate] = useState("");

  // 📊 state for counts
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalSims, setTotalSims] = useState(0);
  const [activeSims, setActiveSims] = useState(0);
  const [inactiveSims, setInactiveSims] = useState(0);
  const [pendingSims, setPendingSims] = useState(0);
  const [blockedSims, setBlockedSims] = useState(0);
  const [prepaidSims, setPrepaidSims] = useState(0);
  const [postpaidSims, setPostpaidSims] = useState(0);

  useEffect(() => {
    fetchSimulationDate();
    fetchSummaryData();
  }, []);

  const fetchSimulationDate = async () => {
    try {
      const data = await getSimulationDate();
      setSimulationDate(data.simulationDate);
    } catch {
      setError("Failed to fetch simulation date");
    }
  };

  const fetchSummaryData = async () => {
    try {
      const customers = await getAllCustomer();
      setTotalCustomers(customers.length);

      const sims = await getAllSims();
      setTotalSims(sims.length);

      setActiveSims(sims.filter((s) => s.status === "ACTIVE").length);
      setInactiveSims(sims.filter((s) => s.status === "INACTIVE").length);
      setPendingSims(sims.filter((s) => s.status === "PENDING").length);
      setBlockedSims(sims.filter((s) => s.status === "BLOCKED").length);

      setPrepaidSims(sims.filter((s) => s.simType === "PREPAID").length);
      setPostpaidSims(sims.filter((s) => s.simType === "POSTPAID").length);
    } catch {
      setError("Failed to fetch dashboard data");
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: If you reset the simulation date, all records (bills & usages) will be deleted.\n\nOnly SIMs and Plans will remain.\n\nDo you want to continue?"
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await resetSimulationDate();
      setMessage(data.message || "Simulation reset successfully");
      fetchSimulationDate();
      fetchSummaryData();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-admin">
      <h1 className="title">Admin Dashboard</h1>
      <div className="card info">
  <p>ℹ️ Simulation Info</p>
  <h2 style={{ fontSize: "14px", lineHeight: "1.4", fontWeight: "normal" }}>
    This Telecom Management System runs in a simulated environment where
    <b> 1 day = 30 seconds</b> to generate real-time usage and billing data.
  </h2>
</div>
<br></br>

      {/* Summary Cards */}
      <div className="card-grid">
        <div className="card blue">
          <p>Total Customers</p>
          <h2>{totalCustomers}</h2>
        </div>
        <div className="card purple">
          <p>Total SIMs</p>
          <h2>{totalSims}</h2>
        </div>
        <div className="card green">
          <p>Active SIMs</p>
          <h2>{activeSims}</h2>
        </div>
        <div className="card gray">
          <p>Inactive SIMs</p>
          <h2>{inactiveSims}</h2>
        </div>
        <div className="card yellow">
          <p>Pending SIMs</p>
          <h2>{pendingSims}</h2>
        </div>
        <div className="card red">
          <p>Blocked SIMs</p>
          <h2>{blockedSims}</h2>
        </div>
        <div className="card indigo">
          <p>Prepaid SIMs</p>
          <h2>{prepaidSims}</h2>
        </div>
        <div className="card pink">
          <p>Postpaid SIMs</p>
          <h2>{postpaidSims}</h2>
        </div>
      </div>

      {/* Simulation Reset Section */}
      <div className="reset-box">
        <div className="warning">⚠️</div>
        <p>
          Current Simulation Date:{" "}
          <span className="highlight">{simulationDate || "Loading..."}</span>
        </p>
        <p className="danger-text">
          Resetting will <b>delete all bills ,usage records and Set SIMs to INACTIVE</b>. Only SIMs and Plans remain. and you need to Recharge all Sims
        </p>

        <button onClick={handleReset} disabled={loading} className="reset-btn">
          {loading ? "Resetting..." : "⚠️ Reset Simulation Date"}
        </button>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}
