import React, { useState, useEffect, useContext } from "react";
import { viewAllSim } from "../../api/simApi.js";
import { getBillsByCustomer } from "../../api/billApi.js";
import { getSimulationDate } from "../../api/dashboardApi";
import { AuthContext } from "../../context/AuthContext.js";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  SimCard as SimCardIcon,
  Receipt as BillIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Pending as PendingIcon,
  Block as BlockedIcon,
  Payment as PrepaidIcon,
  ReceiptLong as PostpaidIcon,
  Paid as PaidIcon,
  MoneyOff as UnpaidIcon,
  Info as InfoIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

export default function HomeUser() {
  const [sims, setSims] = useState([]);
  const [bills, setBills] = useState([]);
  const [simulationDate, setSimulationDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      setLoading(true);
      
      // Fetch simulation date
      const simDateData = await getSimulationDate();
      setSimulationDate(simDateData.simulationDate);
      
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
      
      setError("");
    } catch (err) {
      console.error("Failed to fetch user dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, iconColor }) => (
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
          <Box color={iconColor || color}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" textAlign="center">
        User Dashboard
      </Typography>

      {/* Simulation Info Card */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'info.light' }}>
        <Box display="flex" alignItems="flex-start">
          <InfoIcon color="info" sx={{ mr: 2, mt: 0.5 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Simulation Info
            </Typography>
            <Typography variant="body2" gutterBottom>
              This Telecom Management System runs in a simulated environment where
              <b> 1 day = 30 seconds</b> to generate real-time usage and billing data.
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <CalendarIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Current Simulation Date: <Typography component="span" fontWeight="bold" color="primary">
                  {simulationDate || "Loading..."}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active SIMs" 
            value={activeSims} 
            icon={<ActiveIcon fontSize="large" />} 
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Inactive SIMs" 
            value={inactiveSims} 
            icon={<InactiveIcon fontSize="large" />} 
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
            icon={<BlockedIcon fontSize="large" />} 
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Prepaid SIMs" 
            value={prepaidSims} 
            icon={<PrepaidIcon fontSize="large" />} 
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Postpaid SIMs" 
            value={postpaidSims} 
            icon={<PostpaidIcon fontSize="large" />} 
            color="#e91e63"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Paid Bills" 
            value={paidBills} 
            icon={<PaidIcon fontSize="large" />} 
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Unpaid Bills" 
            value={unpaidBills} 
            icon={<UnpaidIcon fontSize="large" />} 
            color="#ff5722"
          />
        </Grid>
      </Grid>

      {/* Additional Stats Summary */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <SimCardIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Total SIMs: {sims.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <BillIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Total Bills: {bills.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}