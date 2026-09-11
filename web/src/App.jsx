import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import KDS from './pages/KDS';
import Inventory from './pages/Inventory';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import GuestMenu from './pages/GuestMenu';
import Reservations from './pages/Reservations';
import ManageReservations from './pages/ManageReservations';
import MyBookings from './pages/MyBookings';
import Specialties from './pages/Specialties';
import Careers from './pages/Careers';
import AdminCareers from './pages/AdminCareers';
import Employees from './pages/Employees';
import Members from './pages/Members';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerLogin from './pages/CustomerLogin';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Profile from './pages/Profile';
import AdminLoyalty from './pages/AdminLoyalty';
import RedeemScan from './pages/RedeemScan';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<GuestMenu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/admin/reservations" element={<ManageReservations />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/kds" element={<KDS />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/admin/careers" element={<AdminCareers />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/members" element={<Members />} />
          <Route path="/staff" element={<Login defaultPortal="staff" />} />
          <Route path="/admin-portal" element={<Login defaultPortal="admin" />} />
          <Route path="/login" element={<Login defaultPortal="staff" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/loyalty" element={<AdminLoyalty />} />
          <Route path="/redeem" element={<RedeemScan />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
