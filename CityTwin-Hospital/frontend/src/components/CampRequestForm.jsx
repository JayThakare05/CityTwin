import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import api from '../api/apiClient.js';

export default function CampRequestForm({ hospital, onNavigate }) {
  const location = useLocation();
  const riskData = location.state?.risk;

  const [form, setForm] = useState({
    location: riskData?.location || '',
    disease: riskData?.disease || '',
    riskLevel: riskData?.riskLevel || 'Moderate',
    detectedCases: riskData?.cases || '',
    requiredDoctors: 2,
    requiredNurses: 3,
    ambulanceRequired: false,
    preferredDate: '',
    additionalRequirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        hospitalId: hospital?.hospitalId,
        hospitalName: hospital?.name,
        location: { address: form.location, coordinates: riskData?.coordinates || [72.97, 19.20] },
        regionName: riskData?.regionName || 'Thane City (TMC)',
        distanceKm: riskData?.distanceKm || '5 km',
      };
      const res = await api.createCamp(payload);
      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="page-enter page-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(123,200,154,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <CheckCircle size={40} style={{ color: '#4A9A6A' }} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Camp Request Submitted!</h2>
          <p style={{ fontSize: '0.9rem', color: '#737783', maxWidth: 300, marginBottom: 24 }}>
            Your medical camp request has been submitted and is pending review by city administration.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-outline" onClick={() => onNavigate('camps')}>View All Camps</button>
            <button className="btn-primary" onClick={() => onNavigate('dashboard')}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter page-content">
      <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onNavigate('dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#252733', padding: 4 }}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Request Medical Camp</h3>
      </div>

      <form className="camp-form" onSubmit={handleSubmit}>
        <div className="form-card">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              placeholder="Enter location"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Disease / Risk</label>
              <select value={form.disease} onChange={e => handleChange('disease', e.target.value)} required>
                <option value="">Select</option>
                <option value="Dengue">Dengue</option>
                <option value="Malaria">Malaria</option>
                <option value="Cholera">Cholera</option>
                <option value="COVID">COVID-19</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Risk Level</label>
              <select value={form.riskLevel} onChange={e => handleChange('riskLevel', e.target.value)}>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Detected Cases</label>
            <input
              type="number"
              value={form.detectedCases}
              onChange={e => handleChange('detectedCases', e.target.value)}
              placeholder="Number of detected cases"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Required Doctors</label>
              <input
                type="number"
                value={form.requiredDoctors}
                onChange={e => handleChange('requiredDoctors', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Required Nurses</label>
              <input
                type="number"
                value={form.requiredNurses}
                onChange={e => handleChange('requiredNurses', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ margin: 0 }}>Ambulance Required</label>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.ambulanceRequired}
                onChange={e => handleChange('ambulanceRequired', e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="form-group">
            <label>Preferred Date</label>
            <input
              type="date"
              value={form.preferredDate}
              onChange={e => handleChange('preferredDate', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Additional Requirements</label>
            <textarea
              value={form.additionalRequirements}
              onChange={e => handleChange('additionalRequirements', e.target.value)}
              placeholder="Any additional notes..."
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              'Submitting...'
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Send size={16} /> Submit Camp Request
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
