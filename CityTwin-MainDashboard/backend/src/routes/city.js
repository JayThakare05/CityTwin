import { Router } from 'express'
import { config } from '../config.js'
import { supabaseAdmin } from '../supabase.js'
import { getCurrentEnvironmentalReading, getRegionalEnvironmentalReadings } from '../services/openWeather.js'

const router = Router()

router.get('/overview', async (_request, response, next) => {
  try {
    const [reports, alerts, ambulances, environment] = await Promise.all([
      supabaseAdmin.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
      supabaseAdmin.from('alerts').select('*', { count: 'exact', head: true }).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`),
      supabaseAdmin.from('ambulances').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      getCurrentEnvironmentalReading(),
    ])
    for (const result of [reports, alerts, ambulances]) if (result.error) throw result.error
    response.json({ verified_reports: reports.count || 0, active_alerts: alerts.count || 0, available_ambulances: ambulances.count || 0, latest_aqi: environment.aqi, environment })
  } catch (error) { next(error) }
})

router.get('/alerts', async (_request, response, next) => {
  try {
    const { data, error } = await supabaseAdmin.from('alerts').select('*').order('created_at', { ascending: false }).limit(50)
    if (error) throw error
    response.json({ alerts: data })
  } catch (error) { next(error) }
})

router.get('/citizen-reports', async (request, response, next) => {
  try {
    const status = request.query.status || 'verified'
    const { data, error } = await supabaseAdmin.from('reports').select('id, title, description, severity, status, created_at, location, category:report_categories(name)').eq('status', status).order('created_at', { ascending: false }).limit(50)
    if (error) throw error
    response.json({ reports: data })
  } catch (error) { next(error) }
})

router.get('/environment/regions', async (_request, response, next) => {
  try {
    const regions = await getRegionalEnvironmentalReadings()
    response.json({ regions, source: 'OpenWeather', refresh_interval_minutes: 5 })
  } catch (error) { next(error) }
})

router.get('/traffic/flow/:z/:x/:y.png', async (request, response, next) => {
  try {
    if (!config.tomtomApiKey) return response.status(503).json({ error: 'Traffic data is not configured.' })
    const z = Number(request.params.z)
    const x = Number(request.params.x)
    const y = Number(request.params.y)
    const gridSize = 2 ** z
    if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || z < 0 || z > 22 || x < 0 || y < 0 || x >= gridSize || y >= gridSize) return response.status(400).json({ error: 'Invalid traffic-map tile coordinates.' })
    const upstream = await fetch(`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/${z}/${x}/${y}.png?key=${encodeURIComponent(config.tomtomApiKey)}`)
    if (!upstream.ok) return response.status(upstream.status).json({ error: 'Traffic data is temporarily unavailable.' })
    response.set({ 'Content-Type': upstream.headers.get('content-type') || 'image/png', 'Cache-Control': 'public, max-age=60' })
    response.send(Buffer.from(await upstream.arrayBuffer()))
  } catch (error) { next(error) }
})

export default router
