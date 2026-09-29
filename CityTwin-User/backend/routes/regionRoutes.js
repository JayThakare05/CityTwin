const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { sampleRegions } = require('../data/seedData');

// Get All Region Digital Twins (from Supabase city_zones + metrics)
router.get('/', async (req, res) => {
  try {
    const { data: zones, error } = await supabaseAdmin
      .from('city_zones')
      .select('*')
      .order('name', { ascending: true });

    if (!error && zones && zones.length > 0) {
      // Map to frontend expected schema
      const mapped = zones.map((z) => {
        const seedMatch = sampleRegions.find(s => s.id === z.slug || s.name.toLowerCase() === z.name.toLowerCase());
        return {
          id: z.slug || z.id,
          dbId: z.id,
          name: z.name,
          code: seedMatch?.code || z.slug?.toUpperCase() || 'ZONE',
          center: [z.center_latitude || 19.2183, z.center_longitude || 72.9781],
          areaSqKm: seedMatch?.areaSqKm || 120,
          population: seedMatch?.population || '1,000,000',
          boundary: z.boundary_geojson || seedMatch?.boundary,
          metrics: seedMatch?.metrics || {
            aqi: 88,
            aqiCategory: 'Moderate',
            temp: 28,
            humidity: 70,
            rainProb: 35,
            dengueRisk: 'Moderate',
            dengueCases: 25,
            waterloggingRisk: 'Moderate',
            trafficCongestion: 'Normal'
          },
          activeAlerts: seedMatch?.activeAlerts || []
        };
      });

      return res.json({ success: true, count: mapped.length, data: mapped });
    }

    // Fallback to sample regions
    return res.json({ success: true, count: sampleRegions.length, data: sampleRegions });
  } catch (error) {
    console.error('[CityTwin] Fetch regions error:', error);
    return res.json({ success: true, count: sampleRegions.length, data: sampleRegions });
  }
});

// Get Specific Region details by ID / Slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: zone } = await supabaseAdmin
      .from('city_zones')
      .select('*')
      .or(`slug.eq.${id},id.eq.${id}`)
      .single();

    if (zone) {
      const seedMatch = sampleRegions.find(s => s.id === zone.slug);
      return res.json({
        success: true,
        data: {
          id: zone.slug || zone.id,
          dbId: zone.id,
          name: zone.name,
          center: [zone.center_latitude, zone.center_longitude],
          boundary: zone.boundary_geojson,
          metrics: seedMatch?.metrics || {}
        }
      });
    }

    const fallback = sampleRegions.find(r => r.id === id || r.code === id.toUpperCase());
    if (fallback) return res.json({ success: true, data: fallback });

    return res.status(404).json({ success: false, message: 'Region digital twin not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
