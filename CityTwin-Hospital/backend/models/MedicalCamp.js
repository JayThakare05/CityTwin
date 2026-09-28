const mongoose = require('mongoose');

const medicalCampSchema = new mongoose.Schema({
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true }
  },
  disease: { type: String, required: true },
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], required: true },
  detectedCases: { type: Number, default: 0 },
  requiredDoctors: { type: Number, default: 1 },
  requiredNurses: { type: Number, default: 2 },
  ambulanceRequired: { type: Boolean, default: false },
  preferredDate: { type: String },
  additionalRequirements: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Scheduled', 'Completed', 'Rejected'], default: 'Pending' },
  regionName: { type: String, default: 'Thane City (TMC)' },
  distanceKm: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalCamp', medicalCampSchema);
