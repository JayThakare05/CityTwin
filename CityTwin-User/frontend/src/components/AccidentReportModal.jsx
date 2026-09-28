import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, MapPin, CheckCircle } from 'lucide-react';

const AccidentReportModal = ({ onClose, onSubmitAccidentReport }) => {
  const [severity, setSeverity] = useState('Critical');
  const [description, setDescription] = useState('Two vehicle accident near Nitin Company junction on EEH. Medical assistance required.');
  const [locationAddress, setLocationAddress] = useState('EEH Nitin Junction, Thane West');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const severities = [
    { level: 'Low', color: '#A8DCD3' },
    { level: 'Medium', color: '#FBE29D' },
    { level: 'High', color: '#F6A88B' },
    { level: 'Critical', color: '#E88B97' }
  ];

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
        coordinates: [72.9698, 19.1990]
      },
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80'
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
                Dispatches alerts to nearby Thane hospitals & police.
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
              Showing nearby emergency hospitals & response units on map...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Image Preview */}
            <div style={{
              height: '130px',
              borderRadius: '18px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" 
                alt="Accident Scene" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'rgba(0,0,0,0.6)',
                color: '#FFF',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '11px'
              }}>
                📷 Scene Photo Attached
              </div>
            </div>

            {/* Severity Level Picker */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#252733', marginBottom: '8px', display: 'block' }}>
                ACCIDENT SEVERITY LEVEL
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
                        padding: '10px 4px',
                        borderRadius: '14px',
                        border: isSelected ? `2px solid ${item.color}` : '1px solid #F0F2F5',
                        background: isSelected ? `${item.color}25` : '#FAFAFA',
                        color: isSelected ? '#252733' : '#777B86',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {item.level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div style={{
              background: '#EAF7F8',
              padding: '12px 14px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <MapPin size={18} color="#79C9C0" />
              <div>
                <div style={{ fontSize: '11px', color: '#777B86', fontWeight: 500 }}>Accident Location</div>
                <div style={{ fontSize: '13px', color: '#252733', fontWeight: 700 }}>{locationAddress}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#252733', marginBottom: '6px', display: 'block' }}>
                DESCRIPTION / VEHICLES INVOLVED
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  borderRadius: '14px',
                  border: '1px solid #F0F2F5',
                  padding: '10px 12px',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                  background: '#FAFAFA'
                }}
              />
            </div>

            {/* Submit Emergency Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #E88B97 0%, #F6A88B 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '16px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(232, 139, 151, 0.4)',
                marginTop: '4px'
              }}
            >
              {isSubmitting ? 'Dispatching Emergency Alert...' : 'Submit Emergency Report'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

export default AccidentReportModal;
