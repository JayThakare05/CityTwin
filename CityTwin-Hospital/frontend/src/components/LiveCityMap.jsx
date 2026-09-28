import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CityMap from './CityMap.jsx';
import api from '../api/apiClient.js';

export default function LiveCityMap({ hospital, onNavigate }) {
  const location = useLocation();
  const mapState = location.state || {};
  const [risks, setRisks] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [accidents, setAccidents] = useState([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [riskRes, ambRes, accRes] = await Promise.all([
        api.getPandemicRisks(),
        api.getAmbulances(hospital?.hospitalId),
        api.getAccidents(hospital?.hospitalId),
      ]);
      if (riskRes.success) setRisks(riskRes.data);
      if (ambRes.success) setAmbulances(ambRes.data);
      if (accRes.success) setAccidents(accRes.data);
    } catch (err) { console.error(err); }
  };

  // Determine center based on context
  const getCenter = () => {
    if (mapState.risk?.coordinates) {
      return [mapState.risk.coordinates[1], mapState.risk.coordinates[0]];
    }
    if (mapState.accident?.location?.coordinates) {
      return [mapState.accident.location.coordinates[1], mapState.accident.location.coordinates[0]];
    }
    if (hospital?.location?.coordinates) {
      return [hospital.location.coordinates[1], hospital.location.coordinates[0]];
    }
    return [19.2039, 72.9723];
  };

  // Get signals from emergency ambulances
  const allSignals = ambulances.reduce((acc, amb) => {
    if (amb.routeSignals) acc.push(...amb.routeSignals);
    return acc;
  }, []);

  // Get route paths from emergency ambulances
  const routePath = ambulances.reduce((acc, amb) => {
    if (amb.routeSignals?.length > 0 && amb.location?.coordinates) {
      const points = [amb.location.coordinates, ...amb.routeSignals.map(s => s.coordinates)];
      if (amb.currentDestination?.coordinates) points.push(amb.currentDestination.coordinates);
      return points;
    }
    return acc;
  }, []);

  return (
    <div className="page-enter" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onNavigate('dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#252733', padding: 4 }}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Live City Map</h3>
      </div>
      <div style={{ flex: 1, padding: '0 0 0 0' }}>
        <CityMap
          center={getCenter()}
          zoom={mapState.risk || mapState.accident ? 15 : 13}
          ambulances={ambulances}
          hospitals={hospital ? [hospital] : []}
          signals={allSignals}
          accidents={accidents}
          risks={risks}
          routePath={routePath}
          className="map-fullscreen"
        />
      </div>
    </div>
  );
}
