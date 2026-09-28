import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG Icons matching soft pastel color palette
const createCustomIcon = (color, emoji) => {
  const svg = `
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0C8.50659 0 0 8.50659 0 19C0 33.25 19 46 19 46C19 46 38 33.25 38 19C38 8.50659 29.4934 0 19 0Z" fill="${color}"/>
      <circle cx="19" cy="19" r="14" fill="#FFFFFF"/>
      <text x="19" y="24" font-size="14" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-marker-icon',
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -42]
  });
};

const userIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 28px; height: 28px;">
      <div style="position: absolute; inset: 0; background: rgba(121, 201, 192, 0.5); border-radius: 50%;" class="pulse-dot"></div>
      <div style="position: absolute; inset: 4px; background: #79C9C0; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.25);"></div>
    </div>
  `,
  className: 'custom-user-icon',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const targetIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 28px; height: 28px;">
      <div style="position: absolute; inset: 0; background: rgba(232, 139, 151, 0.5); border-radius: 50%;" class="pulse-dot"></div>
      <div style="position: absolute; inset: 4px; background: #E88B97; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.25);"></div>
    </div>
  `,
  className: 'custom-target-icon',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

// Category to Color & Emoji map
const categoryMeta = {
  'Disease / Pandemic': { color: '#E8B8D5', emoji: '🦟' },
  'Accident': { color: '#E88B97', emoji: '🚗' },
  'Garbage': { color: '#C7BCE8', emoji: '🗑️' },
  'Waterlogging': { color: '#79C9C0', emoji: '🌊' },
  'Air Pollution': { color: '#A8DCD3', emoji: '🌫️' },
  'Other': { color: '#A0A5B1', emoji: '📍' },
  'Hospital': { color: '#79C9C0', emoji: '🏥' },
  'Police': { color: '#C7BCE8', emoji: '🚔' },
  'Fire': { color: '#F6A88B', emoji: '🚒' }
};

const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

const CityMap = ({ 
  userLocation = [19.2183, 72.9781], 
  targetLocation = null,
  issues = [], 
  regions = [], 
  emergencyServices = [], 
  activeLayer = 'all', 
  onIssueSelect,
  onRegionSelect,
  onMapClick
}) => {
  
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };
  
  // Format GeoJSON coordinates for Leaflet Polygon [lat, lng]
  const formatPolygon = (coords) => {
    if (!coords || !coords[0]) return [];
    return coords[0].map(pt => [pt[1], pt[0]]);
  };

  const getRegionColor = (metrics) => {
    if (!metrics) return '#A8DCD3';
    if (activeLayer === 'aqi') {
      const aqi = metrics.aqi || 50;
      if (aqi <= 50) return '#A8DCD3';
      if (aqi <= 100) return '#FBE29D';
      if (aqi <= 150) return '#F6A88B';
      return '#E88B97';
    }
    if (activeLayer === 'pandemic') {
      return metrics.dengueRisk === 'High' ? '#E8B8D5' : '#A8DCD3';
    }
    if (activeLayer === 'flood') {
      return metrics.waterloggingRisk === 'High' || metrics.waterloggingRisk === 'Critical' ? '#79C9C0' : '#EAF7F8';
    }
    return '#79C9C0';
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={userLocation}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapController center={targetLocation || userLocation} />
        <MapEvents />

        {/* Clean OpenStreetMap Tile Layer - No Watermarks! */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Region Digital Twin City Boundaries for Thane District */}
        {regions.map((region) => {
          const positions = formatPolygon(region.boundary?.coordinates);
          if (positions.length === 0) return null;
          const fillColor = getRegionColor(region.metrics);

          return (
            <Polygon
              key={region.id || region.code}
              positions={positions}
              pathOptions={{
                color: '#79C9C0',
                weight: 2.5,
                dashArray: '5, 5',
                fillColor: fillColor,
                fillOpacity: 0.28
              }}
              eventHandlers={{
                click: () => onRegionSelect && onRegionSelect(region)
              }}
            >
              <Popup>
                <div style={{ padding: '6px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#252733' }}>{region.name}</div>
                  <div style={{ fontSize: '12px', color: '#777B86', marginTop: '2px' }}>Population: {region.population}</div>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#EAF7F8', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', color: '#79C9C0', fontWeight: 700 }}>
                      AQI {region.metrics?.aqi || 86}
                    </span>
                    <span style={{ background: '#F7EDF5', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', color: '#E8B8D5', fontWeight: 700 }}>
                      Dengue: {region.metrics?.dengueRisk || 'Low'}
                    </span>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Live User Location Pin */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div style={{ textAlign: 'center', padding: '4px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#252733' }}>You Are Here</div>
              <div style={{ fontSize: '11px', color: '#777B86' }}>Your GPS Location</div>
            </div>
          </Popup>
        </Marker>

        {/* Selected Target Location Pin */}
        {targetLocation && (
          <Marker position={targetLocation} icon={targetIcon}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#252733' }}>Selected Location</div>
                <div style={{ fontSize: '11px', color: '#777B86' }}>Weather & Map updated</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Issue Markers */}
        {issues.map((iss) => {
          const coords = iss.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          const [lng, lat] = coords;
          const meta = categoryMeta[iss.category] || categoryMeta['Other'];
          const icon = createCustomIcon(meta.color, meta.emoji);

          return (
            <Marker 
              key={iss.id || iss._id} 
              position={[lat, lng]} 
              icon={icon}
              eventHandlers={{
                click: () => onIssueSelect && onIssueSelect(iss)
              }}
            >
              <Popup>
                <div style={{ maxWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px' }}>{meta.emoji}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#252733' }}>{iss.title}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#777B86', margin: '4px 0' }}>{iss.description}</p>
                  <div style={{ fontSize: '10px', color: '#A0A5B1', marginTop: '6px' }}>{iss.distanceKm || 'Nearby'} • {iss.timeAgo || 'Just now'}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Emergency Services Markers (Hospitals/Police/Fire) */}
        {emergencyServices.map((service) => {
          const coords = service.location?.coordinates;
          if (!coords || coords.length < 2) return null;
          const [lng, lat] = coords;
          const meta = categoryMeta[service.type] || categoryMeta['Hospital'];
          const icon = createCustomIcon(meta.color, meta.emoji);

          return (
            <Marker key={service.id} position={[lat, lng]} icon={icon}>
              <Popup>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#252733' }}>{service.name}</div>
                  <div style={{ fontSize: '11px', color: '#79C9C0', fontWeight: 700, marginTop: '2px' }}>{service.status}</div>
                  <div style={{ fontSize: '11px', color: '#777B86', marginTop: '4px' }}>{service.address}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#252733', marginTop: '6px' }}>📞 {service.phone}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
};

export default CityMap;
