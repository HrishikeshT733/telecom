import React, { useState } from 'react';
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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'aadhaarNo') {
      // Only digits, max 12
      if (/^\d{0,12}$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else if (name === 'phone') {
      // Only digits, max 10
      if (/^\d{0,10}$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Phone validation
    if (form.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // Aadhaar validation
    if (form.aadhaarNo.length !== 12) {
      setError('Aadhaar number must be exactly 12 digits.');
      return;
    }

    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={handleChange}
          required
          maxLength={10}
          pattern="\d{10}"
          title="Phone number must be exactly 10 digits"
        />
        <input
          type="text"
          name="aadhaarNo"
          placeholder="Aadhaar Number (12 digits)"
          value={form.aadhaarNo}
          onChange={handleChange}
          required
          maxLength={12}
          pattern="\d{12}"
          title="Aadhaar number must be exactly 12 digits"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
