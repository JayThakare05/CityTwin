import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Map, PlusCircle, RefreshCw, Activity } from 'lucide-react';
import api from '../api/apiClient.js';

export default function PandemicRisks({ hospital, onNavigate }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRisks(); }, []);

  const loadRisks = async () => {
    try {
      const res = await api.getPandemicRisks();
      if (res.success) setRisks(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const getRiskBadgeClass = (level) => {
    const l = level?.toLowerCase();
    if (l === 'high') return 'high';
    if (l === 'critical') return 'critical';
    if (l === 'moderate') return 'moderate';
    return 'low';
  };

  const getDiseaseEmoji = (disease) => {
    const map = { 'Dengue': '🦟', 'Malaria': '🦟', 'Cholera': '💧', 'COVID': '🦠' };
    return map[disease] || '🦠';
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader" /><p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading pandemic data...</p></div>;
  }

  return (
    <div className="page-enter">
      <div className="section-header">
        <h3 className="section-title">Pandemic Risk Areas</h3>
        <span className="section-action" onClick={() => { setLoading(true); loadRisks(); }}>
          <RefreshCw size={13} style={{ verticalAlign: 'middle' }} /> Refresh
        </span>
      </div>

      <div className="risk-cards">
        {risks.map((risk, i) => (
          <div className="risk-card" key={risk.id || i} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="risk-card-header">
              <div className="risk-card-title">
                <span>{getDiseaseEmoji(risk.disease)}</span>
                <h4>{risk.disease} Risk</h4>
              </div>
              <span className={`risk-badge ${getRiskBadgeClass(risk.riskLevel)}`}>{risk.riskLevel}</span>
            </div>

            <div className="risk-card-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={14} /> {risk.location}
              </span>
              <span>•</span>
              <span>{risk.distanceKm}</span>
            </div>

            <div className="risk-card-detail">
              <span>Region: <strong>{risk.regionName}</strong></span>
            </div>

            <div className="risk-card-detail">
              <span>Cases: <strong>{risk.cases}</strong></span>
              <span>
                Trend: <strong style={{ color: risk.trend === 'Increasing' ? '#D47777' : '#737783' }}>
                  <TrendingUp size={12} style={{ verticalAlign: 'middle' }} /> {risk.trend}
                </strong>
              </span>
            </div>

            <div className="risk-card-actions">
              <button className="btn-outline" onClick={() => onNavigate('map', { risk })}>
                <Map size={14} /> View Map
              </button>
              <button className="btn-primary" onClick={() => onNavigate('camp-request', { risk })}>
                <PlusCircle size={14} /> Request Camp
              </button>
            </div>
          </div>
        ))}

        {risks.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <Activity size={32} />
            <h3>No pandemic risk areas</h3>
            <p>There are currently no active high-risk disease outbreak areas reported in your city region.</p>
          </div>
        )}
      </div>
    </div>
  );
}

