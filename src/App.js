import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './styles/globals.css';
// import Navbar from "./components/Navbar.js";
// import { useState } from 'react';

function App() {

  return (
    <AuthProvider>
       

      <Router>
       
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
