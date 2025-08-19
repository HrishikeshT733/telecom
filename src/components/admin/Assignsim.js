import React, { useEffect, useState } from 'react';
import { getPendingSims, approveSim, rejectSim } from '../../api/simApi'; // Create simApi.js accordingly
import axios from 'axios';

const AssignSim = () => {
  const [pendingSims, setPendingSims] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingSims();
  }, []);

  const fetchPendingSims = async () => {
    try {
      const data = await getPendingSims();
      setPendingSims(data);
    } catch {
      setError('Failed to fetch pending SIM applications');
    }
  };

  const handleApprove = async (simId) => {
    try {
      await approveSim(simId);
      setMessage('SIM approved successfully');
      fetchPendingSims();
    } catch {
      setError('Failed to approve SIM');
    }
  };

    const handleReject = async (simId) => {
    try {
      await rejectSim(simId);
      setMessage('SIM Request Rejected successfully');
      fetchPendingSims();
    } catch {
      setError('Failed to Reject SIM');
    }
  };

  return (
    <div>
      <h2>Approve Pending SIM Applications</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Requested Plan</th>
            <th>SIM Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingSims.map((sim) => (
            <tr key={sim.id}>
              <td>{sim.customer_name}</td>
              <td>{sim.plan_name}</td>
              <td>{sim.simNumber || '-'}</td>
              <td>
                <button onClick={() => handleApprove(sim.id)}>Approve</button>
                 <button onClick={() => handleReject(sim.id)}>Reject</button>
              </td>
            </tr>
          ))}
          {pendingSims.length === 0 && (
            <tr>
              <td colSpan="4">No pending SIM applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignSim;
