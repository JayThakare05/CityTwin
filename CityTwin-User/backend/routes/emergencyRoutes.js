const express = require('express');
const router = express.Router();
const { supabaseAdmin, parseWkbPoint } = require('../config/supabase');
const { sampleEmergencyServices } = require('../data/seedData');

// Get Emergency Services (Hospitals from Supabase + Police/Fire)
router.get('/', async (req, res) => {
  try {
    const { type, lat, lon } = req.query;

    // Fetch Hospitals from Supabase 'hospitals'
    let supabaseHospitals = [];
    try {
      const { data: hospList, error } = await supabaseAdmin
        .from('hospitals')
        .select('*')
        .eq('is_active', true);

      if (!error && hospList) {
        supabaseHospitals = hospList.map((h) => {
          let coords = [72.9723, 19.2039];
          if (h.location) {
            const parsed = parseWkbPoint(h.location);
            if (parsed) coords = parsed;
          }

          return {
            id: h.id,
            name: h.name,
            type: 'Hospital',
            location: { coordinates: coords },
            address: h.address || 'Thane',
            phone: h.phone || '108',
            email: h.email,
            availableBeds: h.available_beds || 15,
            totalBeds: h.total_beds || 100,
            icuBeds: h.icu_beds || 5,
            specializations: h.specializations || ['Emergency', 'General Medicine'],
            status: `${h.available_beds || 15} Available Beds (Live Supabase)`
          };
        });
      }
    } catch (hospErr) {
      console.warn('[CityTwin] Fetch Supabase hospitals error:', hospErr.message);
    }

    // Combine with other emergency services (Police, Fire)
    const otherServices = sampleEmergencyServices.filter(s => s.type !== 'Hospital');
    let combined = [
      ...(supabaseHospitals.length > 0 ? supabaseHospitals : sampleEmergencyServices.filter(s => s.type === 'Hospital')),
      ...otherServices
    ];

    if (type) {
      combined = combined.filter(s => s.type.toLowerCase() === type.toLowerCase());
    }

    return res.json({ success: true, count: combined.length, data: combined });
  } catch (error) {
    console.error('[CityTwin] Fetch emergency services error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
