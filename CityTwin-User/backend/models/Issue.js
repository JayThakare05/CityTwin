const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Disease / Pandemic', 'Accident', 'Garbage', 'Waterlogging', 'Air Pollution', 'Other'],
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Resolved'], 
    default: 'Pending' 
  },
  description: { type: String },
  location: {
    address: { type: String },
    regionName: { type: String, default: 'Thane City (TMC)' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  distanceKm: { type: String, default: 'Nearby' },
  timeAgo: { type: String, default: 'Just now' },
  imageUrl: { type: String },
  reporterName: { type: String, default: 'Anonymous Citizen' },
  reporterId: { type: String },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', issueSchema);
