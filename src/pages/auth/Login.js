import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ aadharNo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New: loading state
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(form); // backend expects aadharNo & password
      const { token, user } = response.data;
      loginUser(user, token); // auto logout logic handled in AuthContext

      navigate(user.role === 'ADMIN' ? '/admin' : '/user');
    } catch (err) {
      //  Improvement: Show specific error from backend if available
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid Aadhaar number or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="aadharNo"
          placeholder="Aadhaar Number"
          value={form.aadharNo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate('/register')}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
