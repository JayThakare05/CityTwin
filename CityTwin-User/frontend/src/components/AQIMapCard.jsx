import React from 'react';
import { Wind, Thermometer, Clock } from 'lucide-react';

const AQIMapCard = ({ region }) => {
  const currentRegion = region || {
    name: "Thane City (TMC)",
    metrics: {
      aqi: 86,
      aqiCategory: "Moderate",
      temp: 28,
      airQualityStatus: "Moderate PM2.5 levels near Teen Hath Naka"
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
      
      {/* Legend bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 700, marginBottom: '6px' }}>
          AQI SCALE LEGEND
        </div>
        <div style={{
          height: '8px',
          borderRadius: '4px',
          background: 'linear-gradient(90deg, #A8DCD3 0%, #FBE29D 30%, #F6A88B 60%, #E88B97 85%, #C7BCE8 100%)',
          width: '100%'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#777B86', marginTop: '4px', fontWeight: 600 }}>
          <span>Good</span>
          <span>Moderate</span>
          <span>Unhealthy</span>
          <span>Very Unhealthy</span>
          <span>Hazardous</span>
        </div>
      </div>

      {/* Selected Area Card Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #F0F2F5' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#777B86', fontWeight: 500 }}>
            {currentRegion.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#252733' }}>
              AQI: {metrics.aqi || 86}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#79C9C0',
              background: '#EAF7F8',
              padding: '2px 8px',
              borderRadius: '8px'
            }}>
              {metrics.aqiCategory || 'Moderate'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#252733', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Thermometer size={14} color="#79C9C0" /> {metrics.temp || 28}°C
          </div>
          <div style={{ fontSize: '10px', color: '#777B86', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={11} /> Last Updated: Today
          </div>
        </div>
      </div>

      <p style={{ fontSize: '11px', color: '#777B86', marginTop: '8px' }}>
        {metrics.airQualityStatus || "Air quality monitored via Thane Municipal IoT Sensor Stations."}
      </p>

    </div>
  );
};

export default AQIMapCard;
