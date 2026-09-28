import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import CityMap from './components/CityMap';
import FloatingAreaCard from './components/FloatingAreaCard';
import SideDashboardPanel from './components/SideDashboardPanel';
import OnboardingScreen from './components/OnboardingScreen';
import WeatherModal from './components/WeatherModal';
import HamburgerDrawer from './components/HamburgerDrawer';
import ReportIssueModal from './components/ReportIssueModal';
import AccidentReportModal from './components/AccidentReportModal';
import RecentIssuesModal from './components/RecentIssuesModal';
import RegionMapModal from './components/RegionMapModal';
import ProfileModal from './components/ProfileModal';
import AuthModal from './components/AuthModal';
import { apiClient } from './api/apiClient';
import { Layers, Check, AlertTriangle, Plus, ShieldAlert } from 'lucide-react';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('citytwin_onboarded');
  });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('citytwin_token') || null);
  
  // Data from backend
  const [issues, setIssues] = useState([]);
  const [regions, setRegions] = useState([]);
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [userLocation, setUserLocation] = useState([
    parseFloat(import.meta.env.VITE_DEFAULT_LAT) || 19.2183,
    parseFloat(import.meta.env.VITE_DEFAULT_LNG) || 72.9781
  ]);
  const [activeLayer, setActiveLayer] = useState('all');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [localityName, setLocalityName] = useState('Current Location');
  const [targetLocation, setTargetLocation] = useState(null);

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Modals
  const [activeTab, setActiveTab] = useState('home');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
  const [isRecentIssuesOpen, setIsRecentIssuesOpen] = useState(false);
  const [isRegionMapOpen, setIsRegionMapOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadBackendData(userLocation[0], userLocation[1]);
    if (token) loadUserProfile(token);
  }, [token]);
  // Point map to user's real location when they log in
  useEffect(() => {
    if (user && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation([lat, lon]);
          setTargetLocation(null); // Reset target location
          handleLocationUpdate(lat, lon);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        }
      );
    }
  }, [user]);

  const handleLocationUpdate = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data && data.address) {
        const locality = data.address.city || data.address.town || data.address.village || data.address.suburb || 'Selected Location';
        setLocalityName(locality);
      }
    } catch (e) { console.warn('Nominatim error', e); }

    loadBackendData(lat, lon);
  };

  const handleMapClick = (lat, lon) => {
    setTargetLocation([lat, lon]);
    handleLocationUpdate(lat, lon);
  };

  const loadBackendData = async (lat, lon) => {
    try {
      const [issuesRes, regionsRes, emergencyRes, weatherRes] = await Promise.all([
        apiClient.getIssues(),
        apiClient.getRegions(),
        apiClient.getEmergencyServices('', lat, lon),
        apiClient.getWeather(lat, lon)
      ]);
      if (issuesRes.success) setIssues(issuesRes.data);
      if (regionsRes.success) setRegions(regionsRes.data);
      if (emergencyRes.success) setEmergencyServices(emergencyRes.data);
      if (weatherRes.success) {
        setWeatherData(weatherRes.current);
        setForecast(weatherRes.forecast || []);
      }
    } catch (err) {
      console.warn('Backend API error:', err.message);
    }
  };

  const loadUserProfile = async (jwtToken) => {
    try {
      const res = await apiClient.getMe(jwtToken);
      if (res.success) setUser(res.user);
    } catch {
      localStorage.removeItem('citytwin_token');
      setToken(null);
    }
  };

  const handleAuth = async (authData) => {
    const res = authData.type === 'register'
      ? await apiClient.register(authData.name, authData.email, authData.password)
      : await apiClient.login(authData.email, authData.password);
    if (res.success) {
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('citytwin_token', res.token);
      setShowOnboarding(false);
      localStorage.setItem('citytwin_onboarded', '1');
    } else {
      throw new Error(res.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('citytwin_token');
  };

  const handleCreateIssue = async (issueData) => {
    const res = await apiClient.createIssue({
      ...issueData,
      reporterName: user ? user.name : 'Anonymous Citizen'
    });
    if (res.success) setIssues([res.data, ...issues]);
  };

  const handleCreateAccidentReport = async (accidentData) => {
    const res = await apiClient.createIssue({
      ...accidentData,
      reporterName: user ? user.name : 'Emergency Alert'
    });
    if (res.success) {
      setIssues([res.data, ...issues]);
      const hospRes = await apiClient.getEmergencyServices('Hospital');
      if (hospRes.success) setEmergencyServices(hospRes.data);
    }
  };

  const handleLikeIssue = async (id) => {
    const res = await apiClient.likeIssue(id);
    if (res.success) setIssues(issues.map(i => (i.id === id || i._id === id) ? res.data : i));
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    const tabHandlers = {
      'report': () => user ? setIsReportModalOpen(true) : setIsAuthModalOpen(true),
      'recent-issues': () => setIsRecentIssuesOpen(true),
      'region-map': () => setIsRegionMapOpen(true),
      'weather': () => setIsWeatherModalOpen(true),
      'aqi': () => setIsWeatherModalOpen(true),
      'profile': () => setIsProfileOpen(true),
      'alerts': () => setIsWeatherModalOpen(true)
    };
    if (tabHandlers[tabId]) tabHandlers[tabId]();
  };

  const focusIssueOnMap = (iss) => {
    if (iss?.location?.coordinates?.length >= 2) {
      setUserLocation([iss.location.coordinates[1], iss.location.coordinates[0]]);
    }
  };

  const requireAuth = (action) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    action();
  };

  const layersList = [
    { id: 'all', label: 'All Layers', icon: '🌐' },
    { id: 'aqi', label: 'AQI Heatmap', icon: '🌫️' },
    { id: 'pandemic', label: 'Pandemic Hotspots', icon: '🦟' },
    { id: 'flood', label: 'Flood Risk', icon: '🌊' },
    { id: 'issues', label: 'Citizen Issues', icon: '📢' }
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#E8F5F6' }}>
      
      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingScreen
          onLoginClick={() => {
            setShowOnboarding(false);
            localStorage.setItem('citytwin_onboarded', '1');
            setIsAuthModalOpen(true);
          }}
          onSkipClick={() => {
            setShowOnboarding(false);
            localStorage.setItem('citytwin_onboarded', '1');
          }}
        />
      )}

      {/* Top Nav */}
      <HeaderNav
        user={user}
        isMobile={isMobile}
        weatherData={weatherData}
        onOpenMenu={() => setIsHamburgerOpen(true)}
        onOpenReport={() => requireAuth(() => setIsReportModalOpen(true))}
        onOpenAccident={() => requireAuth(() => setIsAccidentModalOpen(true))}
        onOpenRegionMap={() => setIsRegionMapOpen(true)}
        onOpenWeather={() => setIsWeatherModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Map + Side Panel */}
      <div style={{ width: '100%', flex: 1, position: 'relative', overflow: 'hidden' }}>
        <CityMap
          userLocation={userLocation}
          targetLocation={targetLocation}
          issues={issues}
          regions={regions}
          emergencyServices={emergencyServices}
          activeLayer={activeLayer}
          onIssueSelect={focusIssueOnMap}
          onMapClick={handleMapClick}
        />

        {/* Desktop: Side Dashboard */}
        {!isMobile && (
          <SideDashboardPanel
            weatherData={weatherData}
            issues={issues}
            regions={regions}
            localityName={localityName}
            onViewForecast={() => setIsWeatherModalOpen(true)}
            onOpenReport={() => requireAuth(() => setIsReportModalOpen(true))}
            onOpenAccident={() => requireAuth(() => setIsAccidentModalOpen(true))}
            onOpenRegionMap={() => setIsRegionMapOpen(true)}
            onSelectIssueOnMap={focusIssueOnMap}
          />
        )}

        {/* Mobile: Floating bottom weather card */}
        {isMobile && (
          <FloatingAreaCard
            weatherData={weatherData}
            onViewForecast={() => setIsWeatherModalOpen(true)}
          />
        )}

        {/* Layer Switcher — top right */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000
        }}>
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: isMobile ? '8px 14px' : '10px 18px',
              boxShadow: '0 6px 20px rgba(37, 39, 51, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: 700,
              color: '#252733',
              cursor: 'pointer'
            }}
          >
            <Layers size={isMobile ? 16 : 18} color="#79C9C0" />
            Layers
          </button>

          {showLayerMenu && (
            <div className="animate-fade-in" style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '200px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: '0 10px 32px rgba(37, 39, 51, 0.14)',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}>
              {layersList.map((lyr) => (
                <button key={lyr.id} onClick={() => { setActiveLayer(lyr.id); setShowLayerMenu(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: '12px', border: 'none',
                    background: activeLayer === lyr.id ? '#EAF7F8' : 'transparent',
                    color: activeLayer === lyr.id ? '#79C9C0' : '#252733',
                    fontWeight: activeLayer === lyr.id ? 700 : 500, fontSize: '12px', cursor: 'pointer'
                  }}>
                  <span>{lyr.icon} {lyr.label}</span>
                  {activeLayer === lyr.id && <Check size={14} color="#79C9C0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile: Bottom action bar */}
        {isMobile && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            pointerEvents: 'none'
          }}>
            <button onClick={() => setIsRecentIssuesOpen(true)} style={{
              pointerEvents: 'auto', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(168, 220, 211, 0.5)', borderRadius: '9999px',
              padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#252733',
              boxShadow: '0 6px 20px rgba(37, 39, 51, 0.08)', display: 'flex',
              alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}>
              <AlertTriangle size={14} color="#F6A88B" />
              Issues ({issues.length})
            </button>

            <button onClick={() => requireAuth(() => setIsAccidentModalOpen(true))} style={{
              pointerEvents: 'auto',
              background: 'linear-gradient(135deg, #E88B97 0%, #F6A88B 100%)',
              color: '#FFFFFF', border: 'none', borderRadius: '9999px',
              padding: '10px 12px', fontSize: '11px', fontWeight: 700,
              boxShadow: '0 6px 16px rgba(232, 139, 151, 0.3)', display: 'flex',
              alignItems: 'center', gap: '5px', cursor: 'pointer'
            }}>
              <ShieldAlert size={14} /> SOS
            </button>

            <button onClick={() => requireAuth(() => setIsReportModalOpen(true))} style={{
              pointerEvents: 'auto', width: '50px', height: '50px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #79C9C0 0%, #A8DCD3 100%)', color: '#FFFFFF',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(121, 201, 192, 0.45)', cursor: 'pointer'
            }} aria-label="Report Issue">
              <Plus size={24} />
            </button>
          </div>
        )}
      </div>

      {/* All Modals */}
      <HamburgerDrawer
        isOpen={isHamburgerOpen}
        onClose={() => setIsHamburgerOpen(false)}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        user={user}
        onLoginClick={() => { setIsHamburgerOpen(false); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
      />

      {isWeatherModalOpen && (
        <WeatherModal onClose={() => setIsWeatherModalOpen(false)} forecast={forecast} />
      )}
      {isReportModalOpen && (
        <ReportIssueModal
          onClose={() => setIsReportModalOpen(false)}
          onSubmitReport={handleCreateIssue}
          onOpenAccidentModal={() => setIsAccidentModalOpen(true)}
        />
      )}
      {isAccidentModalOpen && (
        <AccidentReportModal
          onClose={() => setIsAccidentModalOpen(false)}
          onSubmitAccidentReport={handleCreateAccidentReport}
        />
      )}
      {isRecentIssuesOpen && (
        <RecentIssuesModal
          onClose={() => setIsRecentIssuesOpen(false)}
          issues={issues}
          onSelectIssueOnMap={(iss) => { focusIssueOnMap(iss); setIsRecentIssuesOpen(false); }}
          onLikeIssue={handleLikeIssue}
        />
      )}
      {isRegionMapOpen && (
        <RegionMapModal
          onClose={() => setIsRegionMapOpen(false)}
          regions={regions}
          issues={issues}
          emergencyServices={emergencyServices}
        />
      )}
      {isProfileOpen && (
        <ProfileModal
          onClose={() => setIsProfileOpen(false)}
          user={user}
          userIssues={issues}
          onLogout={handleLogout}
          onLoginClick={() => { setIsProfileOpen(false); setIsAuthModalOpen(true); }}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuth} />
      )}
    </div>
  );
}

export default App;
