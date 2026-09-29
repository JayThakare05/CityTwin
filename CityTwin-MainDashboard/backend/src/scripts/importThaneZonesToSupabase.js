import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertConfiguration } from '../config.js'

assertConfiguration()
const { supabaseAdmin } = await import('../supabase.js')
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const geoJsonPath = resolve(scriptDirectory, '../../../frontend/public/thane-zones.geojson')
const zoneData = JSON.parse(await readFile(geoJsonPath, 'utf8'))

const zones = zoneData.features.map((feature) => ({
  name: feature.properties.name,
  slug: feature.properties.slug,
  boundary_geojson: feature.geometry,
  center_latitude: feature.properties.center_latitude,
  center_longitude: feature.properties.center_longitude,
  boundary_quality: feature.properties.boundary_quality,
}))

const { error } = await supabaseAdmin.from('city_zones').upsert(zones, { onConflict: 'slug' })
if (error) throw error
console.log(`Imported ${zones.length} Thane zones into Supabase.`)
