import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import {
  Person as PersonIcon,
  SimCard as SimIcon,
  DataUsage as UsageIcon,
  TrendingUp as TrendingIcon
} from "@mui/icons-material";
import { getAllCustomer } from "../../api/customerApi";
import { viewAllSim } from "../../api/simApi";
import { getAllUsages } from "../../api/usageApi";

const Usages = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSims, setCustomerSims] = useState([]); 
  const [usages, setUsages] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSim, setSelectedSim] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    customers: false,
    sims: false,
    usages: false
  });
  const [stats, setStats] = useState({
    totalData: 0,
    totalCalls: 0,
    averageData: 0,
    averageCalls: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (usages.length > 0) {
      calculateStats();
    }
  }, [usages]);

  const fetchCustomers = async () => {
    setLoading(prev => ({ ...prev, customers: true }));
    setError("");
    try {
      const data = await getAllCustomer();
      setCustomers(data);
    } catch (err) {
      setError("Failed to fetch customers");
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const calculateStats = () => {
    const totalData = usages.reduce((sum, usage) => sum + (usage.dataUsed || 0), 0);
    const totalCalls = usages.reduce((sum, usage) => sum + (usage.callMinutesUsed || 0), 0);
    const averageData = usages.length > 0 ? totalData / usages.length : 0;
    const averageCalls = usages.length > 0 ? totalCalls / usages.length : 0;
    
    setStats({
      totalData,
      totalCalls,
      averageData,
      averageCalls
    });
  };

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedSim("");
    setUsages([]);
    setCustomerSims([]);
    setError("");

    if (customerId) {
      setLoading(prev => ({ ...prev, sims: true }));
      try {
        const sims = await viewAllSim(customerId);
        setCustomerSims(sims);
      } catch (err) {
        setError("Failed to fetch SIMs for customer");
      } finally {
        setLoading(prev => ({ ...prev, sims: false }));
      }
    }
  };

  const handleSimChange = async (phoneNumber) => {
    setSelectedSim(phoneNumber);
    setUsages([]);
    setError("");

    if (phoneNumber) {
      setLoading(prev => ({ ...prev, usages: true }));
      try {
        const data = await getAllUsages();
        // Filter usages for that sim only
        const simUsages = data.filter(
          (u) => u.simCardPhoneNumber?.toString() === phoneNumber.toString()
        );
        setUsages(simUsages);
      } catch (err) {
        setError("Failed to fetch usage data");
      } finally {
        setLoading(prev => ({ ...prev, usages: false }));
      }
    }
  };

  const getSimTypeColor = (type) => {
    return type === 'PREPAID' ? 'primary' : 'secondary';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <UsageIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Usage Tracking
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Selection Controls */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Usage Data
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="customer-select-label">Customer</InputLabel>
                  <Select
                    labelId="customer-select-label"
                    value={selectedCustomer}
                    label="Customer"
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    disabled={loading.customers}
                  >
                    <MenuItem value="">
                      <em>Select Customer</em>
                    </MenuItem>
                    {customers.map((cust) => (
                      <MenuItem key={cust.id} value={cust.id}>
                        <Box display="flex" alignItems="center">
                          <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                          {cust.name} (ID: {cust.id})
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!selectedCustomer || loading.sims}>
                  <InputLabel id="sim-select-label">SIM Card</InputLabel>
                  <Select
                    labelId="sim-select-label"
                    value={selectedSim}
                    label="SIM Card"
                    onChange={(e) => handleSimChange(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select SIM Card</em>
                    </MenuItem>
                    {customerSims.map((sim) => (
                      <MenuItem key={sim.id} value={sim.phoneNumber}>
                        <Box display="flex" alignItems="center">
                          <SimIcon sx={{ mr: 1, fontSize: 20 }} />
                          {sim.phoneNumber}
                          {sim.type && (
                            <Chip 
                              label={sim.type} 
                              size="small" 
                              color={getSimTypeColor(sim.type)}
                              sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {selectedSim && usages.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingIcon color="primary" />
                  <Typography variant="h5" component="div">
                    {usages.length}
                  </Typography>
                  <Typography color="textSecondary">
                    Usage Records
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <UsageIcon color="primary" />
                  <Typography variant="h5" component="div">
                    {stats.totalData.toFixed(2)} MB
                  </Typography>
                  <Typography color="textSecondary">
                    Total Data Used
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SimIcon color="primary" />
                  <Typography variant="h5" component="div">
                    {stats.totalCalls} mins
                  </Typography>
                  <Typography color="textSecondary">
                    Total Call Minutes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingIcon color="primary" />
                  <Typography variant="h5" component="div">
                    {stats.averageData.toFixed(2)} MB
                  </Typography>
                  <Typography color="textSecondary">
                    Avg. Data per Record
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Loading Indicator */}
        {loading.usages && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Usages Table */}
        {selectedSim && usages.length > 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Details for {selectedSim}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Data Used (MB)</TableCell>
                      <TableCell align="right">Call Minutes</TableCell>
                      <TableCell>SIM Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usages.map((usage) => (
                      <TableRow key={usage.id}>
                        <TableCell>
                          {new Date(usage.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          {usage.dataUsed}
                        </TableCell>
                        <TableCell align="right">
                          {usage.callMinutesUsed}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={usage.type || 'N/A'} 
                            size="small" 
                            color={getSimTypeColor(usage.type)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* No data message */}
        {selectedSim && !loading.usages && usages.length === 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            No usage data found for this SIM card.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Usages;