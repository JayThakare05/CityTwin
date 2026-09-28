const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getIsConnected, getMemoryStore } = require('./config/db');
const {
  sampleHospitals,
  sampleAmbulances,
  sampleDrivers,
  sampleMedicalCamps,
  sampleAccidentAlerts,
  samplePandemicRisks,
  sampleTrafficSignals
} = require('./data/seedData');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ambulances', require('./routes/ambulanceRoutes'));
app.use('/api/camps', require('./routes/campRoutes'));
app.use('/api/accidents', require('./routes/accidentRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'CityTwin Hospital Portal API',
    mongoConnected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

// Seed data into memory store
const seedInitialData = (includeOperational = true) => {
  const store = getMemoryStore();
  store.hospitals = [...sampleHospitals];
  store.drivers = [...sampleDrivers];
  store.trafficSignals = [...sampleTrafficSignals];

  if (includeOperational && process.env.SEED_MOCK !== 'false') {
    store.ambulances = [...sampleAmbulances];
    store.medicalCamps = [...sampleMedicalCamps];
    store.accidentAlerts = [...sampleAccidentAlerts];
    store.pandemicRisks = [...samplePandemicRisks];
    console.log('[CityTwin Hospital] Seeded all operational data into memory store');
  } else {
    store.ambulances = [];
    store.medicalCamps = [];
    store.accidentAlerts = [];
    store.pandemicRisks = [];
    console.log('[CityTwin Hospital] Initialized with empty database operational state');
  }
};

// Admin routes for toggling empty DB state vs seeded DB state
app.post('/api/admin/clear-data', (req, res) => {
  seedInitialData(false);
  res.json({ success: true, message: 'All operational data cleared (Empty DB state active)' });
});

app.post('/api/admin/seed-data', (req, res) => {
  seedInitialData(true);
  res.json({ success: true, message: 'Operational mock data seeded successfully' });
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  seedInitialData(false);
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🏥 CityTwin Hospital Portal API on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🚑 Ambulance API: http://localhost:${PORT}/api/ambulances`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/stats`);
    console.log(`=================================================`);
  });
});

