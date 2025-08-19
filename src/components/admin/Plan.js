import React, { useEffect, useState } from 'react';
import { getAllPlans, createPlan, updatePlan, deletePlan } from '../../api/planApi';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    dataLimit: '',
    callLimit: '',
    simType: 'PREPAID',
    validity:''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getAllPlans();
      setPlans(data);
    } catch {
      setError('Failed to fetch plans');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price) {
      setError('Name and Price are required');
      return;
    }

    try {
      const planPayload = {
        name: form.name,
        price: Number(form.price),
        dataLimit: form.dataLimit ? Number(form.dataLimit) : null,
        callLimit: form.callLimit ? Number(form.callLimit) : null,
        type: form.simType, // assuming backend expects 'type' for SimType enum
        validity:Number(form.validity)
      };

      if (editingId) {
        await updatePlan(editingId, planPayload);
      } else {
        await createPlan(planPayload);
      }

      setForm({
        name: '',
        price: '',
        dataLimit: '',
        callLimit: '',
        simType: 'PREPAID',
        validity:''
      });
      setEditingId(null);
      fetchPlans();
    } catch {
      setError('Failed to save plan');
    }
  };

  const handleEdit = (plan) => {
    setForm({
      name: plan.name,
      price: plan.price,
      dataLimit: plan.dataLimit ?? '',
      callLimit: plan.callLimit ?? '',
      simType: plan.type || 'PREPAID',
      validity:plan.validity
    });
    setEditingId(plan.id);
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      fetchPlans();
    } catch {
      setError('Failed to delete plan');
    }
  };

  return (
    <div>
      <h2>Manage Plans</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          name="name"
          placeholder="Plan Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="dataLimit"
          type="number"
          placeholder="Data Limit (GB)"
          value={form.dataLimit}
          onChange={handleChange}
        />
        <input
          name="callLimit"
          type="number"
          placeholder="Call Limit (minutes)"
          value={form.callLimit}
          onChange={handleChange}
        />
          <input
          name="validity"
          placeholder="validity in days"
          value={form.validity}
          onChange={handleChange}
          required
        />
          <select name="simType" value={form.simType} onChange={handleChange} required>
          <option value="PREPAID">Prepaid</option>
          <option value="POSTPAID">Postpaid</option>
        </select>
        <button type="submit">{editingId ? 'Update Plan' : 'Add Plan'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: '',
                price: '',
                dataLimit: '',
                callLimit: '',
                simType: 'PREPAID',
                validity:''
              });
              setError('');
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Data Limit (GB)</th>
            <th>Call Limit (min)</th>
            <th>Validity(In Days)</th>
             <th>Sim Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.length === 0 && (
            <tr>
              <td colSpan="6">No plans found.</td>
            </tr>
          )}
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>{plan.price}</td>
              <td>{plan.dataLimit ?? '-'}</td>
              <td>{plan.callLimit ?? '-'}</td>
              <td>{plan.validity}</td>
               <td>{plan.type}</td>
              <td>
                <button onClick={() => handleEdit(plan)}>Edit</button>{' '}
                <button onClick={() => handleDelete(plan.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Plans;
