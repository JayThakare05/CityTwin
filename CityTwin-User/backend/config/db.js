const mongoose = require('mongoose');

let isConnected = false;
let memoryStore = {
  users: [],
  issues: [],
  regions: [],
  emergencyServices: [],
  alerts: []
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citytwin';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[CityTwin DB] MongoDB Connected successfully to ${mongoURI}`);
  } catch (err) {
    console.warn(`[CityTwin DB] MongoDB local connection failed (${err.message}). Using hybrid Mongo/In-Memory fallback mode.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;
const getMemoryStore = () => memoryStore;

module.exports = { connectDB, getIsConnected, getMemoryStore };
