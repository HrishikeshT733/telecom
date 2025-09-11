import React, { useEffect, useState, useContext } from "react";
import { getAllPlans } from "../../api/planApi.js";
import { changePlanPostpaid, simById, viewAllSim, ActivateNewPlanPostpaid } from "../../api/simApi.js";
import { getBillsByCustomer } from "../../api/billApi.js";
import { AuthContext } from "../../context/AuthContext.js";
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
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  SwapHoriz as ChangePlanIcon,
  SimCard as SimCardIcon,
  Info as InfoIcon,
  CheckCircle as EligibleIcon,
  Cancel as IneligibleIcon
} from '@mui/icons-material';

export default function ChangePlanPostpaid() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedSimId, setSelectedSimId] = useState("");
  const [sims, setSims] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [simDetails, setSimDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUserSims();
  }, []);

  const fetchUserSims = async () => {
    try {
      setLoading(true);
      const allSims = await viewAllSim(user.id);
      const postpaidSims = allSims.filter(sim => sim.plan?.type === "POSTPAID");
      setSims(postpaidSims);
      setError("");
    } catch {
      setError("Failed to load your SIMs.");
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (simId) => {
    try {
      setCheckingEligibility(true);
      setError("");
      setIsEligible(false);
      setSelectedPlanId("");
      
      const sim = await simById(simId);
      setSimDetails(sim);

      // Unpaid bills check
      let bills = await getBillsByCustomer(user.id);
      bills = bills || []; // ✅ fallback to empty array if null/undefined

      const unpaidBills = bills.filter(
        (bill) => bill.sim?.id === parseInt(simId) && bill.status === "UNPAID"
      );

      if (unpaidBills.length > 0) {
        setError("You have unpaid bills. Please pay them before changing the plan.");
        setIsEligible(false);
        return;
      }

      // Active plan check
      if (sim.status === "ACTIVE") {
        setError("You already have an active plan. Wait until it expires before changing.");
        setIsEligible(false);
        return;
      }

      // ✅ Eligible
      setIsEligible(true);
      fetchPlans();
    } catch (err) {
      setError("Failed to check SIM eligibility.");
    } finally {
      setCheckingEligibility(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      const postpaidPlans = data.filter((plan) => plan.type === "POSTPAID");
      setPlans(postpaidPlans);
    } catch {
      setError("Failed to load plans.");
    }
  };

  const handleSimChange = (e) => {
    const simId = e.target.value;
    setSelectedSimId(simId);
    if (simId) {
      checkEligibility(simId);
    } else {
      setIsEligible(false);
      setSelectedPlanId("");
    }
  };

  const handlePlanChange = (e) => {
    setSelectedPlanId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedPlanId) {
      setError("Please select a plan.");
      return;
    }

    try {
      setLoading(true);
      await ActivateNewPlanPostpaid(selectedSimId, { planId: parseInt(selectedPlanId) });
      setSuccessMsg("Plan changed successfully!");
      setSelectedPlanId("");
      setSelectedSimId("");
      setIsEligible(false);
      fetchUserSims(); // Refresh the SIM list
    } catch (err) {
      setError(err.response?.data || "Failed to change plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <ChangePlanIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h1" fontWeight="bold">
              Change Postpaid Plan
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          )}

          {/* SIM selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="sim-select-label">Select Your SIM</InputLabel>
            <Select
              labelId="sim-select-label"
              id="sim-select"
              value={selectedSimId}
              label="Select Your SIM"
              onChange={handleSimChange}
              disabled={loading}
            >
              <MenuItem value="">
                <em>-- Select a SIM --</em>
              </MenuItem>
              {sims.map((sim) => (
                <MenuItem key={sim.id} value={sim.id}>
                  {sim.phoneNumber} ({sim.plan?.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {checkingEligibility && (
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Checking eligibility...
              </Typography>
            </Box>
          )}

          {selectedSimId && !checkingEligibility && (
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: isEligible ? 'success.light' : 'error.light',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isEligible ? (
                <EligibleIcon color="success" sx={{ mr: 1 }} />
              ) : (
                <IneligibleIcon color="error" sx={{ mr: 1 }} />
              )}
              <Typography variant="body2">
                {isEligible 
                  ? "This SIM is eligible for plan change. Please select a new plan below."
                  : "This SIM is not eligible for plan change. Please resolve any issues mentioned above."
                }
              </Typography>
            </Paper>
          )}

          {/* Plan change form */}
          {isEligible && (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="plan-select-label">Select New Plan</InputLabel>
                <Select
                  labelId="plan-select-label"
                  id="plan-select"
                  value={selectedPlanId}
                  label="Select New Plan"
                  onChange={handlePlanChange}
                  required
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>-- Select a plan --</em>
                  </MenuItem>
                  {plans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price} ({plan.dataLimit}GB, {plan.callLimit} mins)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !selectedPlanId}
                startIcon={loading ? <CircularProgress size={20} /> : <ChangePlanIcon />}
              >
                {loading ? "Changing Plan..." : "Change Plan"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}