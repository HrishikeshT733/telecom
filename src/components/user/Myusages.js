import React, { useEffect, useState, useMemo } from "react";
import { getMyUsages } from "../../api/usageApi.js";
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
  CardContent
} from "@mui/material";
import {
  SimCard as SimIcon,
  DataUsage as UsageIcon,
  TrendingUp as TrendingIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";

export default function MyUsages() {
  const [usages, setUsages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedSimType, setSelectedSimType] = useState("");
  const [selectedSimNumber, setSelectedSimNumber] = useState("");

  // Filter SIM numbers by selected type
  const filteredSimNumbers = useMemo(() => {
    return usages
      .filter((u) => (selectedSimType ? u.type === selectedSimType : true))
      .map((u) => u.simCardPhoneNumber)
      .filter(Boolean);
  }, [usages, selectedSimType]);

  const uniqueSimNumbers = [...new Set(filteredSimNumbers)];

  // Final table data: only show if both dropdowns have a value
  const filteredUsages = useMemo(() => {
    if (selectedSimType && selectedSimNumber) {
      return usages.filter(
        (u) =>
          u.type === selectedSimType && u.simCardPhoneNumber === selectedSimNumber
      );
    }
    return [];
  }, [usages, selectedSimType, selectedSimNumber]);

  // Calculate statistics based on filtered usages
  const stats = useMemo(() => {
    const dataToCalculate = filteredUsages.length > 0 ? filteredUsages : usages;
    
    if (dataToCalculate.length === 0) {
      return {
        totalDataMB: 0,
        totalDataGB: 0,
        totalCalls: 0,
        averageDataMB: 0,
        averageDataGB: 0,
        averageCalls: 0,
        totalRecords: 0
      };
    }

    const totalDataMB = dataToCalculate.reduce((sum, usage) => sum + (parseFloat(usage.dataUsed) || 0), 0);
    const totalDataGB = totalDataMB / 1024; // Convert MB to GB
    const totalCalls = dataToCalculate.reduce((sum, usage) => sum + (parseFloat(usage.callMinutesUsed) || 0), 0);
    const totalRecords = dataToCalculate.length;
    const averageDataMB = totalDataMB / totalRecords;
    const averageDataGB = totalDataGB / totalRecords;
    const averageCalls = totalCalls / totalRecords;
    
    return {
      totalDataMB,
      totalDataGB,
      totalCalls,
      averageDataMB,
      averageDataGB,
      averageCalls,
      totalRecords
    };
  }, [filteredUsages, usages]);

  useEffect(() => {
    fetchUsages();
  }, []);

  const fetchUsages = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyUsages();
      setUsages(data);
    } catch (err) {
      setError("Failed to fetch usage data.");
    } finally {
      setLoading(false);
    }
  };

  const getSimTypeColor = (type) => {
    return type === 'PREPAID' ? 'primary' : 'secondary';
  };

  const handleSimTypeChange = (value) => {
    setSelectedSimType(value);
    setSelectedSimNumber(""); // Reset SIM number when type changes
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <UsageIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" component="h1">
            My Usages
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
                  <InputLabel id="sim-type-label">SIM Type</InputLabel>
                  <Select
                    labelId="sim-type-label"
                    value={selectedSimType}
                    label="SIM Type"
                    onChange={(e) => handleSimTypeChange(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>All SIM Types</em>
                    </MenuItem>
                    <MenuItem value="PREPAID">Prepaid</MenuItem>
                    <MenuItem value="POSTPAID">Postpaid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!selectedSimType}>
                  <InputLabel id="sim-number-label">SIM Number</InputLabel>
                  <Select
                    labelId="sim-number-label"
                    value={selectedSimNumber}
                    label="SIM Number"
                    onChange={(e) => setSelectedSimNumber(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>All SIM Numbers</em>
                    </MenuItem>
                    {uniqueSimNumbers.map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {usages.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Usage Summary {selectedSimNumber && `for ${selectedSimNumber}`}
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingIcon color="primary" />
                    <Typography variant="h5" component="div">
                      {stats.totalRecords}
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
                      {stats.totalDataMB.toFixed(2)} MB
                    </Typography>
                    <Typography variant="body2" component="div">
                      ({stats.totalDataGB.toFixed(2)} GB)
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
                    <PhoneIcon color="primary" />
                    <Typography variant="h5" component="div">
                      {stats.totalCalls.toFixed(2)}
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
                    <SimIcon color="primary" />
                    <Typography variant="h5" component="div">
                      {stats.averageDataMB.toFixed(2)} MB
                    </Typography>
                    <Typography variant="body2" component="div">
                      ({stats.averageDataGB.toFixed(2)} GB)
                    </Typography>
                    <Typography color="textSecondary">
                      Avg. Data per Record
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* Loading Indicator */}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {/* Usages Table */}
        {!loading && filteredUsages.length > 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Details {selectedSimNumber && `for ${selectedSimNumber}`}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SIM Card Number</TableCell>
                      <TableCell>SIM Type</TableCell>
                      <TableCell align="right">Data Used (MB)</TableCell>
                      <TableCell align="right">Call Minutes</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsages.map((usage) => (
                      <TableRow key={usage.id}>
                        <TableCell>{usage.simCardPhoneNumber}</TableCell>
                        <TableCell>
                          <Chip 
                            label={usage.type} 
                            size="small" 
                            color={getSimTypeColor(usage.type)}
                          />
                        </TableCell>
                        <TableCell align="right">{usage.dataUsed}</TableCell>
                        <TableCell align="right">{usage.callMinutesUsed}</TableCell>
                        <TableCell>
                          {new Date(usage.date)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")}
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
        {!loading && selectedSimType && selectedSimNumber && filteredUsages.length === 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            No usage data found for the selected filters.
          </Alert>
        )}

        {/* Initial prompt message */}
        {!loading && usages.length > 0 && (!selectedSimType || !selectedSimNumber) && (
          <Alert severity="info" sx={{ mt: 3 }}>
            Please select both SIM Type and SIM Number to view detailed usage data.
          </Alert>
        )}

        {/* No data at all message */}
        {!loading && usages.length === 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            No usage data available.
          </Alert>
        )}
      </Paper>
    </Container>
  );
}