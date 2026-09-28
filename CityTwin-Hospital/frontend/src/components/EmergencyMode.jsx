import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CityMap from './CityMap.jsx';
import api from '../api/apiClient.js';

export default function EmergencyMode({ driver, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  const vehicleNumber = stateData.vehicleNumber || 'MH-12-CD-5678';
  const destination = stateData.destination || 'City Hospital';

  // Live simulation states
  const [progress, setProgress] = useState(15); // 0 to 100 percentage
  const [distanceKm, setDistanceKm] = useState(4.2);
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [speedKmh, setSpeedKmh] = useState(62);
  const [signals, setSignals] = useState([
    { id: 1, name: 'Signal 1', status: 'GREEN' },
    { id: 2, name: 'Signal 2', status: 'RED' },
    { id: 3, name: 'Signal 3', status: 'RED' }
  ]);

  // Ambulance moving coordinates simulation from origin [72.9650, 19.1950] to hospital [72.9723, 19.2039]
  const origin = [72.9650, 19.1950];
  const hospitalCoord = [72.9723, 19.2039];
  const [ambCoord, setAmbCoord] = useState(origin);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 5;
        // Interpolate position
        const ratio = next / 100;
        const currentLng = origin[0] + (hospitalCoord[0] - origin[0]) * ratio;
        const currentLat = origin[1] + (hospitalCoord[1] - origin[1]) * ratio;
        setAmbCoord([currentLng, currentLat]);

        // Dynamic distance & ETA
        const remDist = Math.max(0, (4.2 * (1 - ratio))).toFixed(1);
        const remEta = Math.max(0, Math.ceil(8 * (1 - ratio)));
        setDistanceKm(parseFloat(remDist));
        setEtaMinutes(remEta);

        // Turn signals green as progress passes 35% and 70%
        setSignals(prevSignals => prevSignals.map(sig => {
          if (sig.id === 2 && next >= 35) return { ...sig, status: 'GREEN' };
          if (sig.id === 3 && next >= 70) return { ...sig, status: 'GREEN' };
          return sig;
        }));

        return next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const handleEnd = async () => {
    try {
      await api.endEmergency(vehicleNumber);
    } catch (err) {
      console.error(err);
    }
    navigate('/drivers/home');
  };

  const routeSignalsForMap = [
    { id: 'sig-1', name: 'Signal 1', coordinates: [72.9670, 19.1970], status: signals[0].status },
    { id: 'sig-2', name: 'Signal 2', coordinates: [72.9695, 19.2000], status: signals[1].status },
    { id: 'sig-3', name: 'Signal 3', coordinates: [72.9710, 19.2020], status: signals[2].status }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EAF7F8',
      color: '#252733',
      padding: '24px 32px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#E89A9A',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }} />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.8px',
              color: '#D47777',
              textTransform: 'uppercase'
            }}>
              🚨 EMERGENCY ACTIVE
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
            {destination}
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#737783', marginTop: '2px' }}>
            Destination • {vehicleNumber}
          </div>
        </div>

        <button
          onClick={handleEnd}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#252733',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease'
          }}
        >
          End
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px 24px',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#252733' }}>
            {distanceKm} km
          </div>
          <div style={{ fontSize: '0.8rem', color: '#737783', fontWeight: 500, marginTop: '4px' }}>
            Distance
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px 24px',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#252733' }}>
            {etaMinutes} min
          </div>
          <div style={{ fontSize: '0.8rem', color: '#737783', fontWeight: 500, marginTop: '4px' }}>
            ETA
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '20px 24px',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#252733' }}>
            {speedKmh} km/h
          </div>
          <div style={{ fontSize: '0.8rem', color: '#737783', fontWeight: 500, marginTop: '4px' }}>
            Speed
          </div>
        </div>
      </div>

      {/* Green Corridor Active Status Bar */}
      <div style={{
        background: '#DDF4F1',
        border: '1px solid rgba(143,211,203,0.4)',
        borderRadius: '20px',
        padding: '24px 32px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#7BC89A',
            display: 'inline-block'
          }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#252733' }}>
            Green Corridor Active
          </span>
        </div>

        {/* Timeline Track with Animated Moving Ambulance */}
        <div style={{ position: 'relative', margin: '40px 10px 30px' }}>
          {/* Base Background Track Line */}
          <div style={{
            height: '4px',
            background: 'rgba(111,196,188,0.25)',
            borderRadius: '2px',
            width: '100%'
          }} />

          {/* Active Progress Green Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            background: '#6FC4BC',
            borderRadius: '2px',
            width: `${progress}%`,
            transition: 'width 0.5s linear'
          }} />

          {/* Moving Ambulance Marker Icon on Track */}
          <div style={{
            position: 'absolute',
            top: '-14px',
            left: `calc(${progress}% - 14px)`,
            transition: 'left 0.5s linear',
            fontSize: '18px'
          }}>
            🚑
          </div>

          {/* Signal 1 Badge */}
          <div style={{
            position: 'absolute',
            top: '-18px',
            left: '25%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#FFFFFF',
              border: `1.5px solid ${signals[0].status === 'GREEN' ? '#7BC89A' : '#E89A9A'}`,
              borderRadius: '12px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: signals[0].status === 'GREEN' ? '#4A9A6A' : '#D47777',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <span>🚦</span>
              <span>{signals[0].status}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#737783', marginTop: '6px', fontWeight: 500 }}>
              Signal 1
            </div>
          </div>

          {/* Signal 2 Badge */}
          <div style={{
            position: 'absolute',
            top: '-18px',
            left: '55%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#FFFFFF',
              border: `1.5px solid ${signals[1].status === 'GREEN' ? '#7BC89A' : '#E89A9A'}`,
              borderRadius: '12px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: signals[1].status === 'GREEN' ? '#4A9A6A' : '#D47777',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}>
              <span>🚦</span>
              <span>{signals[1].status}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#737783', marginTop: '6px', fontWeight: 500 }}>
              Signal 2
            </div>
          </div>

          {/* Signal 3 Badge */}
          <div style={{
            position: 'absolute',
            top: '-18px',
            left: '82%',
            transform: 'translateX(-50%)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#FFFFFF',
              border: `1.5px solid ${signals[2].status === 'GREEN' ? '#7BC89A' : '#E89A9A'}`,
              borderRadius: '12px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: signals[2].status === 'GREEN' ? '#4A9A6A' : '#D47777',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.3s ease'
            }}>
              <span>🚦</span>
              <span>{signals[2].status}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#737783', marginTop: '6px', fontWeight: 500 }}>
              Signal 3
            </div>
          </div>

          {/* Hospital Icon End Destination */}
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '-10px',
            fontSize: '20px'
          }}>
            🏥
          </div>
        </div>
      </div>

      {/* Live Route Map Panel */}
      <div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '1px',
          color: '#737783',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          LIVE ROUTE
        </div>

        <div style={{
          height: '420px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <CityMap
            center={[19.1995, 72.9685]}
            zoom={14}
            ambulances={[{
              vehicleNumber,
              driverName: driver?.name || 'Suresh Patil',
              status: 'Emergency',
              location: { coordinates: ambCoord }
            }]}
            hospitals={[{
              name: 'City Hospital',
              location: { coordinates: hospitalCoord }
            }]}
            signals={routeSignalsForMap}
            routePath={[origin, ambCoord, hospitalCoord]}
          />
        </div>
      </div>
    </div>
  );
}
