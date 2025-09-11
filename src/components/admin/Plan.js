import React, { useEffect, useState } from 'react';
import { getAllPlans, createPlan, updatePlan, deletePlan } from '../../api/planApi';
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
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Toolbar,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    dataLimit: '',
    callLimit: '',
    simType: 'PREPAID',
    validity: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      setPlans(data);
    } catch {
      setError('Failed to fetch plans');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price || !formData.validity) {
      setError('Name, Price and Validity are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const planPayload = {
        name: formData.name,
        price: Number(formData.price),
        dataLimit: formData.dataLimit ? Number(formData.dataLimit) : null,
        callLimit: formData.callLimit ? Number(formData.callLimit) : null,
        type: formData.simType,
        validity: Number(formData.validity)
      };

      if (editingId) {
        await updatePlan(editingId, planPayload);
        setSuccess('Plan updated successfully');
      } else {
        await createPlan(planPayload);
        setSuccess('Plan created successfully');
      }

      resetForm();
      fetchPlans();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to save plan');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      dataLimit: plan.dataLimit ?? '',
      callLimit: plan.callLimit ?? '',
      simType: plan.type || 'PREPAID',
      validity: plan.validity
    });
    setEditingId(plan.id);
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePlan(planToDelete.id);
      setSuccess('Plan deleted successfully');
      fetchPlans();
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete plan');
      setTimeout(() => setError(''), 3000);
      setDeleteDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      dataLimit: '',
      callLimit: '',
      simType: 'PREPAID',
      validity: ''
    });
    setEditingId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {editingId ? 'Edit Plan' : 'Create New Plan'}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              name="name"
              label="Plan Name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ minWidth: 200 }}
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              sx={{ minWidth: 120 }}
            />
            <TextField
              name="validity"
              label="Validity (days)"
              type="number"
              value={formData.validity}
              onChange={handleChange}
              required
              sx={{ minWidth: 140 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <TextField
              name="dataLimit"
              label="Data Limit (GB)"
              type="number"
              value={formData.dataLimit}
              onChange={handleChange}
              sx={{ minWidth: 160 }}
            />
            <TextField
              name="callLimit"
              label="Call Limit (minutes)"
              type="number"
              value={formData.callLimit}
              onChange={handleChange}
              sx={{ minWidth: 180 }}
            />
            <TextField
              name="simType"
              label="SIM Type"
              select
              value={formData.simType}
              onChange={handleChange}
              required
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="PREPAID">Prepaid</MenuItem>
              <MenuItem value="POSTPAID">Postpaid</MenuItem>
            </TextField>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={editingId ? <EditIcon /> : <AddIcon />}
            >
              {editingId ? 'Update Plan' : 'Add Plan'}
            </Button>
            {editingId && (
              <Button 
                variant="outlined" 
                onClick={resetForm}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Plan List
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {plans.length} {plans.length === 1 ? 'plan' : 'plans'} total
          </Typography>
        </Toolbar>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Data Limit</TableCell>
                <TableCell align="right">Call Limit</TableCell>
                <TableCell align="right">Validity</TableCell>
                <TableCell>SIM Type</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      No plans found. Create your first plan above.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{plan.name}</Typography>
                    </TableCell>
                    <TableCell align="right">₹{plan.price}</TableCell>
                    <TableCell align="right">
                      {plan.dataLimit ? `${plan.dataLimit} GB` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      {plan.callLimit ? `${plan.callLimit} min` : '-'}
                    </TableCell>
                    <TableCell align="right">{plan.validity} days</TableCell>
                    <TableCell>
                      <Chip 
                        label={plan.type} 
                        size="small"
                        color={plan.type === 'PREPAID' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleEdit(plan)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteClick(plan)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the plan "{planToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanManagement;