import React, { useState } from 'react';
import { X, Layers, Check, Info, AlertTriangle, Wind, Thermometer, Droplets } from 'lucide-react';
import CityMap from './CityMap';
import PandemicHotspotsCard from './PandemicHotspotsCard';
import AQIMapCard from './AQIMapCard';

const RegionMapModal = ({ onClose, regions = [], issues = [], emergencyServices = [] }) => {
  const [activeLayer, setActiveLayer] = useState('all');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regions[0] || null);

  const layers = [
    { id: 'all', label: 'All Digital Twin Layers', icon: '🌐' },
    { id: 'weather', label: 'Weather & Microclimate', icon: '🌦️' },
    { id: 'aqi', label: 'AQI Heatmap', icon: '🌫️' },
    { id: 'pandemic', label: 'Pandemic Hotspots', icon: '🦟' },
    { id: 'flood', label: 'Flood / Waterlogging', icon: '🌊' },
    { id: 'issues', label: 'Citizen Issues', icon: '📢' }
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 4000,
      background: '#E8F5F6',
      display: 'flex',
      flexDirection: 'column'
    }} className="animate-fade-in">

      {/* Top Floating Bar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div className="glass-card" style={{
          padding: '10px 18px',
          borderRadius: '20px',
          pointerEvents: 'auto'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#79C9C0', textTransform: 'uppercase' }}>
            REGIONAL DIGITAL TWIN
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#252733' }}>
            Explore Your Region (Thane District)
          </h2>
        </div>

        <button className="btn-icon" onClick={onClose} style={{ pointerEvents: 'auto' }}>
          <X size={20} />
        </button>
      </div>

      {/* Main Interactive Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <CityMap
          userLocation={[19.2183, 72.9781]}
          issues={activeLayer === 'issues' || activeLayer === 'all' ? issues : []}
          regions={regions}
          emergencyServices={emergencyServices}
          activeLayer={activeLayer}
          onRegionSelect={(r) => setSelectedRegion(r)}
        />
      </div>

      {/* Floating Layers Button */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '16px',
        zIndex: 200
      }}>
        <button
          onClick={() => setShowLayerMenu(!showLayerMenu)}
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(37, 39, 51, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#252733',
            cursor: 'pointer'
          }}
        >
          <Layers size={18} color="#79C9C0" />
          Layers
        </button>

        {/* Layer Selector Dropdown */}
        {showLayerMenu && (
          <div className="glass-panel animate-fade-in" style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            width: '230px',
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '10px',
            boxShadow: '0 12px 32px rgba(37, 39, 51, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#777B86', padding: '6px 10px' }}>
              TOGGLE HEATMAP LAYERS
            </div>
            {layers.map((lyr) => (
              <button
                key={lyr.id}
                onClick={() => {
                  setActiveLayer(lyr.id);
                  setShowLayerMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeLayer === lyr.id ? '#EAF7F8' : 'transparent',
                  color: activeLayer === lyr.id ? '#79C9C0' : '#252733',
                  fontWeight: activeLayer === lyr.id ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <span>{lyr.icon} {lyr.label}</span>
                {activeLayer === lyr.id && <Check size={14} color="#79C9C0" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contextual Hotspot Details Cards based on active layer */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '16px',
        right: '16px',
        zIndex: 200,
        pointerEvents: 'auto'
      }}>
        {activeLayer === 'pandemic' ? (
          <PandemicHotspotsCard region={selectedRegion || regions[0]} />
        ) : activeLayer === 'aqi' ? (
          <AQIMapCard region={selectedRegion || regions[0]} />
        ) : (
          /* Default Thane District Region Summary */
          <div className="glass-panel" style={{
            borderRadius: '24px',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.94)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#79C9C0', fontWeight: 700, textTransform: 'uppercase' }}>
                  SELECTED CITY ZONE
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
                  {selectedRegion ? selectedRegion.name : 'Thane City (TMC)'}
                </h3>
              </div>

              <span style={{
                background: '#EAF7F8',
                color: '#79C9C0',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700
              }}>
                Pop: {selectedRegion?.population || '1.8M'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
              <div style={{ background: '#EAF7F8', padding: '8px 10px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#777B86' }}>AQI Level</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
                  {selectedRegion?.metrics?.aqi || 86}
                </div>
              </div>

              <div style={{ background: '#F7EDF5', padding: '8px 10px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#777B86' }}>Dengue Risk</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8B8D5', marginTop: '2px' }}>
                  {selectedRegion?.metrics?.dengueRisk || 'High'}
                </div>
              </div>

              <div style={{ background: '#FEF8E7', padding: '8px 10px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#777B86' }}>Waterlogging</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#E8B869', marginTop: '2px' }}>
                  {selectedRegion?.metrics?.waterloggingRisk || 'Moderate'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default RegionMapModal;
