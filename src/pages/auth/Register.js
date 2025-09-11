import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Fingerprint as AadharIcon,
  VpnKey as PasswordIcon,
  PersonAdd as RegisterIcon,
  Login as LoginIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    aadhaarNo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldValidation, setFieldValidation] = useState({
    name: false,
    email: false,
    phone: false,
    aadhaarNo: false,
    password: false
  });
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length >= 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^\d{10}$/.test(value);
      case 'aadhaarNo':
        return /^\d{12}$/.test(value);
      case 'password':
        return value.length >= 8;
      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Input processing
    if (name === 'aadhaarNo') {
      // Only digits, max 12
      if (/^\d{0,12}$/.test(value)) {
        processedValue = value;
      } else {
        return; // Don't update if invalid
      }
    } else if (name === 'phone') {
      // Only digits, max 10
      if (/^\d{0,10}$/.test(value)) {
        processedValue = value;
      } else {
        return; // Don't update if invalid
      }
    } else if (name === 'name') {
      // Remove extra spaces and limit to reasonable length
      processedValue = value.replace(/\s+/g, ' ').slice(0, 50);
    }

    setForm({ ...form, [name]: processedValue });
    
    // Real-time validation
    setFieldValidation({
      ...fieldValidation,
      [name]: validateField(name, processedValue)
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return Object.values(fieldValidation).every(isValid => isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Final validation
    if (!isFormValid()) {
      setError('Please fill all fields correctly.');
      setLoading(false);
      return;
    }

    try {
      await register(form);
      setSuccess('Registration successful! Redirecting to login page...');
      
      // Wait a moment to show the success message, then redirect
      setTimeout(() => {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFieldHelperText = (fieldName) => {
    switch (fieldName) {
      case 'phone':
        return form.phone.length > 0 && form.phone.length !== 10 ? 'Must be exactly 10 digits' : '';
      case 'aadhaarNo':
        return form.aadhaarNo.length > 0 && form.aadhaarNo.length !== 12 ? 'Must be exactly 12 digits' : '';
      case 'password':
        return form.password.length > 0 && form.password.length < 8 ? 'Must be at least 8 characters' : '';
      case 'email':
        return form.email.length > 0 && !fieldValidation.email ? 'Please enter a valid email' : '';
      case 'name':
        return form.name.length > 0 && !fieldValidation.name ? 'Name must be at least 2 characters' : '';
      default:
        return '';
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm" 
      sx={{ 
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 480
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4, width: '100%' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main', 
              mb: 1,
              letterSpacing: '-0.5px'
            }}
          >
            Create Your Account
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sign up to access our services
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            padding: isMobile ? 3 : 4,
            width: '100%',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Fade in={!!error}>
            <div>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    mb: 3, 
                    borderRadius: 1,
                    alignItems: 'center'
                  }}
                >
                  {error}
                </Alert>
              )}
            </div>
          </Fade>
          
          <Fade in={!!success}>
            <div>
              {success && (
                <Alert 
                  severity="success" 
                  icon={<CheckIcon fontSize="inherit" />}
                  sx={{ 
                    width: '100%', 
                    mb: 3, 
                    borderRadius: 1,
                    alignItems: 'center'
                  }}
                >
                  {success}
                </Alert>
              )}
            </div>
          </Fade>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2.5}>
              {/* Full Name Field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={form.name.length > 0 && !fieldValidation.name}
                  helperText={getFieldHelperText('name')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      alignItems: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  error={form.email.length > 0 && !fieldValidation.email}
                  helperText={getFieldHelperText('email')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      alignItems: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Phone Field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  error={form.phone.length > 0 && !fieldValidation.phone}
                  helperText={getFieldHelperText('phone')}
                  inputProps={{
                    maxLength: 10,
                    pattern: "\\d{10}",
                    inputMode: 'numeric'
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      alignItems: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Aadhaar Field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="aadhaarNo"
                  label="Aadhaar Number"
                  name="aadhaarNo"
                  value={form.aadhaarNo}
                  onChange={handleChange}
                  placeholder="12-digit number"
                  error={form.aadhaarNo.length > 0 && !fieldValidation.aadhaarNo}
                  helperText={getFieldHelperText('aadhaarNo')}
                  inputProps={{
                    maxLength: 12,
                    pattern: "\\d{12}",
                    inputMode: 'numeric'
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      alignItems: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <AadharIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password Field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a secure password (min. 8 characters)"
                  error={form.password.length > 0 && !fieldValidation.password}
                  helperText={getFieldHelperText('password')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      alignItems: 'center',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 1 }}>
                        <PasswordIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          tabIndex={-1}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isFormValid()}
              sx={{ 
                mt: 4, 
                mb: 3, 
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 1.5,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RegisterIcon />}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Divider sx={{ mb: 3, mx: 0 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>
            
            {/* Login Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Already have an account?
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;