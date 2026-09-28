const express = require('express');
const router = express.Router();
const { getMemoryStore } = require('../config/db');

// Get all ambulances (optionally filter by hospitalId or status)
router.get('/', (req, res) => {
  const { hospitalId, status } = req.query;
  const store = getMemoryStore();
  let ambulances = [...store.ambulances];
  
  if (hospitalId) ambulances = ambulances.filter(a => a.hospitalId === hospitalId);
  if (status) ambulances = ambulances.filter(a => a.status === status);
  
  res.json({ success: true, count: ambulances.length, data: ambulances });
});

// Get single ambulance
router.get('/:vehicleNumber', (req, res) => {
  const store = getMemoryStore();
  const ambulance = store.ambulances.find(a => a.vehicleNumber === req.params.vehicleNumber);
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
  res.json({ success: true, data: ambulance });
});

// Update ambulance status
router.patch('/:vehicleNumber/status', (req, res) => {
  const { status } = req.body;
  const store = getMemoryStore();
  const ambulance = store.ambulances.find(a => a.vehicleNumber === req.params.vehicleNumber);
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
  
  ambulance.status = status;
  ambulance.lastUpdated = new Date().toISOString();
  
  // Also update driver status
  if (ambulance.driverId) {
    const driver = store.drivers.find(d => d.driverId === ambulance.driverId);
    if (driver) driver.status = status;
  }
  
  res.json({ success: true, data: ambulance });
});

// Update ambulance location (from driver app)
router.patch('/:vehicleNumber/location', (req, res) => {
  const { coordinates } = req.body;
  const store = getMemoryStore();
  const ambulance = store.ambulances.find(a => a.vehicleNumber === req.params.vehicleNumber);
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
  
  ambulance.location.coordinates = coordinates;
  ambulance.lastUpdated = new Date().toISOString();
  
  res.json({ success: true, data: ambulance });
});

// Activate emergency / green corridor
router.post('/:vehicleNumber/emergency', (req, res) => {
  const { destination, destinationCoords } = req.body;
  const store = getMemoryStore();
  const ambulance = store.ambulances.find(a => a.vehicleNumber === req.params.vehicleNumber);
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
  
  ambulance.status = 'Emergency';
  ambulance.greenCorridorActive = true;
  ambulance.currentDestination = {
    name: destination || 'Jupiter Hospital Thane',
    coordinates: destinationCoords || [72.9723, 19.2039]
  };
  
  // Assign traffic signals along route
  const signals = store.trafficSignals.slice(0, 4).map((sig, i) => ({
    ...sig,
    status: i === 0 ? 'GREEN' : 'RED',
    passed: false
  }));
  ambulance.routeSignals = signals;
  ambulance.eta = '8 min';
  ambulance.distanceKm = 3.5;
  ambulance.lastUpdated = new Date().toISOString();
  
  // Update driver status
  if (ambulance.driverId) {
    const driver = store.drivers.find(d => d.driverId === ambulance.driverId);
    if (driver) driver.status = 'Emergency';
  }
  
  res.json({ success: true, data: ambulance });
});

// Update signal status (simulate green corridor progression)
router.patch('/:vehicleNumber/signal/:signalId', (req, res) => {
  const { status } = req.body;
  const store = getMemoryStore();
  const ambulance = store.ambulances.find(a => a.vehicleNumber === req.params.vehicleNumber);
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
  
  const signal = ambulance.routeSignals?.find(s => s.id === req.params.signalId);
  if (signal) {
    signal.status = status || 'GREEN';
    signal.passed = true;
    
    // Activate next signal
    const idx = ambulance.routeSignals.indexOf(signal);
    if (idx < ambulance.routeSignals.length - 1) {
      ambulance.routeSignals[idx + 1].status = 'GREEN';
    }
    
    // Update ETA
    const remaining = ambulance.routeSignals.filter(s => !s.passed).length;
    ambulance.eta = `${remaining * 2} min`;
    ambulance.distanceKm = remaining * 0.8;
  }
  
  res.json({ success: true, data: ambulance });
});

// End emergency
router.post('/:vehicleNumber/end-emergency', (req, res) => {
  const store = getMemoryStore();
  const ambulance = store.ambulances.find(a => a.vehicleNumber === req.params.vehicleNumber);
  if (!ambulance) return res.status(404).json({ success: false, message: 'Ambulance not found' });
  
  ambulance.status = 'Available';
  ambulance.greenCorridorActive = false;
  ambulance.currentDestination = null;
  ambulance.routeSignals = [];
  ambulance.eta = null;
  ambulance.distanceKm = null;
  ambulance.lastUpdated = new Date().toISOString();
  
  if (ambulance.driverId) {
    const driver = store.drivers.find(d => d.driverId === ambulance.driverId);
    if (driver) {
      driver.status = 'Available';
      driver.totalTrips = (driver.totalTrips || 0) + 1;
    }
  }
  
  res.json({ success: true, data: ambulance });
});

module.exports = router;
