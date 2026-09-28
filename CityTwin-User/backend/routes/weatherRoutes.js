const express = require('express');
const router = express.Router();
const { sampleForecast } = require('../data/seedData');

// Get Weather & Forecast
router.get('/', async (req, res) => {
  const { lat = 19.2183, lon = 72.9781 } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    if (!apiKey) throw new Error('OpenWeather API Key missing');

    const [weatherRes, airRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    ]);

    const weatherData = await weatherRes.json();
    const airData = await airRes.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    const aqiVal = airData.list[0].components.pm2_5;
    const getAqiCategory = (val) => {
      if (val < 12) return 'Good';
      if (val < 35.4) return 'Moderate';
      if (val < 55.4) return 'Unhealthy for Sensitive Groups';
      if (val < 150.4) return 'Unhealthy';
      return 'Hazardous';
    };

    const current = {
      city: weatherData.name,
      temp: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      aqi: Math.round(aqiVal),
      aqiCategory: getAqiCategory(aqiVal),
      rainProb: weatherData.clouds.all, // Approximation
      humidity: weatherData.main.humidity,
      windKmH: Math.round(weatherData.wind.speed * 3.6),
      uvIndex: 4 // Requires OneCall API for real UV, stubbing for now
    };

    res.json({
      success: true,
      current,
      forecast: sampleForecast // Keep stub for now
    });
  } catch (error) {
    console.warn('Weather API Error:', error.message);
    // Fallback to sample data
    const current = {
      city: "Thane",
      temp: 28,
      condition: "Partly Cloudy",
      aqi: 86,
      aqiCategory: "Moderate",
      rainProb: 40,
      humidity: 72,
      windKmH: 14,
      uvIndex: 4
    };
    res.json({ success: true, current, forecast: sampleForecast });
  }
});

module.exports = router;
