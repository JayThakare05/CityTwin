const express = require('express');
const router = express.Router();
const { getMemoryStore } = require('../config/db');

// Get drivers (optionally filter by hospitalId)
router.get('/', (req, res) => {
  const { hospitalId } = req.query;
  const store = getMemoryStore();
  let drivers = store.drivers.map(({ password, ...d }) => d);
  
  if (hospitalId) drivers = drivers.filter(d => d.hospitalId === hospitalId);
  
  res.json({ success: true, count: drivers.length, data: drivers });
});

// Get driver by ID
router.get('/:driverId', (req, res) => {
  const store = getMemoryStore();
  const driver = store.drivers.find(d => d.driverId === req.params.driverId);
  if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
  
  const { password, ...driverData } = driver;
  
  // Also get the ambulance info
  const ambulance = store.ambulances.find(a => a.driverId === driver.driverId);
  
  res.json({ success: true, data: { ...driverData, ambulance } });
});

// Update driver status
router.patch('/:driverId/status', (req, res) => {
  const { status } = req.body;
  const store = getMemoryStore();
  const driver = store.drivers.find(d => d.driverId === req.params.driverId);
  if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
  
  driver.status = status;
  
  // Also update ambulance status
  const ambulance = store.ambulances.find(a => a.driverId === driver.driverId);
  if (ambulance) ambulance.status = status;
  
  const { password, ...driverData } = driver;
  res.json({ success: true, data: driverData });
});

module.exports = router;
