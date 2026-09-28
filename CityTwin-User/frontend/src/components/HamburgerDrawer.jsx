import React from 'react';
import { 
  X, Home, Megaphone, AlertTriangle, Map, 
  CloudSun, Wind, Bell, User, Settings, LogOut, Lock 
} from 'lucide-react';

const HamburgerDrawer = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  onSelectTab, 
  user, 
  onLoginClick, 
  onLogout 
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} />, requiresAuth: false },
    { id: 'report', label: 'Report an Issue', icon: <Megaphone size={20} />, requiresAuth: true },
    { id: 'recent-issues', label: 'Recent Issues', icon: <AlertTriangle size={20} />, requiresAuth: false },
    { id: 'region-map', label: 'Region Map', icon: <Map size={20} />, requiresAuth: false },
    { id: 'weather', label: 'Weather & Forecast', icon: <CloudSun size={20} />, requiresAuth: false },
    { id: 'aqi', label: 'AQI Digital Twin', icon: <Wind size={20} />, requiresAuth: false },
    { id: 'alerts', label: 'Alerts', icon: <Bell size={20} />, requiresAuth: false },
    { id: 'profile', label: 'Profile', icon: <User size={20} />, requiresAuth: false },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, requiresAuth: false },
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 4000,
      background: 'rgba(37, 39, 51, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex'
    }} className="animate-fade-in">

      {/* Drawer */}
      <div className="glass-panel animate-slide-up" style={{
        width: '82%',
        maxWidth: '360px',
        height: '100%',
        background: '#FFFFFF',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '8px 0 32px rgba(37, 39, 51, 0.12)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #79C9C0 0%, #A8DCD3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#252733' }}>
                City<span style={{ color: '#79C9C0' }}>Twin</span>
              </div>
              <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>
                Thane District Citizen Portal
              </div>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* User Badge Banner */}
        <div style={{
          background: user ? 'linear-gradient(135deg, #EAF7F8 0%, #E2F2F4 100%)' : '#F7F8FA',
          borderRadius: '16px',
          padding: '12px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#79C9C0',
                color: '#FFF',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px'
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#252733' }}>{user.name}</div>
                <div style={{ fontSize: '10px', color: '#777B86' }}>{user.email}</div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#252733' }}>Guest Citizen Mode</div>
                <div style={{ fontSize: '10px', color: '#777B86' }}>Login to report issues</div>
              </div>
              <button 
                onClick={onLoginClick}
                style={{
                  background: '#79C9C0',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Menu Navigation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const isLocked = item.requiresAuth && !user;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isLocked) {
                    onLoginClick();
                  } else {
                    onSelectTab(item.id);
                    onClose();
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #EAF7F8 0%, #E2F2F4 100%)' : 'transparent',
                  color: isActive ? '#79C9C0' : (isLocked ? '#A0A5B1' : '#252733'),
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: isActive ? '#79C9C0' : (isLocked ? '#A0A5B1' : '#777B86') }}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>

                {isLocked && (
                  <span style={{
                    fontSize: '10px',
                    background: '#F0F2F5',
                    color: '#777B86',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Lock size={10} /> Login
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout if logged in */}
        {user && (
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: '16px',
              border: '1px solid #F0F2F5',
              background: '#FFF5F6',
              color: '#E88B97',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        )}

      </div>

      {/* Backdrop Click */}
      <div style={{ flex: 1 }} onClick={onClose} />
    </div>
  );
};

export default HamburgerDrawer;
