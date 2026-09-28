import { useState, useEffect } from 'react';
import { Navigation, RefreshCw, Truck } from 'lucide-react';
import api from '../api/apiClient.js';

export default function AmbulanceManagement({ hospital, onNavigate }) {
  const [ambulances, setAmbulances] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAmbulances(); }, []);

  const loadAmbulances = async () => {
    try {
      const res = await api.getAmbulances(hospital?.hospitalId);
      if (res.success) setAmbulances(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filtered = filter === 'all'
    ? ambulances
    : ambulances.filter(a => a.status.toLowerCase() === filter);

  const getStatusDot = (status) => {
    const s = status?.toLowerCase();
    if (s === 'available') return '🟢';
    if (s === 'emergency') return '🔴';
    return '⚫';
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader" /><p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading ambulances...</p></div>;
  }

  return (
    <div className="page-enter page-content">
      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['all', 'available', 'emergency', 'offline'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-count">
              {f === 'all' ? ambulances.length : ambulances.filter(a => a.status.toLowerCase() === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Ambulance List */}
      <div className="ambulance-list">
        {filtered.map((amb, i) => (
          <div
            className="ambulance-card"
            key={amb.vehicleNumber}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={`ambulance-icon ${amb.status.toLowerCase()}`}>
              🚑
            </div>
            <div className="ambulance-info">
              <div className="ambulance-vehicle">{amb.vehicleNumber}</div>
              <div className="ambulance-driver">{amb.driverName}</div>
              <div className={`ambulance-status ${amb.status.toLowerCase()}`}>
                {getStatusDot(amb.status)} {amb.status}
              </div>
            </div>
            {amb.status === 'Emergency' ? (
              <button
                className="ambulance-track-btn"
                onClick={() => onNavigate('tracking', { ambulance: amb })}
                title="Track"
              >
                <Navigation size={16} />
              </button>
            ) : (
              <button
                className="ambulance-track-btn"
                onClick={() => onNavigate('tracking', { ambulance: amb })}
                title="View"
              >
                <Truck size={16} />
              </button>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <Truck />
            <h3>No ambulances found</h3>
            <p>No ambulances match this filter.</p>
          </div>
        )}
      </div>

      {/* Refresh */}
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <button
          className="btn-outline"
          style={{ margin: '0 auto' }}
          onClick={() => { setLoading(true); loadAmbulances(); }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
    </div>
  );
}
