const mongoose = require('mongoose');

const accidentAlertSchema = new mongoose.Schema({
  title: { type: String, default: 'Accident Detected' },
  location: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true }
  },
  severity: { type: String, enum: ['Minor', 'Moderate', 'Severe', 'Critical'], default: 'Moderate' },
  distanceKm: { type: String },
  reportedBy: { type: String, default: 'Citizen Report' },
  description: { type: String },
  status: { type: String, enum: ['New', 'Acknowledged', 'Dispatched', 'Resolved'], default: 'New' },
  dispatchedAmbulance: { type: String, default: null },
  nearestHospitalId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AccidentAlert', accidentAlertSchema);
