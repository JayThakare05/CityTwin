const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  location: {
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  availableBeds: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 0 },
  icuBeds: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Full', 'Emergency Only'], default: 'Active' },
  specializations: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
