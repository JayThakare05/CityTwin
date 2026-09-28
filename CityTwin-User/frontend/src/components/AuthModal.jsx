import React, { useState } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';

const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name || !email || !password) {
          setError('Please fill in all fields');
          setIsLoading(false);
          return;
        }
        await onAuthSuccess({ name, email, password, type: 'register' });
      } else {
        if (!email || !password) {
          setError('Please fill in email and password');
          setIsLoading(false);
          return;
        }
        await onAuthSuccess({ email, password, type: 'login' });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
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
        padding: '28px 24px 36px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#79C9C0', textTransform: 'uppercase' }}>
              CITYTWIN AUTHENTICATION
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#252733', marginTop: '2px' }}>
              {isSignUp ? 'Create Citizen Account' : 'Welcome Back'}
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: '#FFF5F6',
            color: '#E88B97',
            padding: '10px 14px',
            borderRadius: '14px',
            fontSize: '12px',
            marginBottom: '16px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {isSignUp && (
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#252733', marginBottom: '6px', display: 'block' }}>
                FULL NAME
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 42px',
                    borderRadius: '16px',
                    border: '1px solid #F0F2F5',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#FAFAFA'
                  }}
                />
                <User size={18} color="#777B86" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#252733', marginBottom: '6px', display: 'block' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="citizen@thane.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 42px',
                  borderRadius: '16px',
                  border: '1px solid #F0F2F5',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#FAFAFA'
                }}
              />
              <Mail size={18} color="#777B86" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#252733', marginBottom: '6px', display: 'block' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 42px',
                  borderRadius: '16px',
                  border: '1px solid #F0F2F5',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#FAFAFA'
                }}
              />
              <Lock size={18} color="#777B86" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', marginTop: '10px' }}
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Register Account' : 'Sign In')}
          </button>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#79C9C0',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AuthModal;
