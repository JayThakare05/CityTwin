import React from 'react';
import { X, MapPin, ThumbsUp, ArrowRight } from 'lucide-react';

const categoryEmoji = {
  'Disease / Pandemic': '🦟',
  'Accident': '🚗',
  'Garbage': '🗑️',
  'Waterlogging': '🌊',
  'Air Pollution': '🌫️',
  'Other': '📍'
};

const severityBadge = {
  'Low': { bg: '#EAF7F8', color: '#79C9C0' },
  'Medium': { bg: '#FEF8E7', color: '#E8B869' },
  'High': { bg: '#FDF0EC', color: '#F6A88B' },
  'Critical': { bg: '#FFF5F6', color: '#E88B97' }
};

const RecentIssuesModal = ({ onClose, issues = [], onSelectIssueOnMap, onLikeIssue }) => {
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
        padding: '24px 20px 32px',
        maxHeight: '88vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#79C9C0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              CITIZEN FEED • THANE WEST
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
              Recent Issues Near You
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Issue Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {issues.map((iss) => {
            const emoji = categoryEmoji[iss.category] || '📍';
            const badge = severityBadge[iss.severity] || severityBadge['Medium'];

            return (
              <div 
                key={iss.id || iss._id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #F0F2F5',
                  padding: '14px',
                  boxShadow: '0 4px 16px rgba(37, 39, 51, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Thumbnail */}
                  <img
                    src={iss.imageUrl || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=300&auto=format&fit=crop&q=80'}
                    alt={iss.title}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        background: badge.bg,
                        color: badge.color,
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '10px'
                      }}>
                        {iss.severity} Severity
                      </span>

                      <span style={{ fontSize: '11px', color: '#A0A5B1' }}>
                        {iss.timeAgo || '2 hours ago'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#252733', marginTop: '4px' }}>
                      {emoji} {iss.title}
                    </h3>

                    <div style={{ fontSize: '11px', color: '#777B86', marginTop: '3px' }}>
                      📍 {iss.distanceKm || '1.2 km away'} • {iss.location?.address || 'Thane'}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#777B86', lineHeight: '1.4' }}>
                  {iss.description}
                </p>

                {/* Footer action bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid #F5F6F8'
                }}>
                  <button
                    onClick={() => onLikeIssue(iss.id || iss._id)}
                    style={{
                      background: '#F7EDF5',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      color: '#E8B8D5',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ThumbsUp size={12} /> {iss.likes || 1} Citizens Upvoted
                  </button>

                  <button
                    onClick={() => {
                      onSelectIssueOnMap(iss);
                      onClose();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#79C9C0',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View on Map <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default RecentIssuesModal;
