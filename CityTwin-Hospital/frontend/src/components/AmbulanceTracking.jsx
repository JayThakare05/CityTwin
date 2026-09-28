import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Navigation } from 'lucide-react';
import CityMap from './CityMap.jsx';
import api from '../api/apiClient.js';

export default function AmbulanceTracking({ hospital, onNavigate }) {
  const location = useLocation();
  const initialAmb = location.state?.ambulance;
  const [ambulance, setAmbulance] = useState(initialAmb);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (initialAmb?.vehicleNumber) {
      loadAmbulance();
      intervalRef.current = setInterval(loadAmbulance, 3000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const loadAmbulance = async () => {
    try {
      const res = await api.getAmbulance(initialAmb.vehicleNumber);
      if (res.success) setAmbulance(res.data);
    } catch (err) { console.error(err); }
  };

  if (!ambulance) {
    return (
      <div className="page-enter page-content">
        <div className="empty-state">
          <Navigation />
          <h3>No ambulance selected</h3>
          <p>Select an ambulance to track.</p>
        </div>
      </div>
    );
  }

  const isEmergency = ambulance.status === 'Emergency';
  const signals = ambulance.routeSignals || [];
  const passedCount = signals.filter(s => s.passed).length;

  // Build route path
  const routePath = [];
  if (ambulance.location?.coordinates) routePath.push(ambulance.location.coordinates);
  signals.forEach(s => { if (s.coordinates) routePath.push(s.coordinates); });
  if (ambulance.currentDestination?.coordinates) routePath.push(ambulance.currentDestination.coordinates);

  return (
    <div className="page-enter" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onNavigate('ambulances')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#252733', padding: 4 }}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Track: {ambulance.vehicleNumber}</h3>
      </div>

      {/* Map */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <CityMap
          center={ambulance.location?.coordinates
            ? [ambulance.location.coordinates[1], ambulance.location.coordinates[0]]
            : [19.2039, 72.9723]}
          zoom={14}
          ambulances={[ambulance]}
          hospitals={hospital ? [hospital] : []}
          signals={signals}
          routePath={routePath}
        />
      </div>

      {/* Tracking Info */}
      {isEmergency ? (
        <div className="tracking-card">
          <div className="tracking-header">
            <div className="pulse-dot" />
            <h3>🚨 Emergency Active</h3>
          </div>

          <div className="tracking-grid">
            <div className="tracking-item">
              <label>Destination</label>
              <span>{ambulance.currentDestination?.name || 'N/A'}</span>
            </div>
            <div className="tracking-item">
              <label>ETA</label>
              <span className="emergency">{ambulance.eta || 'N/A'}</span>
            </div>
            <div className="tracking-item">
              <label>Distance</label>
              <span>{ambulance.distanceKm ? `${ambulance.distanceKm} km` : 'N/A'}</span>
            </div>
            <div className="tracking-item">
              <label>Green Corridor</label>
              <span className={ambulance.greenCorridorActive ? 'green' : ''}>
                {ambulance.greenCorridorActive ? '✓ Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Signal Corridor */}
          {signals.length > 0 && (
            <div className="signal-corridor">
              <div className="signal-corridor-title">Green Corridor Progress</div>
              <div className="signal-track">
                <div className="ambulance-marker">🚑</div>
                {signals.map((sig, i) => (
                  <div key={sig.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`signal-connector ${sig.passed || sig.status === 'GREEN' ? 'active' : ''}`} />
                    <div className="signal-node">
                      <div className={`signal-light ${sig.passed ? 'passed' : sig.status === 'GREEN' ? 'green' : 'red'}`}>
                        🚦
                      </div>
                      <span className="signal-name">{sig.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Signal Info */}
          {signals.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {(() => {
                const next = signals.find(s => !s.passed);
                if (!next) return <p style={{ fontSize: '0.85rem', color: '#4A9A6A', fontWeight: 600 }}>✓ All signals cleared</p>;
                return (
                  <div className="tracking-grid">
                    <div className="tracking-item">
                      <label>Next Signal</label>
                      <span>{next.name}</span>
                    </div>
                    <div className="tracking-item">
                      <label>Signal Status</label>
                      <span className={next.status === 'GREEN' ? 'green' : 'emergency'}>
                        {next.status === 'GREEN' ? '🟢 GREEN' : '🔴 RED'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ) : (
        <div className="tracking-card">
          <div className="tracking-header">
            <h3>🚑 {ambulance.vehicleNumber}</h3>
          </div>
          <div className="tracking-grid">
            <div className="tracking-item">
              <label>Driver</label>
              <span>{ambulance.driverName}</span>
            </div>
            <div className="tracking-item">
              <label>Status</label>
              <span className={ambulance.status === 'Available' ? 'green' : ''}>{ambulance.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
