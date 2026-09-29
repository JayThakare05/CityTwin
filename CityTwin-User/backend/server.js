const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const {
  supabaseAdmin,
  ensureDefaultCitizenUser
} = require('./config/supabase');
const { sampleRegions, sampleEmergencyServices } = require('./data/seedData');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/reports', require('./routes/issueRoutes')); // Alias for reports
// Dedicated categories endpoint
const categoriesRouter = express.Router();
categoriesRouter.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('report_categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
app.use('/api/categories', categoriesRouter);
app.use('/api/regions', require('./routes/regionRoutes'));
app.use('/api/emergency-services', require('./routes/emergencyRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let supabaseOk = false;
  try {
    const { count, error } = await supabaseAdmin.from('report_categories').select('*', { count: 'exact', head: true });
    supabaseOk = !error && count !== null;
  } catch {
    supabaseOk = false;
  }

  res.json({
    status: 'online',
    appName: 'CityTwin Backend API',
    database: 'Supabase PostgreSQL',
    supabaseConnected: supabaseOk,
    timestamp: new Date().toISOString()
  });
});

// Seed infrastructure data into Supabase if empty (city_zones + hospitals)
const seedSupabaseData = async () => {
  try {
    await ensureDefaultCitizenUser();

    // 1. Seed City Zones
    const { count: zoneCount } = await supabaseAdmin
      .from('city_zones')
      .select('*', { count: 'exact', head: true });

    if (!zoneCount || zoneCount === 0) {
      for (const r of sampleRegions) {
        const ring = r.boundary.coordinates[0];
        const polyStr = ring.map(pt => `${pt[0]} ${pt[1]}`).join(', ');
        const boundaryWkt = `SRID=4326;POLYGON((${polyStr}))`;

        await supabaseAdmin.from('city_zones').insert({
          name: r.name,
          city: 'Thane',
          slug: r.id,
          zone_type: 'Municipal Corporation',
          center_latitude: r.center[0],
          center_longitude: r.center[1],
          boundary: boundaryWkt,
          boundary_geojson: r.boundary,
          is_active: true
        });
      }
      console.log('[CityTwin Seed] Seeded Thane district city zones into Supabase');
    }

    // 2. Seed Hospitals
    const { count: hospCount } = await supabaseAdmin
      .from('hospitals')
      .select('*', { count: 'exact', head: true });

    if (!hospCount || hospCount === 0) {
      const hospitals = sampleEmergencyServices.filter(s => s.type === 'Hospital');
      for (const h of hospitals) {
        const [lng, lat] = h.location.coordinates;
        const ptWkt = `SRID=4326;POINT(${lng} ${lat})`;
        const email = `${h.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@thanehealth.gov.in`;

        await supabaseAdmin.from('hospitals').insert({
          name: h.name,
          email,
          phone: h.phone,
          address: h.address,
          location: ptWkt,
          total_beds: h.totalBeds || 200,
          available_beds: h.availableBeds || 15,
          icu_beds: Math.floor((h.availableBeds || 15) / 2),
          specializations: ['Emergency', 'General Medicine', 'Trauma'],
          is_active: true
        });
      }
      console.log('[CityTwin Seed] Seeded emergency hospitals into Supabase');
    }
  } catch (err) {
    console.warn('[CityTwin Seed] Supabase seed notice:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

seedSupabaseData().finally(() => {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 CityTwin Backend API running on port ${PORT}`);
    console.log(`⚡ Connected to Supabase: ${process.env.SUPABASE_URL}`);
    console.log(`📍 API Base: http://localhost:${PORT}/api`);
    console.log(`📊 Reports & Media: public.reports & report-images bucket`);
    console.log(`=================================================`);
  });
});
