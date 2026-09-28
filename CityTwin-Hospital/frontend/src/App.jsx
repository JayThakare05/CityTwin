import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import api from './api/apiClient.js';

// Hospital Pages
import HospitalLogin from './components/HospitalLogin.jsx';
import Dashboard from './components/Dashboard.jsx';
import AmbulanceManagement from './components/AmbulanceManagement.jsx';
import AccidentAlerts from './components/AccidentAlerts.jsx';
import MedicalCamps from './components/MedicalCamps.jsx';
import CampRequestForm from './components/CampRequestForm.jsx';
import PandemicRisks from './components/PandemicRisks.jsx';
import LiveCityMap from './components/LiveCityMap.jsx';
import AmbulanceTracking from './components/AmbulanceTracking.jsx';
import Settings from './components/Settings.jsx';
import Reports from './components/Reports.jsx';

// Driver Pages
import DriverLogin from './components/DriverLogin.jsx';
import DriverHome from './components/DriverHome.jsx';
import EmergencyMode from './components/EmergencyMode.jsx';

// Layout
import AppShell from './components/AppShell.jsx';

function HospitalApp() {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('citytwin_hospital_token');
    if (token) {
      try {
        const res = await api.getMe();
        if (res.success && res.role === 'hospital') {
          setHospital(res.user);
        } else {
          localStorage.removeItem('citytwin_hospital_token');
        }
      } catch {
        localStorage.removeItem('citytwin_hospital_token');
      }
    }
    setLoading(false);
  };

  const handleLogin = async ({ email, password }) => {
    const res = await api.hospitalLogin({ email, password });
    if (res.success) {
      localStorage.setItem('citytwin_hospital_token', res.token);
      setHospital(res.hospital);
      navigate('/dashboard');
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('citytwin_hospital_token');
    setHospital(null);
    navigate('/');
  };

  const handleNavigate = (page, data) => {
    switch (page) {
      case 'dashboard': navigate('/dashboard'); break;
      case 'ambulances': navigate('/ambulances'); break;
      case 'accidents': navigate('/accidents'); break;
      case 'camps': navigate('/camps'); break;
      case 'pandemic': navigate('/pandemic'); break;
      case 'map': navigate('/map', { state: data }); break;
      case 'camp-request': navigate('/camp-request', { state: data }); break;
      case 'tracking': navigate('/tracking', { state: data }); break;
      case 'reports': navigate('/reports'); break;
      case 'settings': navigate('/settings'); break;
      default: navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

  if (!hospital) {
    return <HospitalLogin onLogin={handleLogin} />;
  }

  return (
    <AppShell hospital={hospital} onNavigate={handleNavigate} onLogout={handleLogout}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/ambulances" element={<AmbulanceManagement hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/accidents" element={<AccidentAlerts hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/camps" element={<MedicalCamps hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/camp-request" element={<CampRequestForm hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/pandemic" element={<PandemicRisks hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/map" element={<LiveCityMap hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/tracking" element={<AmbulanceTracking hospital={hospital} onNavigate={handleNavigate} />} />
        <Route path="/reports" element={<Reports hospital={hospital} />} />
        <Route path="/settings" element={<Settings hospital={hospital} />} />
        <Route path="*" element={<Dashboard hospital={hospital} onNavigate={handleNavigate} />} />
      </Routes>
    </AppShell>
  );
}

function DriverApp() {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('citytwin_driver_token');
    if (token) {
      try {
        const res = await api.getMe();
        if (res.success && res.role === 'driver') {
          setDriver(res.user);
        } else {
          localStorage.removeItem('citytwin_driver_token');
        }
      } catch {
        localStorage.removeItem('citytwin_driver_token');
      }
    }
    setLoading(false);
  };

  const handleLogin = async ({ driverId, password }) => {
    const res = await api.driverLogin({ driverId, password });
    if (res.success) {
      localStorage.setItem('citytwin_driver_token', res.token);
      setDriver(res.driver);
      navigate('/drivers/home');
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('citytwin_driver_token');
    setDriver(null);
    navigate('/drivers');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading...</p>
      </div>
    );
  }

  if (!driver) {
    return <DriverLogin onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/home" element={<DriverHome driver={driver} onLogout={handleLogout} />} />
      <Route path="/emergency" element={<EmergencyMode driver={driver} onLogout={handleLogout} />} />
      <Route path="*" element={<DriverHome driver={driver} onLogout={handleLogout} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/drivers/*" element={<DriverApp />} />
          <Route path="/*" element={<HospitalApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
