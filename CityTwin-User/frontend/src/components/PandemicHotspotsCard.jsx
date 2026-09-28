import React from 'react';
import { TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';

const PandemicHotspotsCard = ({ region }) => {
  const currentRegion = region || {
    name: "Thane City (TMC)",
    metrics: {
      dengueRisk: "High",
      dengueCases: 42,
      dengueTrend: "Increasing",
      malariaRisk: "Moderate"
    }
  };

  const metrics = currentRegion.metrics || {};

  return (
    <div className="glass-panel" style={{
      borderRadius: '24px',
      padding: '16px 20px',
      background: '#FFFFFF',
      boxShadow: '0 12px 32px rgba(37, 39, 51, 0.12)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🦟</span>
          <div>
            <div style={{ fontSize: '10px', color: '#E8B8D5', fontWeight: 700, textTransform: 'uppercase' }}>
              VECTOR-BORNE DISEASE TWIN
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#252733' }}>
              Pandemic Risk: {currentRegion.name}
            </h3>
          </div>
        </div>

        <span style={{
          background: '#FFF5F6',
          color: '#E88B97',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700
        }}>
          Risk: {metrics.dengueRisk || 'High'}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
        marginTop: '14px'
      }}>
        <div style={{ background: '#F7EDF5', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Reported Dengue</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
            {metrics.dengueCases || 42} <span style={{ fontSize: '10px', color: '#777B86' }}>cases</span>
          </div>
        </div>

        <div style={{ background: '#EAF7F8', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Malaria Risk</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#79C9C0', marginTop: '4px' }}>
            {metrics.malariaRisk || 'Moderate'}
          </div>
        </div>

        <div style={{ background: '#FFF5F6', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 500 }}>Case Trend</div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#E88B97', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
            <TrendingUp size={14} /> {metrics.dengueTrend || 'Increasing'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PandemicHotspotsCard;
