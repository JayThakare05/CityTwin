import { useState, useEffect } from 'react';
import { Tent, Plus, CheckCircle, Clock } from 'lucide-react';
import api from '../api/apiClient.js';

const statusSteps = ['Pending', 'Approved', 'Scheduled', 'Completed'];

export default function MedicalCamps({ hospital, onNavigate }) {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCamps(); }, []);

  const loadCamps = async () => {
    try {
      const res = await api.getCamps(hospital?.hospitalId);
      if (res.success) setCamps(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const getStatusIndex = (status) => statusSteps.indexOf(status);

  if (loading) {
    return <div className="loading-screen"><div className="loader" /><p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading camps...</p></div>;
  }

  return (
    <div className="page-enter page-content">
      <div className="section-header">
        <h3 className="section-title">Medical Camps</h3>
        <button className="btn-primary" onClick={() => onNavigate('camp-request')}>
          <Plus size={14} /> New Request
        </button>
      </div>

      <div className="risk-cards">
        {camps.map((camp, i) => {
          const statusIdx = getStatusIndex(camp.status);
          return (
            <div className="risk-card" key={camp.id || i} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="risk-card-header">
                <div className="risk-card-title">
                  <span>🏕️</span>
                  <h4>{camp.disease} Camp</h4>
                </div>
                <span className={`risk-badge ${camp.riskLevel?.toLowerCase() === 'high' ? 'high' : 'moderate'}`}>
                  {camp.riskLevel}
                </span>
              </div>

              <div className="risk-card-meta">
                <span>{camp.location?.address || camp.regionName}</span>
                <span>•</span>
                <span>{camp.distanceKm}</span>
              </div>

              <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: '#737783', marginBottom: 14 }}>
                <span>Cases: <strong style={{ color: '#252733' }}>{camp.detectedCases}</strong></span>
                <span>Doctors: <strong style={{ color: '#252733' }}>{camp.requiredDoctors}</strong></span>
                <span>Nurses: <strong style={{ color: '#252733' }}>{camp.requiredNurses}</strong></span>
              </div>

              {/* Status Tracker */}
              <div className="camp-status-tracker">
                {statusSteps.map((step, si) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="camp-status-step">
                      <div className={`camp-status-dot ${si < statusIdx ? 'completed' : si === statusIdx ? 'active' : ''}`}>
                        {si < statusIdx ? <CheckCircle size={14} /> : si + 1}
                      </div>
                      <span className={`camp-status-label ${si === statusIdx ? 'active' : ''}`}>{step}</span>
                    </div>
                    {si < statusSteps.length - 1 && (
                      <div className={`camp-status-line ${si < statusIdx ? 'active' : ''}`} />
                    )}
                  </div>
                ))}
              </div>

              {camp.preferredDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#737783', marginTop: 8 }}>
                  <Clock size={13} /> Preferred: {camp.preferredDate}
                </div>
              )}
            </div>
          );
        })}

        {camps.length === 0 && (
          <div className="empty-state">
            <Tent />
            <h3>No camp requests</h3>
            <p>Request a medical camp from the pandemic risk areas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
