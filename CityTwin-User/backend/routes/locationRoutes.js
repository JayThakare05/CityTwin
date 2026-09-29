const express = require('express');
const router = express.Router();

// Search locations using TomTom Places/Search API
router.get('/search', async (req, res) => {
  try {
    const { q, lat = 19.2183, lon = 72.9781 } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, results: [] });
    }

    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'TomTom API key not configured' });
    }

    const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(q.trim())}.json?key=${apiKey}&lat=${lat}&lon=${lon}&radius=45000&countryCode=IN&limit=8`;
    const response = await fetch(url);
    const data = await response.json();

    const results = (data.results || []).map(r => {
      const freeform = r.address?.freeformAddress || '';
      const poiName = r.poi?.name;
      const displayTitle = poiName && !freeform.startsWith(poiName) ? `${poiName}, ${freeform}` : freeform || 'Thane Location';

      return {
        id: r.id,
        name: poiName || displayTitle,
        address: displayTitle,
        subdivision: r.address?.municipalitySubdivision || r.address?.municipality || 'Thane',
        coordinates: [r.position.lon, r.position.lat], // [lng, lat]
        distMeters: r.dist
      };
    });

    return res.json({ success: true, results });
  } catch (error) {
    console.error('[CityTwin] TomTom location search error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
