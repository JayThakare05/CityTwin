import React, { useState, useRef } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, MapPin, CheckCircle, 
  Camera, Upload, Trash2, RefreshCw, Navigation, Search 
} from 'lucide-react';
import { apiClient } from '../api/apiClient';

const DEFAULT_ACCIDENT_IMAGE = 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80';

const AccidentReportModal = ({ onClose, onSubmitAccidentReport }) => {
  const [severity, setSeverity] = useState('Critical');
  const [description, setDescription] = useState('Two vehicle accident near Nitin Company junction on EEH. Medical assistance required.');
  const [locationAddress, setLocationAddress] = useState('EEH Nitin Junction, Thane West');
  const [coords, setCoords] = useState([72.9698, 19.1990]); // [lng, lat]
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Photo state
  const [imagePreview, setImagePreview] = useState(DEFAULT_ACCIDENT_IMAGE);
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const fileInputRef = useRef(null);

  // Location search state
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const locationDebounceTimer = useRef(null);

  const severities = [
    { level: 'Low', color: '#A8DCD3' },
    { level: 'Medium', color: '#FBE29D' },
    { level: 'High', color: '#F6A88B' },
    { level: 'Critical', color: '#E88B97' }
  ];

  // --- Photo handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsCustomUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPhoto = () => {
    setIsCustomUpload(false);
    setImagePreview(DEFAULT_ACCIDENT_IMAGE);
  };

  const handleRemovePhoto = () => {
    setImagePreview('');
    setIsCustomUpload(true);
  };

  // --- Location handlers ---
  const handleLocationQueryChange = (val) => {
    setLocationQuery(val);
    if (locationDebounceTimer.current) clearTimeout(locationDebounceTimer.current);
    if (!val || val.trim().length < 2) {
      setLocationSuggestions([]);
      return;
    }
    locationDebounceTimer.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const res = await apiClient.searchLocation(val, coords[1], coords[0]);
        if (res?.success && res.results) setLocationSuggestions(res.results);
      } catch (err) {
        console.warn('TomTom search error:', err);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 280);
  };

  const handleSelectSuggestion = (sug) => {
    setLocationAddress(sug.address);
    setCoords(sug.coordinates);
    setShowLocationSearch(false);
    setLocationSuggestions([]);
    setLocationQuery('');
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords([lon, lat]);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (data?.display_name) {
              setLocationAddress(data.display_name.split(',').slice(0, 3).join(','));
            } else {
              setLocationAddress(`GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
            }
          } catch {
            setLocationAddress(`GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
          }
          setShowLocationSearch(false);
        },
        () => {}
      );
    }
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const accidentData = {
      title: '🚨 Emergency Accident Reported',
      category: 'Accident',
      severity,
      description,
      location: {
        address: locationAddress,
        regionName: 'Thane City (TMC)',
        coordinates: coords
      },
      imageUrl: imagePreview || DEFAULT_ACCIDENT_IMAGE,
      image: imagePreview || DEFAULT_ACCIDENT_IMAGE
    };

    await onSubmitAccidentReport(accidentData);
    setIsSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 4000,
      background: 'rgba(37, 39, 51, 0.45)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }} className="animate-fade-in">

      <div className="glass-panel animate-slide-up" style={{
        background: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '24px 20px 32px',
        maxHeight: '92vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: '#FFF5F6',
              color: '#E88B97',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#252733' }}>
                Accident Emergency Report
              </h2>
              <p style={{ fontSize: '11px', color: '#777B86' }}>
                Dispatches alerts to nearby Thane hospitals &amp; police.
              </p>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFF5F6',
              color: '#E88B97',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#252733' }}>Emergency Alert Dispatched!</h3>
            <p style={{ fontSize: '12px', color: '#777B86', marginTop: '6px' }}>
              Showing nearby emergency hospitals &amp; response units on map...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* 1. Photo Upload */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  Accident Scene Photo
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isCustomUpload && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      title="Reset to default photo"
                      style={{
                        background: 'none', border: 'none', color: '#777B86',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '3px'
                      }}
                    >
                      <RefreshCw size={12} /> Default
                    </button>
                  )}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{
                        background: 'none', border: 'none', color: '#E88B97',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '3px'
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'none', border: 'none', color: '#79C9C0',
                      fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Upload size={12} /> Choose Photo
                  </button>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div style={{
                height: '130px',
                borderRadius: '18px',
                border: '2px dashed #E8B8D5',
                background: '#FFF5F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Accident Scene"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span>🚗 Accident Scene</span>
                      {isCustomUpload ? (
                        <span style={{ background: '#79C9C0', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>Custom Upload</span>
                      ) : (
                        <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>Default Scene</span>
                      )}
                    </div>
                    {/* Change button overlay */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: '#FFFFFF',
                        color: '#252733',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      <Camera size={12} color="#E88B97" /> Change
                    </button>
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{ textAlign: 'center', color: '#E88B97', cursor: 'pointer', padding: '20px' }}
                  >
                    <Camera size={28} style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Upload Accident Scene Photo</div>
                    <div style={{ fontSize: '11px', color: '#777B86', marginTop: '2px' }}>Tap to select an image from your device</div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Location with TomTom search */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  Accident Location
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  style={{
                    background: 'none', border: 'none', color: '#79C9C0',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <Navigation size={12} /> Use GPS
                </button>
              </div>

              <div style={{
                background: '#FFF5F6',
                border: '1px solid rgba(232, 139, 151, 0.35)',
                padding: '12px 14px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: '#FFFFFF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <MapPin size={18} color="#E88B97" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 600 }}>ACCIDENT LOCATION</div>
                    <div style={{ fontSize: '13px', color: '#252733', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {locationAddress}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocationSearch(!showLocationSearch)}
                  style={{
                    background: '#FFFFFF', border: '1px solid #E8B8D5',
                    borderRadius: '12px', padding: '6px 12px',
                    fontSize: '11px', color: '#E88B97', fontWeight: 700,
                    cursor: 'pointer', flexShrink: 0
                  }}
                >
                  {showLocationSearch ? 'Done' : 'Search / Change'}
                </button>
              </div>

              {/* TomTom Search */}
              {showLocationSearch && (
                <div style={{
                  marginTop: '8px', background: '#FFFFFF', borderRadius: '16px',
                  border: '1px solid #E2E8F0', padding: '10px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                }} className="animate-fade-in">
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#F8FAFC', borderRadius: '12px',
                    padding: '8px 12px', border: '1px solid #E2E8F0'
                  }}>
                    <Search size={16} color="#E88B97" />
                    <input
                      type="text"
                      autoFocus
                      value={locationQuery}
                      onChange={(e) => handleLocationQueryChange(e.target.value)}
                      placeholder="Search accident location (road, junction, landmark)..."
                      style={{
                        width: '100%', border: 'none', outline: 'none',
                        background: 'transparent', fontSize: '13px', color: '#252733'
                      }}
                    />
                    {isSearchingLocation && (
                      <span style={{ fontSize: '11px', color: '#E88B97' }}>Searching...</span>
                    )}
                  </div>

                  {locationSuggestions.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', padding: '4px 6px' }}>
                        TOMTOM LOCATION RECOMMENDATIONS
                      </div>
                      {locationSuggestions.map((sug) => (
                        <div
                          key={sug.id || sug.address}
                          onClick={() => handleSelectSuggestion(sug)}
                          style={{
                            padding: '8px 10px', borderRadius: '10px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            gap: '8px', background: '#FFFFFF', transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FFF5F6'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                        >
                          <MapPin size={14} color="#E88B97" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#252733', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sug.name}
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {sug.address}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {locationQuery.length >= 2 && !isSearchingLocation && locationSuggestions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '12px', fontSize: '12px', color: '#94A3B8' }}>
                      No locations found. Try a road, junction or landmark name.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Severity Level Picker */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Accident Severity Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {severities.map((item) => {
                  const isSelected = severity === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => setSeverity(item.level)}
                      style={{
                        padding: '10px 4px', borderRadius: '14px',
                        border: isSelected ? `2px solid ${item.color}` : '1px solid #F0F2F5',
                        background: isSelected ? `${item.color}25` : '#FAFAFA',
                        color: isSelected ? '#252733' : '#777B86',
                        fontWeight: 700, fontSize: '12px', cursor: 'pointer'
                      }}
                    >
                      {item.level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Description */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Description / Vehicles Involved
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{
                  width: '100%', borderRadius: '14px',
                  border: '1px solid #F0F2F5', padding: '10px 12px',
                  fontSize: '13px', outline: 'none', resize: 'none', background: '#FAFAFA'
                }}
              />
            </div>

            {/* 5. Submit Emergency Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #E88B97 0%, #F6A88B 100%)',
                color: '#FFFFFF', border: 'none', borderRadius: '9999px',
                padding: '16px', fontWeight: 700, fontSize: '15px',
                cursor: 'pointer', boxShadow: '0 8px 20px rgba(232, 139, 151, 0.4)',
                marginTop: '4px'
              }}
            >
              {isSubmitting ? 'Dispatching Emergency Alert...' : '🚨 Submit Emergency Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default AccidentReportModal;
