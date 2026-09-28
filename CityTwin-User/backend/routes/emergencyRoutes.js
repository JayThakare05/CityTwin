const express = require('express');
const router = express.Router();
const EmergencyService = require('../models/EmergencyService');
const { getIsConnected, getMemoryStore } = require('../config/db');

// Get Emergency Services (Hospitals, Police, Fire Stations)
router.get('/', async (req, res) => {
  try {
    const { type, lat, lon } = req.query;

    // Use Overpass API if lat/lon is provided
    if (lat && lon) {
      try {
        const radius = 5000; // 5km radius
        let overpassQuery = '';
        
        if (type === 'Hospital') {
          overpassQuery = `[out:json];(node["amenity"="hospital"](around:${radius},${lat},${lon});way["amenity"="hospital"](around:${radius},${lat},${lon}););out center;`;
        } else if (type === 'Police') {
          overpassQuery = `[out:json];(node["amenity"="police"](around:${radius},${lat},${lon});way["amenity"="police"](around:${radius},${lat},${lon}););out center;`;
        } else if (type === 'Fire') {
          overpassQuery = `[out:json];(node["amenity"="fire_station"](around:${radius},${lat},${lon});way["amenity"="fire_station"](around:${radius},${lat},${lon}););out center;`;
        } else {
          overpassQuery = `[out:json];(node["amenity"="hospital"](around:${radius},${lat},${lon});way["amenity"="hospital"](around:${radius},${lat},${lon});node["amenity"="police"](around:${radius},${lat},${lon});way["amenity"="police"](around:${radius},${lat},${lon});node["amenity"="fire_station"](around:${radius},${lat},${lon});way["amenity"="fire_station"](around:${radius},${lat},${lon}););out center;`;
        }
        
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
        const response = await fetch(overpassUrl);
        const data = await response.json();

        const services = data.elements.map(el => {
          const amenity = el.tags?.amenity;
          let serviceType = 'Hospital';
          if (amenity === 'police') serviceType = 'Police';
          if (amenity === 'fire_station') serviceType = 'Fire';

          return {
            id: el.id.toString(),
            name: el.tags?.name || `Unnamed ${serviceType}`,
            type: serviceType,
            location: {
              type: 'Point',
              coordinates: [el.lon || el.center?.lon, el.lat || el.center?.lat]
            },
            address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || 'Local Area',
            phone: el.tags?.phone || '911',
            status: 'Active (OSM)'
          };
        });

        if (services.length > 0) {
          return res.json({ success: true, count: services.length, data: services });
        }
      } catch (err) {
        console.warn('Overpass API error:', err.message, '- Falling back to DB/Seed');
      }
    }

    if (getIsConnected()) {
      let filter = {};
      if (type) filter.type = type;
      const services = await EmergencyService.find(filter);
      return res.json({ success: true, count: services.length, data: services });
    } else {
      const store = getMemoryStore();
      let services = [...store.emergencyServices];
      if (type) services = services.filter(s => s.type === type);
      return res.json({ success: true, count: services.length, data: services });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
