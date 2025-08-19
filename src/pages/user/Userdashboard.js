import React from 'react';
import Navbar from '../../components/Navbar.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import ApplySim from '../../components/user/ApplySim.js';
import MyPlans from '../../components/user/Myplans.js';
import MyUsages from '../../components/user/Myusages.js';
import ActivePlans from '../../components/user/ActivePlans.js';
import RechargeForm from '../../components/user/RechargeSim.js';
import BillList from '../../components/user/BillList.js';
import ChangePlanPostpaid from '../../components/user/ChangePlanPostpaid.js';
const UserDashboard = () => {
  return (
    <div>
            <Navbar
        role="USER"
      />



      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Default redirect to plans */}
         <Route path="/" element={<Navigate to="my-plans" replace />} /> 

          {/* Plans page */}
          <Route path="my-plans" element={<MyPlans />} />

          {/* Usages page */}
          <Route path="my-usages" element={<MyUsages />} />

          {/* Assign SIM page */}
          <Route path="apply-sim" element={<ApplySim />} />

           {/* Active Sim Plans */}
          <Route path="Active-Plans" element={<ActivePlans />} />
           <Route path="Recharge-SIM" element={<RechargeForm />} />
             <Route path="BillList" element={<BillList />}/>
                  <Route path="ChangePlanPostpaid" element={<ChangePlanPostpaid />}/>
             

          {/* Optional: Catch all - redirect to plans */}
           <Route path="*" element={<Navigate to="my-plans" replace />} /> 
        </Routes>
      </div>
    </div>
    
  );
};

export default UserDashboard;
