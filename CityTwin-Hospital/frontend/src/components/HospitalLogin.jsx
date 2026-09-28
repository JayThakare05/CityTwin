import { useState } from 'react';
import { Building2, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';

export default function HospitalLogin({ onLogin }) {
  const [email, setEmail] = useState('admin@jupiterthane.com');
  const [password, setPassword] = useState('hospital123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-logo">
        <div className="login-logo-icon">
          <Building2 />
        </div>
        <h1>CityTwin</h1>
        <p>Hospital Operations Portal</p>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        {error && <div className="login-error">{error}</div>}

        <div className="login-field">
          <label>Hospital ID / Email</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="admin@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
            <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#A0A4B0' }} />
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

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="login-forgot">Forgot Password?</p>
      </form>
    </div>
  );
}
