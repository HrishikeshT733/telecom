import React, { useEffect, useState } from "react";
import { getAllCustomer } from "../../api/customerApi";
import { viewAllSim } from "../../api/simApi";
import { getAllBills } from "../../api/billApi.js";
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
  CircularProgress
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  SimCard as SimCardIcon
} from '@mui/icons-material';

const BillManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSims, setCustomerSims] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSim, setSelectedSim] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [billLoading, setBillLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomer();
      setCustomers(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = async (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedSim("");
    setBills([]);
    setCustomerSims([]);

    if (customerId) {
      setSimLoading(true);
      try {
        const sims = await viewAllSim(customerId);
        setCustomerSims(Array.isArray(sims) ? sims : []);
        setError("");
      } catch {
        setError("Failed to fetch SIMs for customer");
      } finally {
        setSimLoading(false);
      }
    }
  };

  const handleSimChange = async (phoneNumber) => {
    setSelectedSim(phoneNumber);
    setBills([]);

    if (phoneNumber) {
      setBillLoading(true);
      try {
        const data = await getAllBills();

        // Normalize bills into an array
        let billsArray = [];
        if (Array.isArray(data)) {
          billsArray = data;
        } else if (data && typeof data === "object") {
          billsArray = [data];
        }

        // Filter bills for selected SIM
        const simBills = billsArray.filter(
          (b) => b?.sim?.phoneNumber?.toString() === phoneNumber.toString()
        );

        setBills(simBills);
        setError("");
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError("Failed to fetch bills");
        setBills([]);
      } finally {
        setBillLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "default";
    status = status.toLowerCase();
    if (status === "paid") return "success";
    if (status === "pending") return "warning";
    if (status === "overdue") return "error";
    return "default";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1 }} /> Bill Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 3 }}>
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

      {billLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {selectedSim && bills.length > 0 && (
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bills for SIM: {selectedSim}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {bills.length} bill{bills.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Amount (Rs)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Generated Date</TableCell>
                  <TableCell>SIM Type</TableCell>
                  <TableCell>Paid Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill?.id || Math.random()} hover>
                    <TableCell>{bill?.id ?? "N/A"}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        Rs. {bill?.amount ?? "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={bill?.status ?? "N/A"} 
                        size="small"
                        color={getStatusColor(bill?.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {bill?.generatedDate
                        ? new Date(bill.generatedDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={bill?.simType ?? "N/A"} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {bill?.billPaiddate
                        ? new Date(bill.billPaiddate).toLocaleDateString()
                        : "Not Paid"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedSim && !billLoading && bills.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Bills Found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            No bill data found for the selected SIM.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BillManagement;