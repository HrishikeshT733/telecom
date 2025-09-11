//This will handle base URL and JWT token attachment
// src/api/axiosConfig.js
import axios from 'axios';
import { getToken,isTokenExpired,removeToken } from '../utils/auth.js';
const axiosInstance = axios.create({
  baseURL: 'https://telecom-backend-1-tjcj.onrender.com', // Spring Boot backend
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken(); // JWT token
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }else if(token && isTokenExpired(token)){
    removeToken();
    window.location.href="/";
  }
  return config;
});

export default axiosInstance;
//http://localhost:8080