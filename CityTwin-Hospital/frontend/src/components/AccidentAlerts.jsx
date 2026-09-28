import { useState, useEffect } from 'react';
import { MapPin, Clock, AlertTriangle, Navigation, Truck } from 'lucide-react';
import api from '../api/apiClient.js';

export default function AccidentAlerts({ hospital, onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dispatchModal, setDispatchModal] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [alertRes, ambRes] = await Promise.all([
        api.getAccidents(hospital?.hospitalId),
        api.getAmbulances(hospital?.hospitalId),
      ]);
      if (alertRes.success) setAlerts(alertRes.data);
      if (ambRes.success) setAmbulances(ambRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDispatch = async (alertId, vehicleNumber) => {
    try {
      const res = await api.dispatchAmbulance(alertId, vehicleNumber);
      if (res.success) {
        setDispatchModal(null);
        loadData();
      }
    } catch (err) { console.error(err); }
  };

  const getSeverityClass = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'critical') return 'critical';
    if (s === 'severe') return 'high';
    if (s === 'moderate') return 'moderate';
    return 'low';
  };

  const getTimeAgo = () => {
    const mins = Math.floor(Math.random() * 30) + 1;
    return `${mins} min ago`;
  };

  if (loading) {
    return <div className="loading-screen"><div className="loader" /><p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading alerts...</p></div>;
  }

  return (
    <div className="page-enter page-content">
      <div className="section-header">
        <h3 className="section-title">Nearby Accidents</h3>
        <span className="section-action" onClick={loadData}>Refresh</span>
      </div>

      <div className="accident-list">
        {alerts.map((alert, i) => (
          <div className="accident-card" key={alert.id || i} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="accident-header">
              <span style={{ fontSize: '1.1rem' }}>🚨</span>
              <h4>{alert.title}</h4>
              <span className={`risk-badge ${getSeverityClass(alert.severity)}`}>
                {alert.severity}
              </span>
            </div>

            <div className="accident-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} /> {alert.location?.address}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Navigation size={13} /> {alert.distanceKm}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} /> {getTimeAgo()}
              </span>
            </div>

            {alert.reportedBy && (
              <p style={{ fontSize: '0.8rem', color: '#737783', marginBottom: 12 }}>
                Reported by: {alert.reportedBy}
              </p>
            )}

            <div className="accident-actions">
              <button className="btn-outline" onClick={() => onNavigate('map', { accident: alert })}>
                <MapPin size={14} /> View Map
              </button>
              {alert.status === 'New' ? (
                <button className="btn-emergency" onClick={() => setDispatchModal(alert)}>
                  <Truck size={14} /> Dispatch Ambulance
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => {
                    const amb = ambulances.find(a => a.vehicleNumber === alert.dispatchedAmbulance);
                    if (amb) onNavigate('tracking', { ambulance: amb });
                  }}
                >
                  <Navigation size={14} /> Track Ambulance
                </button>
              )}
            </div>

            {alert.status === 'Dispatched' && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(123,200,154,0.1)', borderRadius: 10, fontSize: '0.8rem', color: '#4A9A6A', fontWeight: 500 }}>
                ✓ Ambulance {alert.dispatchedAmbulance} dispatched
              </div>
            )}
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="empty-state">
            <AlertTriangle />
            <h3>No accidents reported</h3>
            <p>No nearby accidents at this time.</p>
          </div>
        )}
      </div>

      {/* Dispatch Modal */}
      <div className={`modal-overlay ${dispatchModal ? 'open' : ''}`} onClick={() => setDispatchModal(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3 className="modal-title">Dispatch Ambulance</h3>
          <p style={{ fontSize: '0.85rem', color: '#737783', marginBottom: 16 }}>
            Select an available ambulance for: <strong>{dispatchModal?.title}</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ambulances.filter(a => a.status === 'Available').map(amb => (
              <button
                key={amb.vehicleNumber}
                className="ambulance-card"
                style={{ cursor: 'pointer', border: '1.5px solid transparent' }}
                onClick={() => handleDispatch(dispatchModal?.id, amb.vehicleNumber)}
              >
                <div className="ambulance-icon available">🚑</div>
                <div className="ambulance-info">
                  <div className="ambulance-vehicle">{amb.vehicleNumber}</div>
                  <div className="ambulance-driver">{amb.driverName}</div>
                </div>
                <Navigation size={18} style={{ color: '#6FC4BC' }} />
              </button>
            ))}
            {ambulances.filter(a => a.status === 'Available').length === 0 && (
              <p style={{ textAlign: 'center', color: '#737783', fontSize: '0.85rem', padding: 20 }}>
                No available ambulances
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
