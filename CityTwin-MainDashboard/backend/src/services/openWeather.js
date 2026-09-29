import { config } from '../config.js'

const CACHE_DURATION_MS = 5 * 60 * 1000
let cachedReading = null
let cacheExpiresAt = 0

function calculateUsAqi(pm25) {
  const concentration = Number(pm25)
  if (!Number.isFinite(concentration) || concentration < 0) return null
  const bands = [
    [0, 12, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300], [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500],
  ]
  const [lowConcentration, highConcentration, lowAqi, highAqi] = bands.find(([, high]) => concentration <= high) || bands.at(-1)
  return Math.round(((highAqi - lowAqi) / (highConcentration - lowConcentration)) * (concentration - lowConcentration) + lowAqi)
}

async function fetchOpenWeather(path, coordinates = {}) {
  const params = new URLSearchParams({
    lat: String(coordinates.latitude ?? config.cityLatitude),
    lon: String(coordinates.longitude ?? config.cityLongitude),
    appid: config.openWeatherApiKey,
  })
  const response = await fetch(`https://api.openweathermap.org/data/2.5/${path}?${params}`)
  if (!response.ok) throw new Error(`OpenWeather request failed (${response.status}).`)
  return response.json()
}

export async function getCurrentEnvironmentalReading() {
  if (cachedReading && Date.now() < cacheExpiresAt) return cachedReading
  const [airPollution, weather] = await Promise.all([fetchOpenWeather('air_pollution'), fetchOpenWeather('weather')])
  const air = airPollution.list?.[0]
  if (!air) throw new Error('OpenWeather did not return an air-quality reading.')

  cachedReading = {
    aqi: calculateUsAqi(air.components?.pm2_5),
    pm25: air.components?.pm2_5 ?? null,
    openweather_aqi_index: air.main?.aqi ?? null,
    rainfall_mm: weather.rain?.['1h'] ?? 0,
    rainfall_period: weather.rain?.['1h'] !== undefined ? 'last hour' : 'last hour (none reported)',
    temperature_c: weather.main?.temp === undefined ? null : Number((weather.main.temp - 273.15).toFixed(1)),
    recorded_at: new Date((weather.dt || air.dt) * 1000).toISOString(),
  }
  cacheExpiresAt = Date.now() + CACHE_DURATION_MS
  return cachedReading
}

const regionalCache = new Map()
const REGIONAL_CACHE_DURATION_MS = 5 * 60 * 1000
// Named localities keep the live readings meaningful and avoid a visual grid
// that obscures the underlying city map.
const REGIONAL_LOCATIONS = [
  ['Hiranandani Estate', 19.25493, 72.98207], ['Kasarvadavali', 19.27042, 72.96908],
  ['Waghbil', 19.26597, 72.98477], ['Patlipada', 19.24935, 72.97607],
  ['Brahmand', 19.24696, 72.98184], ['Manpada', 19.23142, 72.97382],
  ['Kolshet Road', 19.23272, 72.98742], ['Dhokali', 19.22558, 72.98454],
  ['Balkum', 19.22055, 72.98793], ['Majiwada', 19.21303, 72.97849],
  ['Vartak Nagar', 19.21554, 72.96271], ['Vasant Vihar', 19.22249, 72.96634],
  ['Pokhran Road', 19.20666, 72.96580], ['Kapur Bawdi', 19.21748, 72.97900],
  ['Charai', 19.19757, 72.97528], ['Naupada', 19.18969, 72.96968],
  ['Khopat', 19.20343, 72.97187], ['Uthalsar', 19.20214, 72.97623],
  ['Jambli Naka', 19.19258, 72.97796], ['Louis Wadi', 19.19630, 72.96232],
  ['Wagle Industrial Estate', 19.19852, 72.95098], ['Savarkar Nagar', 19.20635, 72.95207],
  ['Shree Nagar', 19.19045, 72.94583], ['Kopri', 19.18259, 72.97326],
  ['Kalwa', 19.19522, 72.99633],
].map(([name, latitude, longitude], index) => ({ id: `region-${index + 1}`, name, latitude, longitude }))

async function getRegionalReading(region) {
  const cached = regionalCache.get(region.id)
  if (cached && Date.now() < cached.expiresAt) return cached.reading
  const [airPollution, weather] = await Promise.all([
    fetchOpenWeather('air_pollution', region),
    fetchOpenWeather('weather', region),
  ])
  const air = airPollution.list?.[0]
  if (!air) throw new Error(`OpenWeather did not return air-quality data for ${region.name}.`)
  const reading = {
    ...region,
    aqi: calculateUsAqi(air.components?.pm2_5),
    pm25: air.components?.pm2_5 ?? null,
    rainfall_mm: weather.rain?.['1h'] ?? 0,
    temperature_c: weather.main?.temp === undefined ? null : Number((weather.main.temp - 273.15).toFixed(1)),
    recorded_at: new Date((weather.dt || air.dt) * 1000).toISOString(),
  }
  regionalCache.set(region.id, { reading, expiresAt: Date.now() + REGIONAL_CACHE_DURATION_MS })
  return reading
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = []
  let cursor = 0
  const worker = async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await mapper(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

export async function getRegionalEnvironmentalReadings() {
  // 25 regions × two endpoints remains within OpenWeather's common free-tier
  // per-minute limit; the five-minute cache avoids duplicate live requests.
  return mapWithConcurrency(REGIONAL_LOCATIONS, 3, getRegionalReading)
}
