const express = require('express');
const router = express.Router();
const Region = require('../models/Region');
const { getIsConnected, getMemoryStore } = require('../config/db');

// Get All Region Digital Twins (Thane District cities)
router.get('/', async (req, res) => {
  try {
    if (getIsConnected()) {
      const regions = await Region.find();
      return res.json({ success: true, data: regions });
    } else {
      const store = getMemoryStore();
      return res.json({ success: true, data: store.regions });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Specific Region details by ID / Code
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const region = await Region.findOne({ $or: [{ id }, { code: id.toUpperCase() }] });
      if (!region) return res.status(404).json({ success: false, message: 'Region digital twin not found' });
      return res.json({ success: true, data: region });
    } else {
      const store = getMemoryStore();
      const region = store.regions.find(r => r.id === id || r.code === id.toUpperCase());
      if (!region) return res.status(404).json({ success: false, message: 'Region digital twin not found' });
      return res.json({ success: true, data: region });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
