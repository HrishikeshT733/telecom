import React, { useState, useEffect } from "react";
import { getAllSims } from "../../api/simApi.js";
import { getAllCustomer } from "../../api/customerApi.js";
import { resetSimulationDate, getSimulationDate } from "../../api/dashboardApi";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  SimCard as SimCardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Block as BlockIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  RestartAlt as RestartAltIcon
} from '@mui/icons-material';

export default function HomeAdmin() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [simulationDate, setSimulationDate] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

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

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = async () => {
    setResetDialogOpen(false);
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

  const handleResetCancel = () => {
    setResetDialogOpen(false);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box color={color}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>

      {/* Info Card */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'info.light' }}>
        <Box display="flex" alignItems="flex-start">
          <InfoIcon color="info" sx={{ mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Simulation Info
            </Typography>
            <Typography variant="body2">
              This Telecom Management System runs in a simulated environment where
              <b> 1 day = 30 seconds</b> to generate real-time usage and billing data.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Customers" 
            value={totalCustomers} 
            icon={<PeopleIcon fontSize="large" />} 
            color="#2196f3" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total SIMs" 
            value={totalSims} 
            icon={<SimCardIcon fontSize="large" />} 
            color="#9c27b0" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active SIMs" 
            value={activeSims} 
            icon={<CheckCircleIcon fontSize="large" />} 
            color="#4caf50" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Inactive SIMs" 
            value={inactiveSims} 
            icon={<CancelIcon fontSize="large" />} 
            color="#9e9e9e" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending SIMs" 
            value={pendingSims} 
            icon={<PendingIcon fontSize="large" />} 
            color="#ff9800" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Blocked SIMs" 
            value={blockedSims} 
            icon={<BlockIcon fontSize="large" />} 
            color="#f44336" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Prepaid SIMs" 
            value={prepaidSims} 
            icon={<PaymentIcon fontSize="large" />} 
            color="#3f51b5" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Postpaid SIMs" 
            value={postpaidSims} 
            icon={<ReceiptIcon fontSize="large" />} 
            color="#e91e63" 
          />
        </Grid>
      </Grid>

      {/* Simulation Reset Section */}
      <Paper elevation={3} sx={{ p: 3, border: '1px solid', borderColor: 'warning.main' }}>
        <Box display="flex" alignItems="flex-start" mb={2}>
          <WarningIcon color="warning" sx={{ mr: 2, mt: 0.5 }} />
          <Typography variant="h6" color="warning.dark">
            Simulation Control
          </Typography>
        </Box>
        
        <Typography variant="body1" gutterBottom>
          Current Simulation Date: <Typography component="span" fontWeight="bold" color="primary">
            {simulationDate || "Loading..."}
          </Typography>
        </Typography>
        
        <Alert severity="warning" sx={{ my: 2 }}>
          Resetting will <b>delete all bills, usage records and Set SIMs to INACTIVE</b>. Only SIMs and Plans remain, and you will need to Recharge all SIMs.
        </Alert>

        <Button
          variant="contained"
          color="warning"
          startIcon={loading ? <CircularProgress size={20} /> : <RestartAltIcon />}
          onClick={handleResetClick}
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? "Resetting..." : "Reset Simulation Date"}
        </Button>

        {message && (
          <Alert severity="success" sx={{ mt: 2 }} onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleResetCancel}
        aria-labelledby="reset-dialog-title"
      >
        <DialogTitle id="reset-dialog-title">
          <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Confirm Simulation Reset
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>WARNING:</strong> If you reset the simulation date, all records (bills & usages) will be deleted.
            Only SIMs and Plans will remain. All SIMs will be set to INACTIVE status and you will need to recharge them.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="warning" variant="contained" autoFocus>
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}