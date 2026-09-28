const API_BASE = 'http://localhost:5001/api';

const getHeaders = () => {
  const token = localStorage.getItem('citytwin_hospital_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const api = {
  // Auth
  hospitalLogin: (data) =>
    fetch(`${API_BASE}/auth/hospital/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  
  driverLogin: (data) =>
    fetch(`${API_BASE}/auth/driver/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  
  getMe: () =>
    fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(r => r.json()),

  // Dashboard
  getStats: (hospitalId) =>
    fetch(`${API_BASE}/dashboard/stats?hospitalId=${hospitalId || ''}`, { headers: getHeaders() }).then(r => r.json()),
  
  getPandemicRisks: () =>
    fetch(`${API_BASE}/dashboard`, { headers: getHeaders() }).then(r => r.json()),

  // Ambulances
  getAmbulances: (hospitalId) =>
    fetch(`${API_BASE}/ambulances?hospitalId=${hospitalId || ''}`, { headers: getHeaders() }).then(r => r.json()),
  
  getAmbulance: (vehicleNumber) =>
    fetch(`${API_BASE}/ambulances/${encodeURIComponent(vehicleNumber)}`, { headers: getHeaders() }).then(r => r.json()),
  
  updateAmbulanceStatus: (vehicleNumber, status) =>
    fetch(`${API_BASE}/ambulances/${encodeURIComponent(vehicleNumber)}/status`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then(r => r.json()),
  
  activateEmergency: (vehicleNumber, data) =>
    fetch(`${API_BASE}/ambulances/${encodeURIComponent(vehicleNumber)}/emergency`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  
  passSignal: (vehicleNumber, signalId) =>
    fetch(`${API_BASE}/ambulances/${encodeURIComponent(vehicleNumber)}/signal/${signalId}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status: 'GREEN' }) }).then(r => r.json()),
  
  endEmergency: (vehicleNumber) =>
    fetch(`${API_BASE}/ambulances/${encodeURIComponent(vehicleNumber)}/end-emergency`, { method: 'POST', headers: getHeaders() }).then(r => r.json()),
  
  updateAmbulanceLocation: (vehicleNumber, coordinates) =>
    fetch(`${API_BASE}/ambulances/${encodeURIComponent(vehicleNumber)}/location`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ coordinates }) }).then(r => r.json()),

  // Medical Camps
  getCamps: (hospitalId) =>
    fetch(`${API_BASE}/camps?hospitalId=${hospitalId || ''}`, { headers: getHeaders() }).then(r => r.json()),
  
  createCamp: (data) =>
    fetch(`${API_BASE}/camps`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }).then(r => r.json()),
  
  updateCampStatus: (id, status) =>
    fetch(`${API_BASE}/camps/${id}/status`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then(r => r.json()),

  // Accidents
  getAccidents: (hospitalId) =>
    fetch(`${API_BASE}/accidents?hospitalId=${hospitalId || ''}`, { headers: getHeaders() }).then(r => r.json()),
  
  dispatchAmbulance: (accidentId, ambulanceVehicleNumber) =>
    fetch(`${API_BASE}/accidents/${accidentId}/dispatch`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ ambulanceVehicleNumber }) }).then(r => r.json()),

  // Drivers
  getDrivers: (hospitalId) =>
    fetch(`${API_BASE}/drivers?hospitalId=${hospitalId || ''}`, { headers: getHeaders() }).then(r => r.json()),
  
  getDriver: (driverId) =>
    fetch(`${API_BASE}/drivers/${driverId}`, { headers: getHeaders() }).then(r => r.json()),
  
  updateDriverStatus: (driverId, status) =>
    fetch(`${API_BASE}/drivers/${driverId}/status`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) }).then(r => r.json()),

  // Health
  health: () =>
    fetch(`${API_BASE}/health`).then(r => r.json()),
};

export default api;
