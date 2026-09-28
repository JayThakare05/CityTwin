const mongoose = require('mongoose');

const emergencyServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['Hospital', 'Police', 'Fire'], required: true },
  location: {
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: { type: String },
  phone: { type: String },
  availableBeds: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 0 },
  status: { type: String }
});

module.exports = mongoose.model('EmergencyService', emergencyServiceSchema);
