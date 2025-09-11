import React, { useEffect, useState } from 'react';
import { getPendingSims, approveSim, rejectSim } from '../../api/simApi';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

const AssignSim = () => {
  const [pendingSims, setPendingSims] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingSims();
  }, []);

  const fetchPendingSims = async () => {
    try {
      setLoading(true);
      const data = await getPendingSims();
      setPendingSims(data);
      setError('');
    } catch {
      setError('Failed to fetch pending SIM applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (simId) => {
    try {
      setMessage('');
      setError('');
      await approveSim(simId);
      setMessage('SIM approved successfully');
      fetchPendingSims();
    } catch {
      setError('Failed to approve SIM');
    }
  };

  const handleReject = async (simId) => {
    try {
      setMessage('');
      setError('');
      await rejectSim(simId);
      setMessage('SIM Request Rejected successfully');
      fetchPendingSims();
    } catch {
      setError('Failed to Reject SIM');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h2" gutterBottom>
          Approve Pending SIM Applications
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={fetchPendingSims}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Requested Plan</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SIM Number</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pendingSims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  No pending SIM applications found.
                </TableCell>
              </TableRow>
            ) : (
              pendingSims.map((sim) => (
                <TableRow key={sim.id} hover>
                  <TableCell>{sim.customer_name}</TableCell>
                  <TableCell>{sim.plan_name}</TableCell>
                  <TableCell>{sim.simNumber || '-'}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => handleApprove(sim.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={() => handleReject(sim.id)}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AssignSim;