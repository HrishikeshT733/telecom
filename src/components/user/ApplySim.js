import React, { useEffect, useState, useContext } from "react";
import { getAllPlans } from "../../api/planApi.js";
import { applySim } from "../../api/simApi.js";
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
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  SimCard as SimCardIcon,
  Info as InfoIcon
} from '@mui/icons-material';

export default function ApplySim() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      const data = await getAllPlans();
      setPlans(data);
      setError("");
    } catch {
      setError("Failed to load plans.");
    } finally {
      setPlansLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    
    if (!selectedPlanId) {
      setError("Please select a plan.");
      return;
    }

    const simData = {};

    try {
      setLoading(true);
      await applySim(simData, user.id, selectedPlanId);
      setSuccessMsg("SIM application submitted successfully.");
      setSelectedPlanId("");
    } catch(err) {
      setError(err.response?.data?.message || "Failed to submit SIM application.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (event) => {
    setSelectedPlanId(event.target.value);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SimCardIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5" component="h1" fontWeight="bold">
              Apply for a SIM
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

          <Box sx={{ p: 2, mb: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Box display="flex" alignItems="flex-start">
              <InfoIcon color="info" sx={{ mr: 1, mt: 0.2 }} />
              <Typography variant="body2">
                Select a plan below to apply for a new SIM card. Your phone number will be assigned after approval.
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }} error={error && !selectedPlanId}>
              <InputLabel id="plan-select-label">Select Plan</InputLabel>
              <Select
                labelId="plan-select-label"
                id="plan-select"
                value={selectedPlanId}
                label="Select Plan"
                onChange={handlePlanChange}
                required
                disabled={plansLoading}
              >
                <MenuItem value="">
                  <em>-- Select a plan --</em>
                </MenuItem>
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name} - ₹{plan.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || plansLoading || !selectedPlanId}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {loading ? "Submitting..." : "Apply for SIM"}
            </Button>
          </form>

          {plansLoading && (
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}