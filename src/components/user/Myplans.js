import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "../../api/planApi.js";
import {
  Container,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import {
  Payment as PrepaidIcon,
  ReceiptLong as PostpaidIcon,
  DataUsage as DataIcon,
  Call as CallIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("PREPAID");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAllPlans();
      setPlans(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load plans.");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.type === "PREPAID") {
      navigate("/user/Recharge-SIM");
    } else if (plan.type === "POSTPAID") {
      navigate("/user/ChangePlanPostpaid");
    }
  };

  const filteredPlans = plans.filter(plan => plan.type === selectedType);

  const PlanCard = ({ plan }) => (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h3" gutterBottom>
            {plan.name}
          </Typography>
          <Chip 
            label={plan.type} 
            color={plan.type === "PREPAID" ? "primary" : "secondary"} 
            size="small" 
          />
        </Box>
        
        <Typography variant="h5" color="primary" gutterBottom>
          ₹{plan.price}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <DataIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Data: {plan.dataLimit ?? "Unlimited"} GB
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <CallIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Calls: {plan.callLimit ?? "Unlimited"} mins
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">
              Validity: {plan.validity} days
            </Typography>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={() => handleSelectPlan(plan)}
          sx={{ mt: 'auto' }}
        >
          Select Plan
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" textAlign="center">
        Available Plans
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Choose your plan type
        </Typography>
        
        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={handleTypeChange}
          aria-label="plan type"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="PREPAID" aria-label="prepaid plans">
            <PrepaidIcon sx={{ mr: 1 }} />
            Prepaid
          </ToggleButton>
          <ToggleButton value="POSTPAID" aria-label="postpaid plans">
            <PostpaidIcon sx={{ mr: 1 }} />
            Postpaid
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" color="textSecondary">
          {selectedType === "PREPAID" 
            ? "Prepaid plans require upfront payment. Choose a plan to recharge your SIM."
            : "Postpaid plans bill you at the end of the month. Choose a plan to subscribe."
          }
        </Typography>
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
      ) : filteredPlans.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No {selectedType.toLowerCase()} plans found.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPlans.map(plan => (
            <Grid item key={plan.id} xs={12} sm={6} md={4}>
              <PlanCard plan={plan} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}