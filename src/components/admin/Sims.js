import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../../api/customerApi";
import { viewAllSim } from "../../api/simApi";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Chip,
  Grid,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  SimCard as SimCardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccountBalance as BalanceIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const SimInformation = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSims, setCustomerSims] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerObj, setSelectedCustomerObj] = useState(null);
  const [selectedSim, setSelectedSim] = useState("");
  const [simDetails, setSimDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomer();
      setCustomers(data);
      setError("");
    } catch {
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    const customer = customers.find((c) => c.id.toString() === customerId.toString()) || null;
    setSelectedCustomerObj(customer);
    setSelectedSim("");
    setSimDetails(null);
    setCustomerSims([]);

    if (customerId) {
      setSimLoading(true);
      try {
        const sims = await viewAllSim(customerId);
        setCustomerSims(sims);
        setError("");
      } catch {
        setError("Failed to fetch SIMs for customer");
      } finally {
        setSimLoading(false);
      }
    }
  };

  const handleSimChange = (phoneNumber) => {
    setSelectedSim(phoneNumber);
    
    if (phoneNumber) {
      const sim = customerSims.find(
        (s) => s.phoneNumber?.toString() === phoneNumber.toString()
      );
      setSimDetails(sim || null);
    } else {
      setSimDetails(null);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "default";
    status = status.toLowerCase();
    if (status === "active") return "success";
    if (status === "inactive") return "error";
    if (status === "suspended") return "warning";
    return "default";
  };

  const getSimTypeColor = (type) => {
    if (!type) return "default";
    type = type.toLowerCase();
    if (type === "prepaid") return "primary";
    if (type === "postpaid") return "secondary";
    return "default";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SimCardIcon sx={{ mr: 1 }} /> SIM Information
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select Customer"
              value={selectedCustomer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            >
              <MenuItem value="">
                <em>Select Customer</em>
              </MenuItem>
              {customers.map((cust) => (
                <MenuItem key={cust.id} value={cust.id}>
                  {cust.name} (ID: {cust.id})
                </MenuItem>
              ))}
            </TextField>
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Loading customers...</Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select SIM"
              value={selectedSim}
              onChange={(e) => handleSimChange(e.target.value)}
              disabled={!selectedCustomer || simLoading || customerSims.length === 0}
              InputProps={{
                startAdornment: <SimCardIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            >
              <MenuItem value="">
                <em>Select SIM</em>
              </MenuItem>
              {customerSims.map((sim) => (
                <MenuItem key={sim.id} value={sim.phoneNumber}>
                  {sim.phoneNumber}
                </MenuItem>
              ))}
            </TextField>
            {simLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Loading SIMs...</Typography>
              </Box>
            )}
            {selectedCustomer && !simLoading && customerSims.length === 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                No SIMs found for this customer
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {selectedSim && simDetails && (
        <Paper>
          <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h6">
              SIM Details: {simDetails.phoneNumber}
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>SIM Number (ICCID)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Activation Date</TableCell>
                  <TableCell>SIM Type</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Phone Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>{simDetails.id}</TableCell>
                  <TableCell>{simDetails.simNumber}</TableCell>
                  <TableCell>
                    <Chip 
                      label={simDetails.status} 
                      size="small"
                      color={getStatusColor(simDetails.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {simDetails.activationDate ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {new Date(simDetails.activationDate).toLocaleDateString()}
                      </Box>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={simDetails.simType} 
                      size="small"
                      color={getSimTypeColor(simDetails.simType)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{selectedCustomerObj?.id}</TableCell>
                  <TableCell>{selectedCustomerObj?.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={simDetails.plan?.name || "N/A"} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BalanceIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                      Rs. {simDetails.balance}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {simDetails.phoneNumber}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedSim && !simDetails && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <SimCardIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No SIM Details Found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            No SIM data found for the selected phone number.
          </Typography>
        </Paper>
      )}

      {!selectedSim && selectedCustomer && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <SimCardIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Select a SIM
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please select a SIM from the dropdown to view details
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SimInformation;