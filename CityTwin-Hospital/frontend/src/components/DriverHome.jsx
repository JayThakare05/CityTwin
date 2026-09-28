import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Siren, Building2 } from 'lucide-react';
import CityMap from './CityMap.jsx';
import api from '../api/apiClient.js';

export default function DriverHome({ driver, onLogout }) {
  const navigate = useNavigate();
  const [driverData, setDriverData] = useState(driver);
  const [ambulance, setAmbulance] = useState(null);
  const [dutyActive, setDutyActive] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    try {
      if (driver?.driverId) {
        const res = await api.getDriver(driver.driverId);
        if (res.success) {
          setDriverData(res.data);
          setAmbulance(res.data.ambulance);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEmergency = async () => {
    try {
      const vehicleNum = ambulance?.vehicleNumber || driverData?.ambulanceNumber || 'MH-12-CD-5678';
      await api.activateEmergency(vehicleNum, {
        destination: 'City Hospital',
        destinationCoords: [72.9723, 19.2039],
      });
    } catch (err) {
      console.error(err);
    }
    navigate('/drivers/emergency', {
      state: {
        driver: driverData,
        vehicleNumber: ambulance?.vehicleNumber || 'MH-12-CD-5678',
        destination: 'City Hospital'
      }
    });
  };

  const toggleDuty = () => {
    setDutyActive(!dutyActive);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p style={{ color: '#737783', fontSize: '0.85rem' }}>Loading Driver Panel...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EAF7F8',
      color: '#252733',
      padding: '24px 32px',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', color: '#737783', textTransform: 'uppercase' }}>
            DRIVER PANEL
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '2px 0 6px 0' }}>
            {driverData?.name || 'Suresh Patil'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#252733',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🚑 {ambulance?.vehicleNumber || driverData?.ambulanceNumber || 'MH-12-CD-5678'}
            </span>
            <span style={{
              background: dutyActive ? 'rgba(123,200,154,0.15)' : 'rgba(160,164,176,0.15)',
              color: dutyActive ? '#4A9A6A' : '#737783',
              padding: '4px 12px',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              • {dutyActive ? 'Available' : 'Offline'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#6FC4BC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              C
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#252733' }}>CityTwin</span>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              color: '#737783',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Duty Status Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '18px 24px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Duty Status</div>
          <div style={{ fontSize: '0.8rem', color: '#737783', marginTop: '2px' }}>Ready to respond</div>
        </div>
        <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={dutyActive}
            onChange={toggleDuty}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: dutyActive ? '#8FD3CB' : '#CCC',
            borderRadius: '34px',
            transition: '0.3s'
          }}>
            <span style={{
              position: 'absolute',
              content: '""',
              height: '22px',
              width: '22px',
              left: dutyActive ? '25px' : '3px',
              bottom: '3px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: '0.3s'
            }} />
          </span>
        </label>
      </div>

      {/* Emergency Response Center Button */}
      <div style={{ textAlign: 'center', margin: '40px 0 48px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: '#737783', textTransform: 'uppercase', marginBottom: '20px' }}>
          EMERGENCY RESPONSE
        </div>

        <button
          onClick={handleEmergency}
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E89A9A, #D47777)',
            border: '8px solid rgba(232, 154, 154, 0.25)',
            boxShadow: '0 12px 36px rgba(232, 154, 154, 0.45)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Siren size={38} style={{ marginBottom: '6px' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.5px' }}>EMERGENCY</span>
        </button>

        <p style={{ fontSize: '0.85rem', color: '#737783', margin: 0, maxWidth: '300px', margin: '0 auto' }}>
          Press to activate emergency mode and enable green corridor
        </p>
      </div>

      {/* My Location Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', color: '#737783', textTransform: 'uppercase', marginBottom: '12px' }}>
          MY LOCATION
        </div>

        <div style={{
          height: '360px',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <CityMap
            center={ambulance?.location?.coordinates ? [ambulance.location.coordinates[1], ambulance.location.coordinates[0]] : [19.2039, 72.9723]}
            zoom={14}
            ambulances={[{
              vehicleNumber: ambulance?.vehicleNumber || 'MH-12-CD-5678',
              driverName: driverData?.name || 'Suresh Patil',
              status: 'Available',
              location: { coordinates: [72.9723, 19.2039] }
            }]}
          />
        </div>
      </div>
    </div>
  );
}
