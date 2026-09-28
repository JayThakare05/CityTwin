const express = require('express');
const router = express.Router();
const { getMemoryStore } = require('../config/db');

// Get pandemic risk areas
router.get('/', (req, res) => {
  const store = getMemoryStore();
  res.json({ success: true, count: store.pandemicRisks.length, data: store.pandemicRisks });
});

// Get dashboard stats
router.get('/stats', (req, res) => {
  const { hospitalId } = req.query;
  const store = getMemoryStore();
  
  let ambulances = store.ambulances;
  if (hospitalId) ambulances = ambulances.filter(a => a.hospitalId === hospitalId);
  
  const stats = {
    activeAmbulances: ambulances.filter(a => a.status !== 'Offline').length,
    emergencies: ambulances.filter(a => a.status === 'Emergency').length,
    nearbyRiskAreas: store.pandemicRisks.filter(p => parseFloat(p.distanceKm) < 10).length,
    campRequests: store.medicalCamps.filter(c => c.status === 'Pending' || c.status === 'Approved').length,
    totalAmbulances: ambulances.length,
    availableAmbulances: ambulances.filter(a => a.status === 'Available').length,
    offlineAmbulances: ambulances.filter(a => a.status === 'Offline').length,
    totalAccidents: store.accidentAlerts.filter(a => a.status === 'New').length
  };
  
  res.json({ success: true, data: stats });
});

module.exports = router;
