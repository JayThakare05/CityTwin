import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, MapPin, CheckCircle, Upload, Search, 
  Trash2, RefreshCw, Navigation, AlertCircle 
} from 'lucide-react';
import { apiClient } from '../api/apiClient';

// Category-specific presets and default imagery
const categoryPresets = {
  'Traffic': {
    emoji: '🚦',
    color: '#FBE29D',
    defaultImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Describe traffic congestion, stalled vehicles, or blocked lanes...'
  },
  'Waterlogging': {
    emoji: '🌊',
    color: '#79C9C0',
    defaultImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Water depth, flooded streets, blocked drains, or impassable road...'
  },
  'Garbage': {
    emoji: '🗑️',
    color: '#C7BCE8',
    defaultImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Overflowing dumpsters, plastic waste accumulation, or uncollected garbage...'
  },
  'Accident': {
    emoji: '🚗',
    color: '#E88B97',
    isEmergency: true,
    defaultImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Vehicles involved, injuries, lane blockage, or emergency response needed...'
  },
  'Pandemic': {
    emoji: '🦟',
    color: '#E8B8D5',
    defaultImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Mosquito breeding, stagnant open gutters, or health risk observed...'
  },
  'Pollution': {
    emoji: '🌫️',
    color: '#A8DCD3',
    defaultImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Industrial smoke, construction dust, burning waste, or foul odor...'
  },
  'Hospital': {
    emoji: '🏥',
    color: '#79C9C0',
    defaultImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Hospital access issue, emergency queue, or medical requirement...'
  },
  'Disaster': {
    emoji: '⚡',
    color: '#F6A88B',
    defaultImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Tree collapse, structural damage, electric wire hazard...'
  },
  'Other': {
    emoji: '📍',
    color: '#A0A5B1',
    defaultImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80',
    descriptionPlaceholder: 'Describe the civic issue or municipal concern...'
  }
};

const defaultCategoriesList = [
  { id: 'Traffic', name: 'Traffic', emoji: '🚦', color: '#FBE29D' },
  { id: 'Waterlogging', name: 'Waterlogging', emoji: '🌊', color: '#79C9C0' },
  { id: 'Garbage', name: 'Garbage', emoji: '🗑️', color: '#C7BCE8' },
  { id: 'Accident', name: 'Accident', emoji: '🚗', color: '#E88B97', isEmergency: true },
  { id: 'Pandemic', name: 'Pandemic', emoji: '🦟', color: '#E8B8D5' },
  { id: 'Pollution', name: 'Pollution', emoji: '🌫️', color: '#A8DCD3' },
  { id: 'Other', name: 'Other', emoji: '📍', color: '#A0A5B1' }
];

