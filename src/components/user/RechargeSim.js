import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import {
  SimCard as SimIcon,
  Payment as PaymentIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as SuccessIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";
import { viewAllSim } from "../../api/simApi";
import { getAllPlans, getPlanById } from "../../api/planApi";
import { AuthContext } from "../../context/AuthContext";
import { rechargeSim } from "../../api/billApi.js";

const RechargeForm = () => {
  const { user } = useContext(AuthContext);
  const [sims, setSims] = useState([]);
  const [selectedSim, setSelectedSim] = useState("");
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch all sims for dropdown
    viewAllSim(user.id)
      .then((data) =>
        setSims(
          data.filter(
            (sim) => sim.simType === "PREPAID" && sim.status === "INACTIVE"
          )
        )
      )
      .catch(console.error);

    // Fetch plans
    getAllPlans()
      .then((data) =>
        setPlans(data.filter((plan) => plan.type === "PREPAID"))
      )
      .catch(console.error);
  }, [user]);

  const handlePlanChange = async (planId) => {
    setSelectedPlan(planId);
    if (planId) {
      try {
        const plan = await getPlanById(planId);
        setAmount(plan.price);
        setPlanDetails(plan);
      } catch (err) {
        console.error("Error fetching plan:", err);
      }
    } else {
      setAmount("");
      setPlanDetails(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSim || !selectedPlan) {
      setMessage("Please select SIM and Plan.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await rechargeSim({
        simId: selectedSim,
        planId: selectedPlan,
        amount: amount,
      });

      setMessage("Recharge successful!");
      setSelectedSim("");
      setSelectedPlan("");
      setAmount("");
      setPlanDetails(null);
    } catch (error) {
      console.error("Recharge failed:", error);
      setMessage(error.response?.data?.message || "Recharge failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Find selected SIM object
  const selectedSimObj = sims.find(sim => sim.id === selectedSim);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <PaymentIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1">
            Recharge SIM
          </Typography>
        </Box>

        {message && (
          <Alert 
            severity={message.includes("successful") ? "success" : "error"} 
            sx={{ mb: 3 }}
            icon={message.includes("successful") ? <SuccessIcon /> : null}
          >
            {message}
          </Alert>
        )}

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recharge Details
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="sim-select-label">Select SIM</InputLabel>
                    <Select
                      labelId="sim-select-label"
                      value={selectedSim}
                      label="Select SIM"
                      onChange={(e) => setSelectedSim(e.target.value)}
                      required
                    >
                      <MenuItem value="">
                        <em>Select SIM Card</em>
                      </MenuItem>
                      {sims.map((sim) => (
                        <MenuItem key={sim.id} value={sim.id}>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                            {sim.phoneNumber || sim.simNumber}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="plan-select-label">Select Plan</InputLabel>
                    <Select
                      labelId="plan-select-label"
                      value={selectedPlan}
                      label="Select Plan"
                      onChange={(e) => handlePlanChange(e.target.value)}
                      required
                    >
                      <MenuItem value="">
                        <em>Select Recharge Plan</em>
                      </MenuItem>
                      {plans.map((plan) => (
                        <MenuItem key={plan.id} value={plan.id}>
                          {plan.name} - ₹{plan.price}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    value={amount}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <WalletIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    placeholder="Amount will be auto-filled based on plan"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Recharge Now"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Plan Details Card */}
        {planDetails && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plan Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Plan Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {planDetails.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Price
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ₹{planDetails.price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Validity
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {planDetails.validity} days
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Data
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {planDetails.data} GB
                  </Typography>
                </Grid>
                {planDetails.description && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      {planDetails.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Selected SIM Details */}
        {selectedSimObj && (
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SIM Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedSimObj.phoneNumber || selectedSimObj.simNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Status
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedSimObj.status}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default RechargeForm;