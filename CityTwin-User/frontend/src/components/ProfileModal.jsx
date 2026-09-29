import React from 'react';
import { 
  X, User, CheckCircle, Clock, Bell, MapPin, 
  LogOut, ShieldCheck, Plus, ArrowRight, Activity 
} from 'lucide-react';

const categoryEmoji = {
  'Disease / Pandemic': '🦟',
  'Pandemic': '🦟',
  'Accident': '🚗',
  'Garbage': '🗑️',
  'Waterlogging': '🌊',
  'Air Pollution': '🌫️',
  'Pollution': '🌫️',
  'Traffic': '🚦',
  'Hospital': '🏥',
  'Other': '📍'
};

const ProfileModal = ({ 
  onClose, 
  user, 
  userIssues = [], 
  myReportIds = [],
  onLogout, 
  onLoginClick,
  onOpenReport,
  onSelectIssueOnMap
}) => {
  if (!user) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4000,
        background: 'rgba(37, 39, 51, 0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
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
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#252733' }}>Guest Citizen Mode</h2>
          <p style={{ fontSize: '13px', color: '#777B86', marginTop: '6px', marginBottom: '24px' }}>
            Please log in or sign up to access your verified profile, report history, and notifications.
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

  // Filter reports submitted by this user
  const isMyReport = (iss) => {
    const reportId = iss.id || iss._id;
    if (myReportIds.includes(reportId)) return true;
    if (user && (iss.user_id === user.id || iss.userId === user.id)) return true;
    return false;
  };

  const myReports = userIssues.filter(isMyReport);
  const submittedCount = myReports.length;
  const verifiedCount = myReports.filter(i => (i.status || '').toLowerCase() === 'verified').length;
  const pendingCount = myReports.filter(i => (i.status || '').toLowerCase() === 'pending').length;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 4000,
      background: 'rgba(37, 39, 51, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }} className="animate-fade-in">

      <div className="glass-panel animate-slide-up" style={{
        background: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '24px 20px 32px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#79C9C0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              VERIFIED CITIZEN ACCOUNT
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#252733', marginTop: '2px' }}>
              Citizen Profile
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '2px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* User Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, #EAF7F8 0%, #E2F2F4 100%)',
            borderRadius: '24px',
            padding: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid rgba(168, 220, 211, 0.4)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#79C9C0',
              color: '#FFF',
              fontSize: '22px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(121, 201, 192, 0.4)',
              flexShrink: 0
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#252733', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '12px', color: '#777B86', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
              <div style={{ fontSize: '11px', color: '#0D9488', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Thane Municipal ID: {user.id?.slice(0, 8)}...
              </div>
            </div>
          </div>

          {/* User Reports Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: '#F8FAFC', borderRadius: '18px', padding: '12px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>My Reports</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#252733', marginTop: '2px' }}>{submittedCount}</div>
            </div>
            <div style={{ background: '#EAF7F8', borderRadius: '18px', padding: '12px', textAlign: 'center', border: '1px solid #A8DCD3' }}>
              <div style={{ fontSize: '10px', color: '#0D9488', fontWeight: 700, textTransform: 'uppercase' }}>Verified</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0D9488', marginTop: '2px' }}>{verifiedCount}</div>
            </div>
            <div style={{ background: '#FEF8E7', borderRadius: '18px', padding: '12px', textAlign: 'center', border: '1px solid #FDE68A' }}>
              <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>Pending</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>{pendingCount}</div>
            </div>
          </div>

          {/* Section: My Submitted Reports List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#252733', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                My Submitted Reports ({myReports.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenReport) onOpenReport();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#79C9C0',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Plus size={13} /> Add Report
              </button>
            </div>

            {myReports.length === 0 ? (
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                border: '1px dashed #CBD5E1'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>No reports submitted yet</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                  When you report traffic, waterlogging, or civic issues, they appear here.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenReport) onOpenReport();
                  }}
                  className="btn-primary"
                  style={{ marginTop: '12px', padding: '8px 16px', fontSize: '12px' }}
                >
                  + Submit a Report
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {myReports.map((rep) => {
                  const emoji = categoryEmoji[rep.category] || '📍';
                  const isVerified = (rep.status || '').toLowerCase() === 'verified';

                  return (
                    <div
                      key={rep.id || rep._id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        {rep.imageUrl && (
                          <img
                            src={rep.imageUrl}
                            alt=""
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px' }}>{emoji}</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#252733', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {rep.title}
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={10} color="#94A3B8" />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {rep.location?.address || 'Thane'}
                            </span>
                            <span>• {rep.timeAgo || 'Recent'}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{
                          background: isVerified ? '#EAF7F8' : '#FEF8E7',
                          color: isVerified ? '#0D9488' : '#B45309',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '8px'
                        }}>
                          {isVerified ? 'Verified' : 'Pending'}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectIssueOnMap) onSelectIssueOnMap(rep);
                            onClose();
                          }}
                          style={{
                            background: '#F1F5F9',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#0D9488'
                          }}
                          title="View on Map"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Account Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '12px 14px',
              borderRadius: '16px',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={16} color="#64748B" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#252733' }}>Civic Alerts & Notifications</span>
              </div>
              <span style={{ fontSize: '11px', color: '#0D9488', fontWeight: 700 }}>Enabled</span>
            </div>

            <div style={{
              padding: '12px 14px',
              borderRadius: '16px',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#64748B" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#252733' }}>Location Provider</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>TomTom Maps & GPS</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '9999px',
              border: '1px solid #FFE0E3',
              background: '#FFF5F6',
              color: '#E88B97',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={16} /> Logout Account
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
