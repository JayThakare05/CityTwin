const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  hospitalId: { type: String, required: true },
  driverName: { type: String, default: 'Unassigned' },
  driverId: { type: String, default: null },
  driverPhone: { type: String },
  status: { type: String, enum: ['Available', 'Emergency', 'Offline', 'Returning'], default: 'Available' },
  location: {
    coordinates: { type: [Number], default: [72.9723, 19.2039] } // [lng, lat]
  },
  currentDestination: {
    name: { type: String },
    coordinates: { type: [Number] }
  },
  eta: { type: String },
  distanceKm: { type: Number },
  greenCorridorActive: { type: Boolean, default: false },
  routeSignals: [{
    id: { type: String },
    name: { type: String },
    coordinates: { type: [Number] },
    status: { type: String, enum: ['RED', 'GREEN', 'YELLOW'], default: 'RED' },
    passed: { type: Boolean, default: false }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ambulance', ambulanceSchema);
