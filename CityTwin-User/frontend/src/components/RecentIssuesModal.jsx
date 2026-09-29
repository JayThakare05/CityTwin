import React, { useState } from 'react';
import { 
  X, MapPin, ThumbsUp, ArrowRight, ShieldCheck, 
  Clock, Plus, Filter, CheckCircle2, AlertCircle 
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
  'Disaster': '⚡',
  'Social': '👥',
  'Other': '📍'
};

const statusBadgeConfig = {
  'verified': { label: 'Verified by AI', bg: '#EAF7F8', color: '#0D9488', border: '#79C9C0' },
  'pending': { label: 'Pending Review', bg: '#FEF8E7', color: '#B45309', border: '#FDE68A' },
  'needs_review': { label: 'Under Review', bg: '#FFFBEB', color: '#D97706', border: '#FCD34D' },
  'resolved': { label: 'Resolved', bg: '#F0FDF4', color: '#16A34A', border: '#86EFAC' },
  'rejected': { label: 'Rejected', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' }
};

const RecentIssuesModal = ({ 
  onClose, 
  issues = [], 
  user = null,
  myReportIds = [],
  onSelectIssueOnMap, 
  onLikeIssue,
  onOpenReport
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my'
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter user's own reports
  const isMyReport = (iss) => {
    const reportId = iss.id || iss._id;
    if (myReportIds.includes(reportId)) return true;
    if (user && (iss.user_id === user.id || iss.userId === user.id)) return true;
    return false;
  };

  const myReports = issues.filter(isMyReport);
  const baseList = activeTab === 'my' ? myReports : issues;

  // Filter by category
  const filteredIssues = selectedCategory === 'all' 
    ? baseList 
    : baseList.filter(i => i.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Category list from current issues
  const categoriesList = ['all', ...new Set(issues.map(i => i.category).filter(Boolean))];

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
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#79C9C0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              CITIZEN REPORTS PORTAL • SUPABASE LIVE
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#252733', marginTop: '2px' }}>
              Citizen Incident Reports
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                onClose();
                if (onOpenReport) onOpenReport();
              }}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '12px' }}
            >
              <Plus size={14} /> New Report
            </button>

            <button className="btn-icon" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher: All Reports vs My Reports */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: '#F1F5F9',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '12px',
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'all' ? '#252733' : '#64748B',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'all' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>All Reports</span>
            <span style={{
              background: activeTab === 'all' ? '#EAF7F8' : '#E2E8F0',
              color: activeTab === 'all' ? '#0D9488' : '#64748B',
              fontSize: '11px',
              padding: '1px 7px',
              borderRadius: '10px'
            }}>
              {issues.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my')}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'my' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'my' ? '#252733' : '#64748B',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'my' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>My Reports</span>
            <span style={{
              background: activeTab === 'my' ? '#EAF7F8' : '#E2E8F0',
              color: activeTab === 'my' ? '#0D9488' : '#64748B',
              fontSize: '11px',
              padding: '1px 7px',
              borderRadius: '10px'
            }}>
              {myReports.length}
            </span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px',
          flexShrink: 0,
          scrollbarWidth: 'none'
        }}>
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const emoji = cat === 'all' ? '🌐' : (categoryEmoji[cat] || '📍');
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  border: isSelected ? '1px solid #79C9C0' : '1px solid #E2E8F0',
                  background: isSelected ? '#EAF7F8' : '#FFFFFF',
                  color: isSelected ? '#0D9488' : '#64748B',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>{emoji}</span>
                <span>{cat === 'all' ? 'All Categories' : cat}</span>
              </button>
            );
          })}
        </div>

        {/* Reports List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '2px' }}>
          {filteredIssues.length === 0 ? (
            <div style={{
              padding: '48px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94A3B8',
                marginBottom: '12px'
              }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#252733' }}>
                {activeTab === 'my' ? 'No reports made by you yet' : 'No reports found'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '300px', marginTop: '4px', lineHeight: '1.4' }}>
                {activeTab === 'my' 
                  ? 'Submit your first report for waterlogging, traffic, garbage, or accidents to help Thane city.'
                  : 'No reports match the selected category filter.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenReport) onOpenReport();
                }}
                className="btn-primary"
                style={{ marginTop: '16px', padding: '10px 18px', fontSize: '13px' }}
              >
                + Submit a Report Now
              </button>
            </div>
          ) : (
            filteredIssues.map((iss) => {
              const emoji = categoryEmoji[iss.category] || '📍';
              const rawStatus = (iss.status || 'verified').toLowerCase();
              const statusConfig = statusBadgeConfig[rawStatus] || statusBadgeConfig['verified'];
              const isMine = isMyReport(iss);

              return (
                <div 
                  key={iss.id || iss._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: isMine ? '2px solid rgba(121, 201, 192, 0.5)' : '1px solid #F1F5F9',
                    padding: '14px',
                    boxShadow: '0 4px 16px rgba(37, 39, 51, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      background: '#F1F5F9'
                    }}>
                      <img
                        src={iss.imageUrl || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=300&auto=format&fit=crop&q=80'}
                        alt={iss.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Report Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                          <span style={{
                            background: statusConfig.bg,
                            color: statusConfig.color,
                            border: `1px solid ${statusConfig.border}`,
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <ShieldCheck size={11} /> {statusConfig.label}
                          </span>

                          {isMine && (
                            <span style={{
                              background: '#EAF7F8',
                              color: '#0D9488',
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '8px'
                            }}>
                              Your Report
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                          {iss.timeAgo || 'Just now'}
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#252733',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <span>{emoji}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {iss.title}
                        </span>
                      </h3>

                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} color="#94A3B8" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {iss.location?.address || 'Thane West'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {iss.description && (
                    <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.45', background: '#F8FAFC', padding: '8px 12px', borderRadius: '12px' }}>
                      {iss.description}
                    </p>
                  )}

                  {/* AI Verification Note */}
                  {iss.verification?.reason && (
                    <div style={{
                      fontSize: '11px',
                      color: '#0D9488',
                      background: 'rgba(234, 247, 248, 0.6)',
                      padding: '6px 10px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        AI Analysis: {iss.verification.reason}
                      </span>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    <button
                      onClick={() => onLikeIssue(iss.id || iss._id)}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '5px 10px',
                        fontSize: '11px',
                        color: '#64748B',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <ThumbsUp size={12} color="#79C9C0" /> {iss.likes || 1} Upvotes
                    </button>

                    <button
                      onClick={() => {
                        onSelectIssueOnMap(iss);
                        onClose();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0D9488',
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
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default RecentIssuesModal;
