const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsConnected, getMemoryStore } = require('./config/db');
const { sampleRegions, sampleEmergencyServices } = require('./data/seedData');

// Models
const User = require('./models/User');
const Issue = require('./models/Issue');
const Region = require('./models/Region');
const EmergencyService = require('./models/EmergencyService');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/regions', require('./routes/regionRoutes'));
app.use('/api/emergency-services', require('./routes/emergencyRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CityTwin Backend API',
    mongoConnected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

// Seed ONLY infrastructure data (regions + emergency services).
// Issues start empty — citizens report them.
const seedInitialData = async () => {
  const store = getMemoryStore();
  store.regions = [...sampleRegions];
  store.emergencyServices = [...sampleEmergencyServices];
  store.issues = []; // Start clean — no pre-populated issues

  if (getIsConnected()) {
    try {
      // Clear any previously seeded issues so the project starts fresh
      await Issue.deleteMany({});
      console.log('[CityTwin] Cleared old issues — starting fresh');

      const regionCount = await Region.countDocuments();
      if (regionCount === 0) {
        await Region.insertMany(sampleRegions);
        console.log('[CityTwin Seed] Seeded Thane district region boundaries');
      }

      const emergencyCount = await EmergencyService.countDocuments();
      if (emergencyCount === 0) {
        await EmergencyService.insertMany(sampleEmergencyServices);
        console.log('[CityTwin Seed] Seeded emergency services (hospitals, police, fire)');
      }
    } catch (err) {
      console.warn('[CityTwin Seed] Error seeding MongoDB:', err.message);
    }
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedInitialData();
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 CityTwin Backend API running on port ${PORT}`);
    console.log(`📍 API Base: http://localhost:${PORT}/api`);
    console.log(`🗺️  Map tiles: OpenStreetMap (free, no API key)`);
    console.log(`=================================================`);
  });
});
