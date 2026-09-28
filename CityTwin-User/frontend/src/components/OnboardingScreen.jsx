import React from 'react';

const OnboardingScreen = ({ onLoginClick, onSkipClick }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 3000,
      background: 'linear-gradient(180deg, #EAF7F8 0%, #E0F2F4 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px 24px',
      overflowY: 'auto'
    }} className="animate-fade-in">
      
      {/* Header & Logo */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #79C9C0 0%, #A8DCD3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(121, 201, 192, 0.4)'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#252733', letterSpacing: '-0.5px' }}>
          City<span style={{ color: '#79C9C0' }}>Twin</span>
        </h1>
        <p style={{ fontSize: '13px', color: '#777B86', fontWeight: 500, marginTop: '4px' }}>
          Thane District Digital Twin AI
        </p>
      </div>

      {/* Graphic Illustration */}
      <div style={{
        marginTop: 'auto',
        marginBottom: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '24px 0'
      }}>
        <div style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 220, 211, 0.4) 0%, rgba(232, 184, 213, 0.2) 60%, rgba(255,255,255,0) 100%)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(20px)'
        }} />
        
        {/* Soft Futuristic Map Card Illustration */}
        <div style={{
          width: '100%',
          maxWidth: '280px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 16px 36px rgba(37, 39, 51, 0.08)',
          position: 'relative',
          zIndex: 2,
          textAlign: 'center'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '14px'
          }}>
            <div style={{ background: '#EAF7F8', padding: '10px', borderRadius: '16px', textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>AQI Index</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>86 <span style={{ fontSize: '10px', color: '#79C9C0', fontWeight: 600 }}>• Mod</span></div>
            </div>
            <div style={{ background: '#F7EDF5', padding: '10px', borderRadius: '16px', textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Rain Risk</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#E8B8D5', marginTop: '2px' }}>40% <span style={{ fontSize: '10px', color: '#252733', fontWeight: 500 }}>High</span></div>
            </div>
          </div>
          
          <div style={{
            height: '70px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #C7BCE8 0%, #A8DCD3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            gap: '8px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
            Thane City Sub-Divisions
          </div>
        </div>
      </div>

      {/* Copywriting & Action Buttons */}
      <div style={{ textAlign: 'center', marginTop: 'auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#252733', marginBottom: '8px' }}>
          Understand Your City
        </h2>
        <p style={{
          fontSize: '13px',
          color: '#777B86',
          lineHeight: '1.4',
          maxWidth: '320px',
          margin: '0 auto 24px',
          fontWeight: 400
        }}>
          Explore real-time city conditions, environmental risks and community reports in one place.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={onLoginClick}
            style={{ width: '100%', padding: '15px' }}
          >
            Login / Sign Up
          </button>
          
          <button
            className="btn-secondary"
            onClick={onSkipClick}
            style={{ width: '100%', padding: '14px' }}
          >
            Skip for Now
          </button>
        </div>
        <p style={{ fontSize: '10px', color: '#A0A5B1', marginTop: '10px' }}>
          Skipped users can view public information but cannot report issues.
        </p>
      </div>

    </div>
  );
};

export default OnboardingScreen;
