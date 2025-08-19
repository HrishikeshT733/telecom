
import React from 'react';
import Navbar from '../../components/Navbar.js';
import { Routes, Route, Navigate } from 'react-router-dom';

import Plans from '../../components/admin/Plan.js';
import Usages from '../../components/admin/Usages.js';
import AssignSim from '../../components/admin/Assignsim.js';
import Bills from '../../components/admin/Bills.js';
import Sims from '../../components/admin/Sims.js';
import Home from '../../components/admin/Home.js';
import HomeAdmin from '../../components/admin/Home.js';
const AdminDashboard = () => {
  return (
    <div>
      <Navbar role="ADMIN" />

      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Default redirect to plans */}
         <Route path="/" element={<Navigate to="homeAdmin" replace />} /> 

          {/* Plans page */}
          <Route path="plans" element={<Plans />} />

          {/* Usages page */}
          <Route path="usages" element={<Usages />} />

          {/* Assign SIM page */}
          <Route path="assign-sim" element={<AssignSim />} />

          {/* Optional: Catch all - redirect to plans */}
           <Route path="*" element={<Navigate to="homeAdmin" replace />} /> 

            <Route path="bills" element={<Bills />} />
                <Route path="sims" element={<Sims/>} />
                 <Route path="homeAdmin" element={<HomeAdmin/>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
