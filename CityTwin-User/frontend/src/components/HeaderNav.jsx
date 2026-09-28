import React from 'react';
import { Menu, CloudSun, Map, User } from 'lucide-react';

const HeaderNav = ({ 
  user, 
  onOpenMenu, 
  onOpenReport, 
  onOpenAccident, 
  onOpenRegionMap, 
  onOpenWeather, 
  onOpenProfile,
  weatherData,
  isMobile
}) => {
  const weather = weatherData || { temp: 28, condition: 'Partly Cloudy', aqi: 86, aqiCategory: 'Moderate' };

  return (
    <header style={{
      width: '100%',
      height: isMobile ? '56px' : '64px',
      padding: isMobile ? '0 16px' : '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 2000,
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(18px)',
      boxShadow: '0 2px 16px rgba(37, 39, 51, 0.06)',
      borderBottom: '1px solid rgba(232, 245, 246, 0.8)',
      flexShrink: 0
    }}>
      
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '14px' }}>
        <div style={{
          width: isMobile ? '34px' : '40px',
          height: isMobile ? '34px' : '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #79C9C0 0%, #A8DCD3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 3px 12px rgba(121, 201, 192, 0.35)',
          flexShrink: 0
        }}>
          <svg width={isMobile ? '18' : '22'} height={isMobile ? '18' : '22'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>

        <div>
          <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: '#252733', lineHeight: '1.1' }}>
            City<span style={{ color: '#79C9C0' }}>Twin</span>
          </div>
          {!isMobile && (
            <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>
              Thane District Digital Twin
            </div>
          )}
        </div>

        {/* Live badge - desktop only */}
        {!isMobile && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#EAF7F8',
            border: '1px solid rgba(168, 220, 211, 0.5)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#79C9C0',
            marginLeft: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#79C9C0' }} className="pulse-dot" />
            LIVE
          </div>
        )}
      </div>

      {/* Center: Quick metrics — desktop only */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            onClick={onOpenWeather}
            style={{
              background: '#FAFAFA',
              border: '1px solid #F0F2F5',
              padding: '5px 12px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease'
            }}
          >
            <CloudSun size={16} color="#79C9C0" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#252733' }}>{weather.temp}°C</span>
            <span style={{ fontSize: '11px', color: '#777B86' }}>{weather.condition}</span>
          </div>

          <div 
            onClick={onOpenWeather}
            style={{
              background: '#EAF7F8',
              padding: '5px 12px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '10px', color: '#777B86' }}>AQI</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#79C9C0' }}>{weather.aqi}</span>
          </div>

          <button
            onClick={onOpenRegionMap}
            style={{
              background: '#FFFFFF',
              border: '1px solid #F0F2F5',
              borderRadius: '14px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#252733',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Map size={14} color="#79C9C0" /> Region Map
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Report button — desktop only (mobile has FAB) */}
        {!isMobile && (
          <button
            onClick={onOpenReport}
            className="btn-primary"
            style={{ padding: '8px 16px', borderRadius: '14px', fontSize: '12px' }}
          >
            + Report Issue
          </button>
        )}

        {/* Profile */}
        <button
          onClick={onOpenProfile}
          className="btn-icon"
          style={{ width: isMobile ? '36px' : '40px', height: isMobile ? '36px' : '40px' }}
          title={user ? user.name : 'Profile'}
        >
          {user ? (
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#79C9C0',
              color: '#FFF',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User size={18} color="#252733" />
          )}
        </button>

        {/* Menu */}
        <button 
          className="btn-icon" 
          onClick={onOpenMenu}
          style={{ width: isMobile ? '36px' : '40px', height: isMobile ? '36px' : '40px' }}
          aria-label="Open menu"
        >
          <Menu size={18} color="#252733" />
        </button>
      </div>
    </header>
  );
};

export default HeaderNav;
