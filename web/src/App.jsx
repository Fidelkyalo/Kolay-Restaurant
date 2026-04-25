import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import KDS from './pages/KDS';
import Inventory from './pages/Inventory';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Home from './pages/Home';
import GuestMenu from './pages/GuestMenu';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<GuestMenu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/kds" element={<KDS />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
