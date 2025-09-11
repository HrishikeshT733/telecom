import React, { useEffect, useState, useContext } from "react";
import { viewAllSim } from "../../api/simApi";
import { AuthContext } from "../../context/AuthContext";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  SimCard as SimCardIcon,
  Phone as PhoneIcon,
  AccountBalance as BalanceIcon,
  CalendarToday as CalendarIcon,
  DataUsage as DataIcon,
  Call as CallIcon,
  Sell as PriceIcon
} from '@mui/icons-material';

const ActivePlans = () => {
  const [activeSims, setActiveSims] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      viewAllSim(user.id)
        .then((data) => {
          const active = data.filter(
            (sim) => sim.status === "ACTIVE" && sim.plan
          );
          setActiveSims(active);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load active plans");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Collect unique phone numbers for the dropdown
  const phoneOptions = Array.from(
    new Set(activeSims.map((sim) => sim.phoneNumber))
  );

  // Filter sims based on the selected phone number (blank = show all)
  const filteredSims = selectedPhone
    ? activeSims.filter((sim) => sim.phoneNumber === selectedPhone)
    : activeSims;

  const PlanCard = ({ sim }) => (
    <Card sx={{ mb: 3, borderLeft: `4px solid #1976d2` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h2" gutterBottom>
            {sim.plan.name}
          </Typography>
          <Chip 
            label={sim.plan.type} 
            color={sim.plan.type === "PREPAID" ? "primary" : "secondary"} 
            variant="outlined" 
            size="small" 
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <SimCardIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>SIM Number:</strong> {sim.simNumber}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Phone:</strong> {sim.phoneNumber}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PriceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Price:</strong> ₹{sim.plan.price}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <BalanceIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Balance:</strong> ₹{sim.balance}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" mb={1}>
              <DataIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Data:</strong> {sim.plan.dataLimit} GB
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <CallIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Calls:</strong> {sim.plan.callLimit} mins
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Activated:</strong> {sim.activationDate}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                <strong>Expires:</strong> {sim.validityEndDate}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Active Plans
      </Typography>

      {/* Phone number filter dropdown */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="phone-select-label">Filter by Phone Number</InputLabel>
          <Select
            labelId="phone-select-label"
            id="phone-select"
            value={selectedPhone}
            label="Filter by Phone Number"
            onChange={(e) => setSelectedPhone(e.target.value)}
          >
            <MenuItem value="">
              <em>All Phone Numbers</em>
            </MenuItem>
            {phoneOptions.map((phone) => (
              <MenuItem key={phone} value={phone}>
                {phone}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : filteredSims.length > 0 ? (
        <Box>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Showing {filteredSims.length} active plan{filteredSims.length !== 1 ? 's' : ''}
            {selectedPhone && ` for ${selectedPhone}`}
          </Typography>
          
          {filteredSims.map((sim) => (
            <PlanCard key={sim.id} sim={sim} />
          ))}
        </Box>
      ) : (
        <Alert severity="info">
          No active plans found{selectedPhone ? ` for ${selectedPhone}` : ''}.
        </Alert>
      )}
    </Container>
  );
};

export default ActivePlans;