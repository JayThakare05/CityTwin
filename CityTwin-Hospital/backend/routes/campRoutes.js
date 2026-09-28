const express = require('express');
const router = express.Router();
const { getMemoryStore } = require('../config/db');

// Get all medical camps (optionally filter by hospitalId or status)
router.get('/', (req, res) => {
  const { hospitalId, status } = req.query;
  const store = getMemoryStore();
  let camps = [...store.medicalCamps];
  
  if (hospitalId) camps = camps.filter(c => c.hospitalId === hospitalId);
  if (status) camps = camps.filter(c => c.status === status);
  
  res.json({ success: true, count: camps.length, data: camps });
});

// Create new camp request
router.post('/', (req, res) => {
  const store = getMemoryStore();
  const newCamp = {
    id: 'camp_' + Date.now(),
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.medicalCamps.push(newCamp);
  res.status(201).json({ success: true, data: newCamp });
});

// Update camp status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  const store = getMemoryStore();
  const camp = store.medicalCamps.find(c => c.id === req.params.id);
  if (!camp) return res.status(404).json({ success: false, message: 'Camp not found' });
  
  camp.status = status;
  camp.updatedAt = new Date().toISOString();
  res.json({ success: true, data: camp });
});

module.exports = router;