const ReportIssueModal = ({ onClose, onSubmitReport, onOpenAccidentModal }) => {
  const [categories, setCategories] = useState(defaultCategoriesList);
  const [selectedCat, setSelectedCat] = useState(defaultCategoriesList[0]);
  const [description, setDescription] = useState('');
  
  // Location with TomTom recommendation
  const [locationAddress, setLocationAddress] = useState('Majiwada Junction, Thane West');
  const [coords, setCoords] = useState([72.9781, 19.2183]); // [lng, lat]
  const [locationQuery, setLocationQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const locationDebounceTimer = useRef(null);

  // Photo state
  const [imagePreview, setImagePreview] = useState(categoryPresets['Traffic'].defaultImage);
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load categories from Supabase public.report_categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiClient.getCategories();
        if (res?.success && res.data?.length > 0) {
          const mapped = res.data.map(c => {
            const preset = categoryPresets[c.name] || categoryPresets['Other'];
            return {
              id: c.id,
              name: c.name,
              description: c.description,
              emoji: preset.emoji,
              color: preset.color,
              isEmergency: preset.isEmergency || false
            };
          });
          setCategories(mapped);
          // Default to Traffic or first category
          const initialCat = mapped.find(m => m.name === 'Traffic') || mapped[0];
          setSelectedCat(initialCat);
          const initialPreset = categoryPresets[initialCat.name] || categoryPresets['Other'];
          setImagePreview(initialPreset.defaultImage);
        }
      } catch (err) {
        console.warn('Could not load categories from Supabase:', err);
      }
    };
    loadCategories();
  }, []);

  // When category changes, update default image if not a custom file upload
  const handleCategorySelect = (cat) => {
    setSelectedCat(cat);
    if (!isCustomUpload) {
      const preset = categoryPresets[cat.name] || categoryPresets['Other'];
      setImagePreview(preset.defaultImage);
    }

    if (cat.isEmergency) {
      onClose();
      onOpenAccidentModal();
    }
  };

  // Handle real photo upload
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

  // Reset to category default photo
  const handleResetPhoto = () => {
    setIsCustomUpload(false);
    const preset = categoryPresets[selectedCat.name] || categoryPresets['Other'];
    setImagePreview(preset.defaultImage);
  };

  // Remove photo completely
  const handleRemovePhoto = () => {
    setImagePreview('');
    setIsCustomUpload(true);
  };

  // TomTom Location Autocomplete Search
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
        if (res?.success && res.results) {
          setLocationSuggestions(res.results);
        }
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
              setLocationAddress(`Thane GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
            }
          } catch {
            setLocationAddress(`Current GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
          }
          setShowLocationSearch(false);
        },
        () => {
          setLocationAddress('Majiwada Junction, Thane West');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const issueData = {
      title: `${selectedCat.name} reported near ${locationAddress}`,
      category: selectedCat.name,
      category_id: selectedCat.id,
      severity: 'medium', // Default severity; AI verification handles evaluation
      description: description || `${selectedCat.name} reported by citizen in ${locationAddress}.`,
      location: {
        address: locationAddress,
        regionName: 'Thane City (TMC)',
        coordinates: coords
      },
      imageUrl: imagePreview,
      image: imagePreview
    };

    await onSubmitReport(issueData);
    setIsSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1300);
  };

  const currentPreset = categoryPresets[selectedCat.name] || categoryPresets['Other'];

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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#252733' }}>
                Report an Issue
              </h2>
              <span style={{ fontSize: '10px', background: '#EAF7F8', color: '#79C9C0', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                ⚡ Supabase Live
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#777B86', marginTop: '2px' }}>
              Citizen reports are verified by AI and saved to public.reports.
            </p>
          </div>

          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EAF7F8',
              color: '#79C9C0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#252733' }}>Report Submitted Successfully!</h3>
            <p style={{ fontSize: '12px', color: '#777B86', marginTop: '6px' }}>
              Saved to Supabase database. You can track this report in the <strong>All Reports</strong> and <strong>My Reports</strong> section.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 1. Category Selector */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Select Category
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '8px'
              }}>
                {categories.map((cat) => {
                  const isSelected = selectedCat.id === cat.id || selectedCat.name === cat.name;
                  return (
                    <button
                      key={cat.id || cat.name}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '16px',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid #F0F2F5',
                        background: isSelected ? 'rgba(234, 247, 248, 0.85)' : '#FAFAFA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{cat.emoji}</span>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#252733', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.name}
                        </div>
                        {cat.isEmergency && (
                          <div style={{ fontSize: '9px', color: '#E88B97', fontWeight: 800 }}>Emergency</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Photo Upload & Category Image Modifier */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  Photo (Storage Bucket: report-images)
                </label>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {isCustomUpload && (
                    <button
                      type="button"
                      onClick={handleResetPhoto}
                      title="Reset to category photo"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#777B86',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
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
                        background: 'none',
                        border: 'none',
                        color: '#E88B97',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#79C9C0',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
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

              <div 
                style={{
                  height: '130px',
                  borderRadius: '18px',
                  border: '2px dashed #A8DCD3',
                  background: '#EAF7F8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Incident scene" 
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
                      <span>{selectedCat.emoji} {selectedCat.name} Photo</span>
                      {isCustomUpload ? (
                        <span style={{ background: '#79C9C0', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>Custom Upload</span>
                      ) : (
                        <span style={{ background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '6px', fontSize: '9px' }}>Category Scene</span>
                      )}
                    </div>

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
                      <Camera size={12} color="#79C9C0" /> Change
                    </button>
                  </>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    style={{ textAlign: 'center', color: '#79C9C0', cursor: 'pointer', padding: '20px' }}
                  >
                    <Camera size={28} style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>Upload or Take Photo</div>
                    <div style={{ fontSize: '11px', color: '#777B86', marginTop: '2px' }}>Tap to select an image from your device</div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Location with TomTom API Search Autocomplete */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  Location (TomTom Places API)
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#79C9C0',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Navigation size={12} /> Use GPS
                </button>
              </div>

              {/* Current Selected Location Box */}
              <div style={{
                background: '#F7EDF5',
                border: '1px solid rgba(232, 184, 213, 0.4)',
                padding: '12px 14px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MapPin size={18} color="#E88B97" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', color: '#777B86', fontWeight: 600 }}>DETECTED LOCATION</div>
                    <div style={{ fontSize: '13px', color: '#252733', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {locationAddress}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLocationSearch(!showLocationSearch)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8B8D5',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    color: '#E88B97',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {showLocationSearch ? 'Done' : 'Search / Change'}
                </button>
              </div>

              {/* TomTom Autocomplete Search Box */}
              {showLocationSearch && (
                <div style={{
                  marginTop: '8px',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '10px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                }} className="animate-fade-in">
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <Search size={16} color="#79C9C0" />
                    <input
                      type="text"
                      autoFocus
                      value={locationQuery}
                      onChange={(e) => handleLocationQueryChange(e.target.value)}
                      placeholder="Search landmarks, roads (e.g. Ghodbunder, Viviana Mall, Teen Hath Naka)..."
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '13px',
                        color: '#252733'
                      }}
                    />
                    {isSearchingLocation && (
                      <span style={{ fontSize: '11px', color: '#79C9C0' }}>Searching...</span>
                    )}
                  </div>

                  {/* TomTom Recommendations Dropdown */}
                  {locationSuggestions.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '180px', overflowY: 'auto' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', padding: '4px 6px' }}>
                        TOMTOM LOCATION RECOMMENDATIONS
                      </div>
                      {locationSuggestions.map((sug) => (
                        <div
                          key={sug.id || sug.address}
                          onClick={() => handleSelectSuggestion(sug)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#FFFFFF',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                        >
                          <MapPin size={14} color="#79C9C0" style={{ flexShrink: 0 }} />
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
                      No locations found. Try typing street, landmark or area name.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Description */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#777B86', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentPreset.descriptionPlaceholder}
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  border: '1px solid #F0F2F5',
                  padding: '12px 14px',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                  background: '#FAFAFA'
                }}
              />
            </div>

            {/* 5. Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '4px',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              {isSubmitting ? 'Saving to Supabase & Verifying...' : 'Submit Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default ReportIssueModal;
