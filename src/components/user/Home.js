import React, { useState, useEffect ,useContext} from "react";
import "./HomeUser.css";
import { viewAllSim } from "../../api/simApi.js";
import { getBillsByCustomer } from "../../api/billApi.js";
import { AuthContext } from "../../context/AuthContext.js";

export default function HomeUser() {
  const [sims, setSims] = useState([]);
  const [bills, setBills] = useState([]);
 const { user } = useContext(AuthContext);
  // sim counts
  const [activeSims, setActiveSims] = useState(0);
  const [inactiveSims, setInactiveSims] = useState(0);
  const [pendingSims, setPendingSims] = useState(0);
  const [blockedSims, setBlockedSims] = useState(0);
  const [prepaidSims, setPrepaidSims] = useState(0);
  const [postpaidSims, setPostpaidSims] = useState(0);

  // bill counts
  const [paidBills, setPaidBills] = useState(0);
  const [unpaidBills, setUnpaidBills] = useState(0);

  useEffect(() => {
    fetchData();
    
  }, []);

  const fetchData = async () => {
    try {
      // fetch sims
      const simData = await viewAllSim(user.id);
      setSims(simData);

      setActiveSims(simData.filter((s) => s.status === "ACTIVE").length);
      setInactiveSims(simData.filter((s) => s.status === "INACTIVE").length);
      setPendingSims(simData.filter((s) => s.status === "PENDING").length);
      setBlockedSims(simData.filter((s) => s.status === "BLOCKED").length);

      setPrepaidSims(simData.filter((s) => s.simType === "PREPAID").length);
      setPostpaidSims(simData.filter((s) => s.simType === "POSTPAID").length);

      // fetch bills
      const billData = await getBillsByCustomer(user.id);
      setBills(billData);

      setPaidBills(billData.filter((b) => b.status === "PAID").length);
      setUnpaidBills(billData.filter((b) => b.status === "UNPAID").length);
     
    } catch (err) {
      console.error("Failed to fetch user dashboard data:", err);
    }
  };

  return (
    <div className="home-user">
      <h1 className="title" style={{textAlign:"center"}} >User Dashboard</h1>

      {/* Simulation Info Card */}
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
        <div className="card blue">
          <p>Paid Bills</p>
          <h2>{paidBills}</h2>
        </div>
        <div className="card orange">
          <p>Unpaid Bills</p>
          <h2>{unpaidBills}</h2>
        </div>
      </div>
    </div>
  );
}
