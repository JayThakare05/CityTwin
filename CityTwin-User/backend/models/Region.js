const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  center: { type: [Number], required: true }, // [lat, lng]
  areaSqKm: { type: Number },
  population: { type: String },
  boundary: {
    type: { type: String, default: 'Polygon' },
    coordinates: [[[Number]]]
  },
  metrics: {
    aqi: { type: Number },
    aqiCategory: { type: String },
    temp: { type: Number },
    humidity: { type: Number },
    rainProb: { type: Number },
    dengueRisk: { type: String },
    dengueCases: { type: Number },
    dengueTrend: { type: String },
    malariaRisk: { type: String },
    waterloggingRisk: { type: String },
    trafficCongestion: { type: String },
    airQualityStatus: { type: String }
  },
  activeAlerts: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('Region', regionSchema);
