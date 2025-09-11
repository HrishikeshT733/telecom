import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getBillsByCustomer,
  payBillToChangePlan,
  payBillToContinueSamePlan,
} from "../../api/billApi";
import { viewAllSim } from "../../api/simApi";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Payment as PaymentIcon,
  FilterList as FilterIcon,
  Receipt as BillIcon
} from '@mui/icons-material';

export default function BillList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize states to empty arrays to prevent undefined
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPhone, setFilterPhone] = useState("ALL");
  const [allPhones, setAllPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    bill: null
  });

  useEffect(() => {
    if (user?.id) {
      fetchBills(user.id);
      fetchPhones(user.id);
    }
  }, [user]);

  const fetchBills = async (customerId) => {
    try {
      setLoading(true);
      const data = await getBillsByCustomer(customerId);
      setBills(Array.isArray(data) ? data : []); // Safe check
      setError("");
    } catch (err) {
      setError("Failed to fetch bills. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPhones = async (customerId) => {
    try {
      const sims = await viewAllSim(customerId);
      const phones = Array.isArray(sims)
        ? sims.map((sim) => sim.phoneNumber).filter(Boolean)
        : [];
      setAllPhones(phones);
    } catch (err) {
      console.error("Failed to fetch SIM phone numbers", err);
    }
  };

  const handlePaymentClick = (bill) => {
    setPaymentDialog({
      open: true,
      bill: bill
    });
  };

  const handlePaymentConfirm = async (changePlan) => {
    const { bill } = paymentDialog;
    
    try {
      if (changePlan) {
        await payBillToChangePlan(user.id, bill.id, {
          simId: bill.sim?.id,
          planId: bill.plan?.id,
          amount: bill.amount,
        });
        alert("Payment successful! Redirecting to change plan page...");
        navigate(`/user/ChangePlanPostpaid`);
      } else {
        await payBillToContinueSamePlan(user.id, bill.id, {
          simId: bill.sim?.id,
          planId: bill.plan?.id,
          amount: bill.amount,
        });
        alert("Payment successful! Continuing with the same plan.");
        fetchBills(user.id);
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setPaymentDialog({ open: false, bill: null });
    }
  };

  const handlePaymentCancel = () => {
    setPaymentDialog({ open: false, bill: null });
  };

  const filteredBills = bills
    .filter(
      (bill) => filterStatus === "ALL" || bill.status?.toUpperCase() === filterStatus
    )
    .filter(
      (bill) => filterPhone === "ALL" || bill.sim?.phoneNumber === filterPhone
    );

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PAID": return "success";
      case "UNPAID": return "error";
      case "PENDING": return "warning";
      default: return "default";
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <BillIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Bills
        </Typography>
      </Box>

      {/* Filter Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="h6">Filter Bills</Typography>
        </Box>
        
        <Box display="flex" gap={3} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="ALL">All Status</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="UNPAID">Unpaid</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="phone-filter-label">Phone Number</InputLabel>
            <Select
              labelId="phone-filter-label"
              value={filterPhone}
              label="Phone Number"
              onChange={(e) => setFilterPhone(e.target.value)}
            >
              <MenuItem value="ALL">All Numbers</MenuItem>
              {allPhones.map((phone) => (
                <MenuItem key={phone} value={phone}>
                  {phone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : Array.isArray(filteredBills) && filteredBills.length > 0 ? (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bill ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Month</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Generated Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paid Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Plan</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>SIM Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Extra Data (GB)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Extra Calls (Min)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id} hover>
                  <TableCell>{bill.id}</TableCell>
                  <TableCell>{bill.month}</TableCell>
                  <TableCell>₹{bill.amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bill.status} 
                      color={getStatusColor(bill.status)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {bill.generatedDate
                      ? new Date(bill.generatedDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {bill.billPaiddate
                      ? new Date(bill.billPaiddate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>{bill.plan?.name || "-"}</TableCell>
                  <TableCell>{bill.sim?.phoneNumber || "-"}</TableCell>
                  <TableCell>{bill.simType || "-"}</TableCell>
                  <TableCell>{bill.extraDataUsed ?? 0}</TableCell>
                  <TableCell>{bill.extraCallUsed ?? 0}</TableCell>
                  <TableCell>
                    {bill.status === "UNPAID" ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePaymentClick(bill)}
                      >
                        Pay
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No bills found
          </Typography>
        </Paper>
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={paymentDialog.open}
        onClose={handlePaymentCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payment Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to change your plan after this payment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentCancel}>Cancel</Button>
          <Button 
            onClick={() => handlePaymentConfirm(false)}
            variant="outlined"
          >
            Continue Same Plan
          </Button>
          <Button 
            onClick={() => handlePaymentConfirm(true)}
            variant="contained"
            autoFocus
          >
            Change Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}