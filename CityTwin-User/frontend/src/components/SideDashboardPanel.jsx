import React from 'react';
import { 
  CloudSun, ArrowRight, Plus, ShieldAlert, MapPin, Activity 
} from 'lucide-react';

const SideDashboardPanel = ({ 
  weatherData, 
  issues = [], 
  regions = [],
  localityName,
  onViewForecast, 
  onOpenReport, 
  onOpenAccident,
  onOpenRegionMap,
  onSelectIssueOnMap
}) => {
  const weather = weatherData || {
    temp: 28, condition: "Partly Cloudy", aqi: 86, aqiCategory: "Moderate", rainProb: 40
  };

  const categoryEmoji = {
    'Disease / Pandemic': '🦟', 'Accident': '🚗', 'Garbage': '🗑️',
    'Waterlogging': '🌊', 'Air Pollution': '🌫️', 'Other': '📍'
  };

  const severityBadge = {
    'Low': { bg: '#EAF7F8', color: '#79C9C0' },
    'Medium': { bg: '#FEF8E7', color: '#E8B869' },
    'High': { bg: '#FDF0EC', color: '#F6A88B' },
    'Critical': { bg: '#FFF5F6', color: '#E88B97' }
  };

  return (
    <aside style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      bottom: '16px',
      width: '360px',
      zIndex: 1000,
      borderRadius: '24px',
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(18px)',
      boxShadow: '0 12px 40px rgba(37, 39, 51, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      padding: '18px',
      overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Weather Card */}
      <div style={{
        background: 'linear-gradient(135deg, #EAF7F8 0%, #E2F2F4 100%)',
        borderRadius: '18px',
        padding: '14px',
        border: '1px solid rgba(168, 220, 211, 0.4)',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#777B86', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            YOUR AREA • {localityName || 'CURRENT LOCATION'}
          </span>
          <span style={{
            background: '#79C9C0', color: '#FFFFFF', fontSize: '9px', fontWeight: 700,
            padding: '2px 7px', borderRadius: '8px'
          }}>LIVE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', background: '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CloudSun size={24} color="#79C9C0" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#252733', lineHeight: '1' }}>{weather.temp}°C</div>
              <div style={{ fontSize: '11px', color: '#777B86' }}>{weather.condition}</div>
            </div>
          </div>

          <button onClick={onViewForecast} style={{
            background: '#FFFFFF', border: '1px solid #A8DCD3', borderRadius: '10px',
            padding: '7px 10px', fontSize: '10px', fontWeight: 700, color: '#79C9C0',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
          }}>
            Forecast <ArrowRight size={11} />
          </button>
        </div>

        {/* Metric chips */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '10px' }}>
          <div style={{ background: '#FFFFFF', padding: '7px 8px', borderRadius: '10px' }}>
            <div style={{ fontSize: '9px', color: '#777B86' }}>AQI</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#252733' }}>
              {weather.aqi} <span style={{ fontSize: '9px', color: '#79C9C0' }}>• {weather.aqiCategory}</span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', padding: '7px 8px', borderRadius: '10px' }}>
            <div style={{ fontSize: '9px', color: '#777B86' }}>Rain Probability</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#E8B8D5' }}>{weather.rainProb}%</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        <button onClick={onOpenReport} className="btn-primary"
          style={{ padding: '10px', fontSize: '12px', borderRadius: '14px' }}>
          <Plus size={15} /> Report Issue
        </button>
        <button onClick={onOpenAccident} style={{
          background: 'linear-gradient(135deg, #E88B97 0%, #F6A88B 100%)',
          color: '#FFFFFF', border: 'none', borderRadius: '14px', padding: '10px',
          fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '5px'
        }}>
          <ShieldAlert size={14} /> Emergency
        </button>
      </div>

      {/* Region Map Quick Access */}
      <button onClick={onOpenRegionMap} style={{
        width: '100%', background: '#F7EDF5', border: 'none', borderRadius: '14px',
        padding: '10px 14px', fontSize: '12px', fontWeight: 600, color: '#252733',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '6px', marginBottom: '14px'
      }}>
        🗺️ Explore Thane District Region Map
      </button>

      {/* Citizen Issues Feed */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#252733', letterSpacing: '0.3px' }}>
          CITIZEN REPORTS ({issues.length})
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '2px' }}>
        {issues.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center', padding: '30px 20px', color: '#A0A5B1'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%', background: '#EAF7F8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
            }}>
              <Activity size={24} color="#A8DCD3" />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#777B86' }}>No Issues Reported Yet</div>
            <div style={{ fontSize: '11px', marginTop: '4px', lineHeight: '1.4' }}>
              Your community is safe! Click "Report Issue" to flag a problem in your area.
            </div>
          </div>
        ) : (
          issues.map((iss) => {
            const emoji = categoryEmoji[iss.category] || '📍';
            const badge = severityBadge[iss.severity] || severityBadge['Medium'];

            return (
              <div key={iss.id || iss._id} onClick={() => onSelectIssueOnMap(iss)} style={{
                background: '#FFFFFF', borderRadius: '14px', border: '1px solid #F0F2F5',
                padding: '10px', cursor: 'pointer', transition: 'border-color 0.15s ease',
                boxShadow: '0 2px 6px rgba(37, 39, 51, 0.03)'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {iss.imageUrl && (
                    <img src={iss.imageUrl} alt="" style={{
                      width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0
                    }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        background: badge.bg, color: badge.color, fontSize: '9px', fontWeight: 700,
                        padding: '2px 5px', borderRadius: '6px'
                      }}>{iss.severity}</span>
                      <span style={{ fontSize: '9px', color: '#A0A5B1' }}>{iss.timeAgo || 'Just now'}</span>
                    </div>
                    <div style={{
                      fontSize: '12px', fontWeight: 700, color: '#252733', marginTop: '2px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {emoji} {iss.title}
                    </div>
                    <div style={{ fontSize: '9px', color: '#777B86', marginTop: '2px' }}>
                      📍 {iss.location?.address || 'Thane'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default SideDashboardPanel;
