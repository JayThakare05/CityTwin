import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useState } from 'react'

const pin = (color) => L.divIcon({ className: '', html: `<div style="width:15px;height:15px;border:3px solid white;border-radius:50%;background:${color};box-shadow:0 2px 8px #55777788"></div>`, iconSize: [15, 15], iconAnchor: [7, 7] })
function FlyTo({ target }) { const map = useMap(); useEffect(() => { if (target) map.flyTo(target, 14, { duration: .8 }) }, [map, target]); return null }
function coordinates(location) {
  if (typeof location === 'string') {
    const match = location.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i)
    return match ? [Number(match[2]), Number(match[1])] : null
  }
  if (location?.coordinates?.length === 2) return [location.coordinates[1], location.coordinates[0]]
  return null
}

export default function CityMap({ layers, target, reports = [] }) {
  const [regions, setRegions] = useState([])
  const [environmentError, setEnvironmentError] = useState('')
  const activeMetric = layers.rainfall ? 'rainfall' : layers.aqi ? 'aqi' : layers.temperature ? 'temperature' : null
  useEffect(() => {
    if (!activeMetric) return
    let active = true
    setEnvironmentError('')
    fetch('/api/city/environment/regions').then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load regional readings.'))).then((data) => { if (active) setRegions(data.regions || []) }).catch((error) => { if (active) setEnvironmentError(error.message) })
    return () => { active = false }
  }, [activeMetric])
  const mappedReports = reports.map((report) => ({ ...report, position: coordinates(report.location) })).filter((report) => report.position)
  const palette = (value) => {
    if (activeMetric === 'rainfall') return value >= 8 ? '#dc2626' : value >= 4 ? '#f97316' : value >= 1 ? '#facc15' : '#38bdf8'
    if (activeMetric === 'aqi') return value > 150 ? '#dc2626' : value > 100 ? '#f97316' : value > 50 ? '#facc15' : '#22c55e'
    return value >= 35 ? '#dc2626' : value >= 31 ? '#f97316' : value >= 27 ? '#facc15' : '#38bdf8'
  }
  const readingValue = (region) => activeMetric === 'rainfall' ? region.rainfall_mm : activeMetric === 'aqi' ? region.aqi : region.temperature_c
  const metricLabel = activeMetric === 'rainfall' ? 'Rainfall, last hour' : activeMetric === 'aqi' ? 'AQI (US)' : 'Temperature'
  const formattedValue = (value) => activeMetric === 'rainfall' ? `${value} mm` : activeMetric === 'temperature' ? `${value} °C` : value
  return <MapContainer center={[19.195, 72.975]} zoom={13} zoomControl={false} className="rounded-[22px]"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{layers.traffic && <TileLayer attribution="Traffic flow &copy; TomTom" url="/api/city/traffic/flow/{z}/{x}/{y}.png" opacity={.82} zIndex={300}/>}<FlyTo target={target}/>{activeMetric && regions.map((region) => { const value = readingValue(region); const color = palette(value); return <CircleMarker key={region.id} center={[region.latitude, region.longitude]} radius={8} pathOptions={{ color: '#ffffff', weight: 2, fillColor: color, fillOpacity: .9 }}><Tooltip sticky direction="top"><b>{region.name}</b><br/>{metricLabel}: {formattedValue(value)}<br/>AQI: {region.aqi} · Rain: {region.rainfall_mm} mm · {region.temperature_c} °C</Tooltip><Popup><b>{region.name}</b><br/>{metricLabel}: {formattedValue(value)}<br/><small>Live OpenWeather reading · updated {new Date(region.recorded_at).toLocaleTimeString()}</small></Popup></CircleMarker> })}{activeMetric && <div className="leaflet-bottom leaflet-right"><div className="leaflet-control regional-legend"><strong>{metricLabel}</strong><span><i className="legend-dot low"/> Low</span><span><i className="legend-dot medium"/> Moderate</span><span><i className="legend-dot high"/> High</span></div></div>}{environmentError && <div className="leaflet-bottom leaflet-left"><div className="leaflet-control regional-error">{environmentError}</div></div>}{layers.issues && mappedReports.map((report) => <Marker key={report.id} position={report.position} icon={pin('#4baf88')}><Popup><b>{report.title}</b><br/>{report.category?.name || 'Citizen report'} · {report.status}</Popup></Marker>)}</MapContainer>
}
