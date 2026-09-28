import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu, Bell, X, LayoutDashboard, Truck, AlertTriangle,
  Tent, Map, BarChart3, Settings, LogOut, Activity, Siren, Building2
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'pandemic', label: 'Pandemic Risk', icon: Activity, path: '/pandemic' },
  { id: 'camps', label: 'Medical Camps', icon: Tent, path: '/camps' },
  { id: 'ambulances', label: 'Ambulances', icon: Truck, path: '/ambulances' },
  { id: 'accidents', label: 'Accident Alerts', icon: Siren, path: '/accidents' },
  { id: 'map', label: 'Live City Map', icon: Map, path: '/map' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const bottomNavItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'ambulances', label: 'Ambulances', icon: Truck },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'accidents', label: 'Alerts', icon: Siren },
  { id: 'settings', label: 'More', icon: Settings },
];

export default function AppShell({ hospital, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getActiveNav = () => {
    const path = location.pathname;
    for (const item of navItems) {
      if (path.startsWith(item.path)) return item.id;
    }
    return 'dashboard';
  };

  const activeNav = getActiveNav();

  const handleNavClick = (id) => {
    onNavigate(id);
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    const found = navItems.find(n => n.id === activeNav);
    return found?.label || 'Dashboard';
  };

  return (
    <div className="desktop-layout">
      {/* Sidebar Overlay (Mobile only) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar (Permanent on Desktop, Drawer on Mobile) */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8FD3CB, #6FC4BC)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(143, 211, 203, 0.4)'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div className="sidebar-brand">CityTwin</div>
              <div className="sidebar-sub">Hospital Operations</div>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-hospital-card">
          <div className="sidebar-hospital-name">{hospital?.name || 'Jupiter Hospital Thane'}</div>
          <div className="sidebar-hospital-id">ID: {hospital?.hospitalId || 'HOSP-001'}</div>
        </div>

        <nav className="sidebar-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="app-main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="header-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="header-title">{getPageTitle()}</h1>
              <p className="header-sub">{hospital?.name || 'City Operations'}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="header-hospital-tag">
              <span className="status-dot online"></span>
              <span>Online • Sector 4</span>
            </div>
            <button className="header-icon-btn" onClick={() => onNavigate('accidents')} title="Emergency Alerts">
              <Bell size={20} />
              <span className="header-badge">!</span>
            </button>
          </div>
        </header>

        {/* Page View Container */}
        <main className="page-body">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Mobile only) */}
      <nav className="bottom-nav">
        {bottomNavItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

