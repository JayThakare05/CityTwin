const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  ambulanceNumber: { type: String, default: null },
  hospitalId: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Emergency', 'Offline', 'On Break'], default: 'Available' },
  location: {
    coordinates: { type: [Number], default: [72.9723, 19.2039] }
  },
  totalTrips: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Driver', driverSchema);
