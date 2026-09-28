import { useState } from 'react';
import { Building2, Shield, Bell, Zap, Save, Check } from 'lucide-react';

export default function Settings({ hospital }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: hospital?.name || 'City Central Hospital',
    code: hospital?.code || 'HOSP-001',
    address: hospital?.address || '124 Healthcare Blvd, Sector 4, Bangalore',
    icuBeds: hospital?.beds?.icu || 14,
    emergencyBeds: hospital?.beds?.emergency || 22,
    autoDispatch: true,
    trafficOverridePriority: 'HIGH',
    smsAlerts: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0' }}>Hospital Portal Settings</h1>
        <p style={{ color: '#737783', margin: 0 }}>Configure operation thresholds, traffic signal preemption, and alerts</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Hospital Identity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Building2 color="#6FC4BC" size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Hospital Profile</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hospital Code</label>
              <input
                className="form-input"
                value={form.code}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address</label>
              <input
                className="form-input"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Capacity & Emergency Thresholds */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield color="#C8BDE8" size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Capacity & Response Configuration</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Max ICU Bed Capacity</label>
              <input
                type="number"
                className="form-input"
                value={form.icuBeds}
                onChange={e => setForm({ ...form, icuBeds: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Emergency Bay Beds</label>
              <input
                type="number"
                className="form-input"
                value={form.emergencyBeds}
                onChange={e => setForm({ ...form, emergencyBeds: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* AI & Traffic Control Integration */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Zap color="#8FD3CB" size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Smart Traffic & AI Dispatch</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Auto Ambulance Dispatch</div>
                <div style={{ fontSize: '0.8rem', color: '#737783' }}>Automatically assign nearest free ambulance to severe accidents</div>
              </div>
              <input
                type="checkbox"
                checked={form.autoDispatch}
                onChange={e => setForm({ ...form, autoDispatch: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#6FC4BC' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #E8EEEE', pt: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>SMS & Broadcast Alerts</div>
                <div style={{ fontSize: '0.8rem', color: '#737783' }}>Send emergency notifications to shift doctors & drivers</div>
              </div>
              <input
                type="checkbox"
                checked={form.smsAlerts}
                onChange={e => setForm({ ...form, smsAlerts: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#6FC4BC' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem' }}>
          {saved ? <><Check size={18} /> Settings Saved Successfully!</> : <><Save size={18} /> Save Settings</>}
        </button>
      </form>
    </div>
  );
}
