
import React, { createContext, useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const logoutTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && !isTokenExpired(token)) {
      setUser(JSON.parse(savedUser));

      const { exp } = jwtDecode(token);
      const timeout = exp * 1000 - Date.now();
      setTimeLeft(Math.floor(timeout / 1000));

      // Clear previous timeouts/intervals if any
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      // Auto logout
      logoutTimeoutRef.current = setTimeout(() => logoutUser(), timeout);

      // Timer countdown
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } else {
      logoutUser();
    }

    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    const { exp } = jwtDecode(token);
    const timeout = exp * 1000 - Date.now();
    setTimeLeft(Math.floor(timeout / 1000));

    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    logoutTimeoutRef.current = setTimeout(() => logoutUser(), timeout);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const logoutUser = () => {
    setUser(null);
    setTimeLeft(0);
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, timeLeft }}>
      {children}
    </AuthContext.Provider>
  );
};
