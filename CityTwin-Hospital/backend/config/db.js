const mongoose = require('mongoose');

let isConnected = false;
let memoryStore = {
  hospitals: [],
  ambulances: [],
  drivers: [],
  medicalCamps: [],
  accidentAlerts: [],
  emergencies: [],
  trafficSignals: [],
  // Shared with CityTwin-User
  issues: [],
  regions: [],
  emergencyServices: []
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citytwin';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[CityTwin Hospital DB] MongoDB Connected to ${mongoURI}`);
  } catch (err) {
    console.warn(`[CityTwin Hospital DB] MongoDB connection failed (${err.message}). Using in-memory fallback.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;
const getMemoryStore = () => memoryStore;

module.exports = { connectDB, getIsConnected, getMemoryStore };
