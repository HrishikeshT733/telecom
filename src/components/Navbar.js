import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext.js'; // adjust path accordingly

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const { logoutUser, timeLeft } = useContext(AuthContext);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logo}>Telecom Management</span>

       

        {role === "ADMIN" && (
          <>
           <Link to="/admin/homeAdmin" style={styles.link}>Home</Link>
            <Link to="/admin/plans" style={styles.link}>Plans</Link>
            <Link to="/admin/usages" style={styles.link}>All Usages</Link>
             <Link to="/admin/bills" style={styles.link}>All Bills</Link>
             <Link to="/admin/sims" style={styles.link}>All SIMs</Link>
            <Link to="/admin/assign-sim" style={styles.link}>Assign SIM</Link>

          </>
        )}

        {role === "USER" && (
          <>
           <Link to="/user/homeUser" style={styles.link}>Home</Link>
            <Link to="/user/my-usages" style={styles.link}>My Usages</Link>
            <Link to="/user/apply-sim" style={styles.link}>Apply SIM</Link>
            <Link to="/user/my-plans" style={styles.link}>My Plans</Link>
            <Link to="/user/Active-Plans" style={styles.link}>Active Plans</Link>
            <Link to="/user/Recharge-SIM" style={styles.link}>Recharge SIM(Prepaid)</Link>
            <Link to="/user/BillList" style={styles.link}>Bills(POSTPAID)</Link>
             <Link to="/user/ChangePlanPostpaid" style={styles.link}>ChangePlanPostpaid(POSTPAID)</Link>
             
          </>
        )}
      </div>

      <div style={styles.right}>
        <span style={styles.timer}>⏳ {formatTime(timeLeft)}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#0d6efd",
    padding: "10px 20px",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  left: { display: "flex", alignItems: "center", gap: "15px" },
  right: { display: "flex", alignItems: "center", gap: "10px" },
  logo: { fontWeight: "bold", fontSize: "18px" },
  link: { color: "#fff", textDecoration: "none", fontSize: "14px" },
  logoutBtn: {
    background: "red",
    border: "none",
    padding: "6px 12px",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px"
  },
  timer: { background: "#198754", padding: "5px 8px", borderRadius: "4px" }
};
