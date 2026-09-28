import React from 'react';
import { X, User, CheckCircle, Clock, Bell, MapPin, LogOut, ShieldCheck } from 'lucide-react';

const ProfileModal = ({ onClose, user, userIssues = [], onLogout, onLoginClick }) => {
  if (!user) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4000,
        background: 'rgba(37, 39, 51, 0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justify: 'flex-end'
      }} className="animate-fade-in">

        <div className="glass-panel animate-slide-up" style={{
          background: '#FFFFFF',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          padding: '32px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#EAF7F8',
            color: '#79C9C0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <User size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#252733' }}>Guest Citizen Mode</h2>
          <p style={{ fontSize: '13px', color: '#777B86', marginTop: '6px', marginBottom: '24px' }}>
            Please log in or sign up to access your profile, report history, and notification settings.
          </p>
          <button className="btn-primary" onClick={onLoginClick} style={{ width: '100%', padding: '15px' }}>
            Login / Sign Up
          </button>
          <button className="btn-secondary" onClick={onClose} style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const submittedCount = userIssues.length || 3;
  const resolvedCount = userIssues.filter(i => i.status === 'Resolved').length || 1;
  const pendingCount = submittedCount - resolvedCount;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 500,
      background: 'rgba(37, 39, 51, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'flex-end'
    }} className="animate-fade-in">

      <div className="glass-panel animate-slide-up" style={{
        background: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '24px 20px 32px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#79C9C0', textTransform: 'uppercase' }}>
              VERIFIED CITIZEN ACCOUNT
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
              Citizen Profile
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div style={{
          background: 'linear-gradient(135deg, #EAF7F8 0%, #E2F2F4 100%)',
          borderRadius: '24px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#79C9C0',
            color: '#FFF',
            fontSize: '22px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(121, 201, 192, 0.4)'
          }}>
            {user.name.charAt(0)}
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#252733' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '12px', color: '#777B86', marginTop: '2px' }}>
              {user.email}
            </div>
            <div style={{ fontSize: '11px', color: '#79C9C0', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Thane Municipal Digital ID Verified
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <div style={{ background: '#FAFAFA', borderRadius: '18px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Submitted</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>{submittedCount}</div>
          </div>
          <div style={{ background: '#EAF7F8', borderRadius: '18px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Resolved</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#79C9C0', marginTop: '2px' }}>{resolvedCount}</div>
          </div>
          <div style={{ background: '#FEF8E7', borderRadius: '18px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Pending</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#E8B869', marginTop: '2px' }}>{pendingCount}</div>
          </div>
        </div>

        {/* Settings Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            padding: '14px 16px',
            borderRadius: '16px',
            background: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="#777B86" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#252733' }}>Push Notifications</span>
            </div>
            <span style={{ fontSize: '11px', color: '#79C9C0', fontWeight: 700 }}>Enabled</span>
          </div>

          <div style={{
            padding: '14px 16px',
            borderRadius: '16px',
            background: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={18} color="#777B86" />
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#252733' }}>Location Accuracy</span>
            </div>
            <span style={{ fontSize: '11px', color: '#777B86' }}>Current Location</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '15px',
            borderRadius: '9999px',
            border: '1px solid #FFE0E3',
            background: '#FFF5F6',
            color: '#E88B97',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LogOut size={18} /> Logout Account
        </button>

      </div>
    </div>
  );
};

export default ProfileModal;
