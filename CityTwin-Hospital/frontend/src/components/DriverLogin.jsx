import { useState } from 'react';
import { Truck, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function DriverLogin({ onLogin }) {
  const [driverId, setDriverId] = useState('DRV-001');
  const [password, setPassword] = useState('driver123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin({ driverId, password });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-logo">
        <div className="login-logo-icon" style={{ background: 'linear-gradient(135deg, #E89A9A, #D47777)' }}>
          <Truck />
        </div>
        <h1>CityTwin</h1>
        <p>Ambulance Driver</p>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}

        <div className="login-field">
          <label>Driver ID</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="DRV-001"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
            <Truck style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#A0A4B0' }} />
          </div>
        </div>

        <div className="login-field">
          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: 42, paddingRight: 42 }}
            />
            <KeyRound style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#A0A4B0' }} />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A0A4B0', padding: 4 }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className="login-btn" type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #E89A9A, #D47777)' }}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
