import React, { useState } from 'react';
import { X, Camera, MapPin, CheckCircle, Upload, AlertTriangle } from 'lucide-react';

const categories = [
  { id: 'Disease / Pandemic', label: 'Disease / Pandemic', emoji: '🦟', color: '#E8B8D5' },
  { id: 'Accident', label: 'Accident', emoji: '🚗', color: '#E88B97', isEmergency: true },
  { id: 'Garbage', label: 'Garbage', emoji: '🗑️', color: '#C7BCE8' },
  { id: 'Waterlogging', label: 'Waterlogging', emoji: '🌊', color: '#79C9C0' },
  { id: 'Air Pollution', label: 'Air Pollution', emoji: '🌫️', color: '#A8DCD3' },
  { id: 'Other', label: 'Other', emoji: '📍', color: '#A0A5B1' }
];

const ReportIssueModal = ({ onClose, onSubmitReport, onOpenAccidentModal }) => {
  const [selectedCategory, setSelectedCategory] = useState('Garbage');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [locationAddress, setLocationAddress] = useState('Majiwada Junction, Thane West');
  const [coords, setCoords] = useState([72.9781, 19.2183]); // [lng, lat]
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat.id);
    if (cat.isEmergency) {
      onClose();
      onOpenAccidentModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const issueData = {
      title: `${selectedCategory} reported`,
      category: selectedCategory,
      severity,
      description: description || `Issue reported by citizen in ${locationAddress}.`,
      location: {
        address: locationAddress,
        regionName: 'Thane City (TMC)',
        coordinates: coords
      },
      imageUrl: imagePreview
    };

    await onSubmitReport(issueData);
    setIsSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 4000,
      background: 'rgba(37, 39, 51, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      flexDirection: 'column',
      justify: 'flex-end'
    }} className="animate-fade-in">

      <div className="glass-panel animate-slide-up" style={{
        background: '#FFFFFF',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '24px 20px 32px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#252733' }}>
              Report an Issue
            </h2>
            <p style={{ fontSize: '12px', color: '#777B86', marginTop: '2px' }}>
              Help make your city safer and cleaner.
            </p>
          </div>

          <button className="btn-icon" onClick={onClose}>
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
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#252733' }}>Report Submitted!</h3>
            <p style={{ fontSize: '12px', color: '#777B86', marginTop: '6px' }}>
              Thank you for contributing to Thane Digital Twin AI registry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Category Selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#252733', marginBottom: '10px', display: 'block' }}>
                SELECT CATEGORY
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid #F0F2F5',
                        background: isSelected ? 'rgba(234, 247, 248, 0.6)' : '#FAFAFA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{cat.emoji}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#252733' }}>{cat.label}</div>
                        {cat.isEmergency && (
                          <div style={{ fontSize: '10px', color: '#E88B97', fontWeight: 700 }}>Emergency Flow</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#252733', marginBottom: '8px', display: 'block' }}>
                UPLOAD PHOTO
              </label>

              <div style={{
                height: '110px',
                borderRadius: '18px',
                border: '2px dashed #A8DCD3',
                background: '#EAF7F8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#79C9C0' }}>
                    <Camera size={24} />
                    <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Take or Upload Photo</div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Indicator */}
            <div style={{
              background: '#F7EDF5',
              padding: '12px 16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#E8B8D5" />
                <div>
                  <div style={{ fontSize: '11px', color: '#252733', fontWeight: 700 }}>📍 Location detected</div>
                  <div style={{ fontSize: '11px', color: '#777B86' }}>{locationAddress}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLocationAddress('Naupada, Thane West')}
                style={{
                  background: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: '#777B86',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Change
              </button>
            </div>

            {/* Description Input */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#252733', marginBottom: '6px', display: 'block' }}>
                DESCRIPTION
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, landmarks, or severity..."
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', padding: '16px', marginTop: '6px' }}
            >
              {isSubmitting ? 'Submitting to CityTwin...' : 'Submit Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default ReportIssueModal;
