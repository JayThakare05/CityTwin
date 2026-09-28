import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Map, PlusCircle, Activity } from 'lucide-react';
import api from '../api/apiClient';
import CityMap from './CityMap';

export default function Dashboard({ hospital, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, risksRes] = await Promise.all([
        api.getStats(hospital?.hospitalId),
        api.getPandemicRisks(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (risksRes.success) setRisks(risksRes.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
    setLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRiskBadgeClass = (level) => {
    return level?.toLowerCase() === 'high' ? 'high' : level?.toLowerCase() === 'critical' ? 'critical' : level?.toLowerCase() === 'moderate' ? 'moderate' : 'low';
  };

  const getDiseaseEmoji = (disease) => {
    const map = { 'Dengue': '🦟', 'Malaria': '🦟', 'Cholera': '💧', 'COVID': '🦠' };
    return map[disease] || '🦠';
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader" /><p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading dashboard...</p></div>;
  }

  return (
    <div className="page-enter">
      {/* Greeting */}
      <div className="greeting">
        <h2>{getGreeting()}, {hospital?.name?.split(' ')[0] || 'Hospital'} 🏥</h2>
        <p>Here are the real-time operational metrics and city emergency situations.</p>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card" onClick={() => onNavigate('ambulances')}>
          <div className="stat-card-icon">🚑</div>
          <div className="stat-card-value">{stats?.activeAmbulances || 0}</div>
          <div className="stat-card-label">Active Ambulances</div>
        </div>
        <div className="stat-card" onClick={() => onNavigate('accidents')}>
          <div className="stat-card-icon">🚨</div>
          <div className="stat-card-value">{stats?.emergencies || 0}</div>
          <div className="stat-card-label">Active Emergencies</div>
        </div>
        <div className="stat-card" onClick={() => onNavigate('pandemic')}>
          <div className="stat-card-icon">🦠</div>
          <div className="stat-card-value">{stats?.nearbyRiskAreas || 0}</div>
          <div className="stat-card-label">Nearby Pandemic Risks</div>
        </div>
        <div className="stat-card" onClick={() => onNavigate('camps')}>
          <div className="stat-card-icon">🏕️</div>
          <div className="stat-card-value">{stats?.campRequests || 0}</div>
          <div className="stat-card-label">Medical Camp Requests</div>
        </div>
      </div>

      {/* Pandemic Risks Section */}
      <div className="section-header">
        <h3 className="section-title">Pandemic Issues Near Your Hospital</h3>
        {risks.length > 0 && <span className="section-action" onClick={() => onNavigate('pandemic')}>View All</span>}
      </div>

      <div className="risk-cards">
        {risks.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <Activity size={24} />
            </div>
            <div className="empty-state-title">No Pandemic Risks Reported</div>
            <div className="empty-state-desc">There are currently no active high-risk disease outbreak areas reported in the database near your location.</div>
          </div>
        ) : (
          risks.slice(0, 3).map((risk, i) => (
            <div className="risk-card" key={risk.id || i}>
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
                <span>Cases: <strong>{risk.cases}</strong></span>
                <span>Trend: <strong style={{ color: risk.trend === 'Increasing' ? '#D47777' : '#737783' }}><TrendingUp size={12} style={{ verticalAlign: 'middle' }} /> {risk.trend}</strong></span>
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
          ))
        )}
      </div>

      {/* Mini Map */}
      <div className="section-header">
        <h3 className="section-title">Live City Operational Overview</h3>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <CityMap risks={risks} hospitals={hospital ? [hospital] : []} />
      </div>
    </div>
  );
}

