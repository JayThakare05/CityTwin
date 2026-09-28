import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ambulanceIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🚑</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const hospitalIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🏥</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const signalGreenIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size:20px">🟢</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const signalRedIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size:20px">🔴</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const accidentIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">🚨</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const riskIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="font-size:22px">⚠️</div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export default function CityMap({
  center = [19.2039, 72.9723],
  zoom = 13,
  ambulances = [],
  hospitals = [],
  signals = [],
  accidents = [],
  risks = [],
  routePath = [],
  className = '',
  style = {},
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLineRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    // Ambulances
    ambulances.forEach(amb => {
      if (!amb.location?.coordinates) return;
      const [lng, lat] = amb.location.coordinates;
      const marker = L.marker([lat, lng], { icon: ambulanceIcon })
        .bindPopup(`<b>🚑 ${amb.vehicleNumber}</b><br/>${amb.driverName}<br/>Status: ${amb.status}`)
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Hospitals
    hospitals.forEach(h => {
      if (!h.location?.coordinates) return;
      const [lng, lat] = h.location.coordinates;
      const marker = L.marker([lat, lng], { icon: hospitalIcon })
        .bindPopup(`<b>🏥 ${h.name}</b><br/>${h.address || ''}`)
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Traffic signals
    signals.forEach(sig => {
      if (!sig.coordinates) return;
      const [lng, lat] = sig.coordinates;
      const icon = sig.status === 'GREEN' ? signalGreenIcon : signalRedIcon;
      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`<b>🚦 ${sig.name}</b><br/>Status: ${sig.status}`)
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Accidents
    accidents.forEach(acc => {
      if (!acc.location?.coordinates) return;
      const [lng, lat] = acc.location.coordinates;
      const marker = L.marker([lat, lng], { icon: accidentIcon })
        .bindPopup(`<b>🚨 ${acc.title}</b><br/>${acc.location.address}<br/>Severity: ${acc.severity}`)
        .addTo(map);
      markersRef.current.push(marker);
    });

    // Risk areas
    risks.forEach(r => {
      if (!r.coordinates) return;
      const [lng, lat] = r.coordinates;
      const marker = L.marker([lat, lng], { icon: riskIcon })
        .bindPopup(`<b>⚠️ ${r.disease} Risk</b><br/>${r.location}<br/>Level: ${r.riskLevel}`)
        .addTo(map);

      // Add risk circle
      const color = r.riskLevel === 'High' ? '#E89A9A' : r.riskLevel === 'Moderate' ? '#E8C87B' : '#7BC89A';
      const circle = L.circle([lat, lng], {
        radius: 800,
        color,
        fillColor: color,
        fillOpacity: 0.1,
        weight: 1.5,
      }).addTo(map);

      markersRef.current.push(marker, circle);
    });

    // Route path
    if (routePath.length > 1) {
      const latlngs = routePath.map(([lng, lat]) => [lat, lng]);
      routeLineRef.current = L.polyline(latlngs, {
        color: '#6FC4BC',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
      }).addTo(map);
    }

  }, [ambulances, hospitals, signals, accidents, risks, routePath]);

  return (
    <div
      ref={mapRef}
      className={`map-container ${className}`}
      style={style}
    />
  );
}
