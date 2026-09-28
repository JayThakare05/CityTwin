import React from 'react';
import { CloudSun, ArrowRight, Droplets, Wind } from 'lucide-react';

const FloatingAreaCard = ({ weatherData, onViewForecast }) => {
  const weather = weatherData || {
    temp: 28,
    condition: "Partly Cloudy",
    aqi: 86,
    aqiCategory: "Moderate",
    rainProb: 40
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '12px',
      right: '12px',
      zIndex: 1000,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(18px)',
        borderRadius: '20px',
        padding: '14px 16px',
        boxShadow: '0 8px 28px rgba(37, 39, 51, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.6px', color: '#777B86', textTransform: 'uppercase' }}>
            YOUR AREA • THANE
          </span>
          <span style={{
            background: 'rgba(121, 201, 192, 0.15)',
            color: '#79C9C0',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '10px'
          }}>
            Live
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#EAF7F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CloudSun size={22} color="#79C9C0" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#252733', lineHeight: '1' }}>
                  {weather.temp}°C
                </span>
                <span style={{ fontSize: '12px', color: '#777B86' }}>
                  {weather.condition}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '3px', fontSize: '10px', color: '#777B86' }}>
                <span>AQI <strong style={{ color: '#252733' }}>{weather.aqi}</strong></span>
                <span>•</span>
                <span style={{ color: '#E8B8D5', fontWeight: 600 }}>Rain {weather.rainProb}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={onViewForecast}
            style={{
              background: '#FFFFFF',
              border: '1px solid #A8DCD3',
              borderRadius: '12px',
              padding: '8px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#79C9C0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              whiteSpace: 'nowrap'
            }}
          >
            Forecast <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingAreaCard;
