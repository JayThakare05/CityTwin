/*
 * One-time seed generator for the supplied Thane locality names.
 * Results are cached in frontend/public/thane-zones.geojson. The public
 * Nominatim service is queried sequentially, no faster than one request/sec.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const outputPath = resolve(scriptDirectory, '../../../frontend/public/thane-zones.geojson')
const maximumLookups = Number(process.argv[2] || 10)
const retryUnresolved = process.argv.includes('--retry-unresolved')
const lookupNames = {
  'Kapur Bawdi': 'Kapurbawdi', 'Panch Pakhadi': 'Panch Pakhadi Thane West', 'Bhayanderpada': 'Bhayandarpada',
  'JK Gram': 'J K Gram', 'Desai Village': 'Desai Village Thane', 'Anu Nagar': 'Anand Nagar Thane', 'Mogarpada': 'Mogharpada',
}
const names = [
  'Ghodbunder Road', 'Thane West', 'Kolshet Road', 'Majiwada', 'Thane East', 'Shilphata', 'Hiranandani Estate', 'Balkum',
  'Manpada', 'Kalwa', 'Kasarvadavali', 'Dhokali', 'Kapur Bawdi', 'Diva', 'Patlipada', 'Vartak Nagar',
  'Vasant Vihar', 'Pokhran Road No. 1', 'Mumbra', 'Charai', 'Waghbil', 'Eastern Express Highway', 'Naupada', 'Pokhran Road No. 2',
  'Khopat', 'Wagle Industrial Estate', 'Shree Nagar', 'Panch Pakhadi', 'Bhayanderpada', 'Kopri', 'Kasheli', 'Anand Nagar',
  'Teen Hath Naka', 'Khidkali', 'Brahmand', 'Louis Wadi', 'Lal Bahadur Shastri Road', 'Uthalsar', 'Owale', 'JK Gram',
  'Ghodbandar', 'Savarkar Nagar', 'Vishnu Nagar', 'Daighar Gaon', 'Desai Village', 'Khardipada', 'Anu Nagar', 'Azad Nagar',
  'Jambli Naka', 'Usarghar Gaon', 'Mogarpada', 'Talav Pali', 'Padle Gaon',
]

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function fallbackPolygon(longitude, latitude, delta = 0.0035) {
  return { type: 'Polygon', coordinates: [[[longitude - delta, latitude - delta], [longitude + delta, latitude - delta], [longitude + delta, latitude + delta], [longitude - delta, latitude + delta], [longitude - delta, latitude - delta]]] }
}

function geometryFor(result) {
  if (result.geojson?.type === 'Polygon' || result.geojson?.type === 'MultiPolygon') return { geometry: result.geojson, quality: 'approximate' }
  const [south, north, west, east] = (result.boundingbox || []).map(Number)
  if ([south, north, west, east].every(Number.isFinite)) {
    return { geometry: { type: 'Polygon', coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]] }, quality: 'approximate' }
  }
  return { geometry: fallbackPolygon(Number(result.lon), Number(result.lat)), quality: 'approximate' }
}

let existing = { type: 'FeatureCollection', attribution: '© OpenStreetMap contributors', features: [], unresolved: [] }
try { existing = JSON.parse(await readFile(outputPath, 'utf8')) } catch { /* First run. */ }
const featuresBySlug = new Map(existing.features.map((feature) => [feature.properties.slug, feature]))
const unresolved = new Set(existing.unresolved || [])
const persist = () => writeFile(outputPath, `${JSON.stringify({ type: 'FeatureCollection', attribution: '© OpenStreetMap contributors', features: [...featuresBySlug.values()], unresolved: [...unresolved] }, null, 2)}\n`)
let lookups = 0

for (const name of names) {
  const slug = slugify(name)
  if (featuresBySlug.has(slug) || (unresolved.has(slug) && !retryUnresolved)) continue
  if (lookups >= maximumLookups) break
  lookups += 1
  unresolved.delete(slug)
  const query = new URLSearchParams({ q: `${lookupNames[name] || name}, Thane, Maharashtra, India`, format: 'jsonv2', polygon_geojson: '1', limit: '1' })
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, { headers: { 'User-Agent': 'CityTwin zone-seed/1.0 (one-time administrative setup)' } })
  if (!response.ok) throw new Error(`Could not geocode ${name}: ${response.status}`)
  const [result] = await response.json()
  if (!result) {
    console.warn(`No result for ${name}; add its boundary manually.`)
    unresolved.add(slug)
  } else {
    const { geometry, quality } = geometryFor(result)
    featuresBySlug.set(slug, { type: 'Feature', geometry, properties: { name, slug, center_latitude: Number(result.lat), center_longitude: Number(result.lon), boundary_quality: quality, source: 'OpenStreetMap/Nominatim' } })
  }
  await mkdir(dirname(outputPath), { recursive: true })
  await persist()
  await sleep(1100)
}

await mkdir(dirname(outputPath), { recursive: true })
await persist()
console.log(`Saved ${featuresBySlug.size} approximate Thane zones (${unresolved.size} unresolved) to ${outputPath}`)
