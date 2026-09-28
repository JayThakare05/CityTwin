import React from 'react';
import { X, CloudSun, CloudRain, Sun, CloudSunRain, Wind, Droplets } from 'lucide-react';

const WeatherModal = ({ onClose, forecast = [] }) => {
  const weatherIcons = {
    'cloud-sun': <CloudSun size={28} color="#79C9C0" />,
    'cloud-rain': <CloudRain size={28} color="#C7BCE8" />,
    'sun': <Sun size={28} color="#FBE29D" />,
    'cloud-sun-rain': <CloudSunRain size={28} color="#E8B8D5" />
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 4000,
      background: 'rgba(37, 39, 51, 0.3)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'flex-end'
    }} className="animate-fade-in">

      <div className="glass-panel animate-slide-up" style={{
        background: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '24px 20px 32px',
        maxHeight: '85vh',
        overflowY: 'auto'
      }}>
        {/* Modal Handle & Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#79C9C0', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              THANE WEATHER CENTER
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
              Weather & AQI Forecast
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Forecast Tabs / List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {forecast.map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: idx === 0 ? 'linear-gradient(135deg, #EAF7F8 0%, #E2F2F4 100%)' : '#F9FAFB',
                border: idx === 0 ? '1.5px solid #A8DCD3' : '1px solid #F0F2F5',
                borderRadius: '20px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                }}>
                  {weatherIcons[item.icon] || <CloudSun size={28} color="#79C9C0" />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#252733' }}>
                      {item.day}
                    </span>
                    <span style={{ fontSize: '11px', color: '#777B86' }}>
                      ({item.date})
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#777B86', marginTop: '2px' }}>
                    {item.condition}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#252733' }}>
                  {item.tempMax}° / <span style={{ fontSize: '14px', color: '#777B86', fontWeight: 500 }}>{item.tempMin}°</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px', fontSize: '11px' }}>
                  <span style={{ color: '#E8B8D5', fontWeight: 600 }}>☔ {item.rainProb}%</span>
                  <span style={{ color: '#79C9C0', fontWeight: 600 }}>AQI {item.aqi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information tip */}
        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          background: '#EAF7F8',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ fontSize: '18px' }}>💡</div>
          <div style={{ fontSize: '11px', color: '#252733', lineHeight: '1.4' }}>
            Data updated in real-time from Thane City Digital Twin sensor grid & IMD Radar.
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherModal;
