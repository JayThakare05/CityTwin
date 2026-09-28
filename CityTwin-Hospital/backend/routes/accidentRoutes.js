const express = require('express');
const router = express.Router();
const { getMemoryStore } = require('../config/db');

// Get all accident alerts
router.get('/', (req, res) => {
  const { status, hospitalId } = req.query;
  const store = getMemoryStore();
  let alerts = [...store.accidentAlerts];
  
  if (status) alerts = alerts.filter(a => a.status === status);
  if (hospitalId) alerts = alerts.filter(a => a.nearestHospitalId === hospitalId);
  
  alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: alerts.length, data: alerts });
});

// Create accident alert (from citizen app)
router.post('/', (req, res) => {
  const store = getMemoryStore();
  const newAlert = {
    id: 'acc_' + Date.now(),
    ...req.body,
    status: 'New',
    createdAt: new Date().toISOString()
  };
  store.accidentAlerts.unshift(newAlert);
  res.status(201).json({ success: true, data: newAlert });
});

// Dispatch ambulance to accident
router.patch('/:id/dispatch', (req, res) => {
  const { ambulanceVehicleNumber } = req.body;
  const store = getMemoryStore();
  
  const alert = store.accidentAlerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
  
  alert.status = 'Dispatched';
  alert.dispatchedAmbulance = ambulanceVehicleNumber;
  
  // Set ambulance to emergency
  const ambulance = store.ambulances.find(a => a.vehicleNumber === ambulanceVehicleNumber);
  if (ambulance) {
    ambulance.status = 'Emergency';
    ambulance.currentDestination = {
      name: alert.location.address,
      coordinates: alert.location.coordinates
    };
    ambulance.greenCorridorActive = true;
    
    const signals = store.trafficSignals.slice(0, 4).map((sig, i) => ({
      ...sig,
      status: i === 0 ? 'GREEN' : 'RED',
      passed: false
    }));
    ambulance.routeSignals = signals;
    ambulance.eta = '6 min';
    ambulance.distanceKm = 2.4;
  }
  
  res.json({ success: true, data: { alert, ambulance } });
});

// Update alert status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const store = getMemoryStore();
  const alert = store.accidentAlerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
  
  alert.status = status;
  res.json({ success: true, data: alert });
});

module.exports = router;
