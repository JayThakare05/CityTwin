import { useState } from 'react';
import { Download, FileText, Calendar, TrendingDown, Clock, ShieldCheck, Siren } from 'lucide-react';

export default function Reports() {
  const [timeRange, setTimeRange] = useState('30d');

  const reportData = [
    { title: 'Average Ambulance Response Time', value: '4.8 mins', change: '-1.2 min vs last month', positive: true, icon: Clock, color: '#6FC4BC' },
    { title: 'Emergency Traffic Corridor Usage', value: '142 trips', change: '+18% efficiency', positive: true, icon: Siren, color: '#E8BDD6' },
    { title: 'Pandemic Medical Camps Conducted', value: '18 camps', change: '4,200 citizens reached', positive: true, icon: ShieldCheck, color: '#8FD3CB' }
  ];

  const recentExportLogs = [
    { id: 'REP-2026-09', name: 'Monthly Emergency Response & Traffic Corridor Audit', date: '2026-09-01', size: '2.4 MB', type: 'PDF' },
    { id: 'REP-2026-08', name: 'Pandemic Risk & Medical Camp Outreach Summary', date: '2026-08-15', size: '1.8 MB', type: 'CSV' },
    { id: 'REP-2026-07', name: 'Ambulance Fleet Utilization & Speed Report', date: '2026-08-01', size: '3.1 MB', type: 'PDF' }
  ];

  const handleDownload = (filename) => {
    alert(`Downloading ${filename}... (Simulated File Download)`);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 6px 0' }}>Analytics & Operational Reports</h1>
          <p style={{ color: '#737783', margin: 0 }}>Performance metrics, emergency response times, and downloadable audit logs</p>
        </div>
        <select
          className="form-input"
          style={{ width: 'auto', padding: '8px 16px' }}
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {reportData.map((item, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: `${item.color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <item.icon size={24} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#737783' }}>{item.title}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, margin: '2px 0' }}>{item.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6FC4BC', fontWeight: 600 }}>{item.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table of Downloadable Reports */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Available Operational Reports</h3>
          <button className="btn btn-secondary" onClick={() => handleDownload('CityTwin_Full_Export.zip')}>
            <Download size={16} /> Export All Data
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentExportLogs.map((log) => (
            <div key={log.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#E8EEEE',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={20} color="#6FC4BC" />
                <div>
                  <div style={{ fontWeight: 600 }}>{log.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#737783' }}>
                    ID: {log.id} • Generated on {log.date} • {log.size}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => handleDownload(`${log.id}.${log.type.toLowerCase()}`)}
              >
                <Download size={14} /> Download {log.type}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
