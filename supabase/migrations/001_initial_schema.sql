-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- 1. admin_profiles
-- ============================================================
CREATE TABLE admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_profiles_role ON admin_profiles(role);
CREATE INDEX idx_admin_profiles_is_active ON admin_profiles(is_active);

-- ============================================================
-- 2. city_zones
-- ============================================================
CREATE TABLE city_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Thane',
    zone_type TEXT NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_city_zones_boundary ON city_zones USING GIST (boundary);
CREATE INDEX idx_city_zones_zone_type ON city_zones(zone_type);
CREATE INDEX idx_city_zones_city ON city_zones(city);

-- ============================================================
-- 3. report_categories
-- ============================================================
CREATE TABLE report_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO report_categories (name, description) VALUES
    ('Hospital', 'Hospital and healthcare related reports'),
    ('Accident', 'Traffic accidents and collisions'),
    ('Pandemic', 'Disease outbreak and pandemic related'),
    ('Social', 'Social and community issues'),
    ('Disaster', 'Natural and man-made disasters'),
    ('Garbage', 'Waste management and garbage'),
    ('Waterlogging', 'Waterlogging and flooding'),
    ('Traffic', 'Traffic congestion and violations'),
    ('Pollution', 'Air, water, noise pollution'),
    ('Other', 'Miscellaneous reports');

-- ============================================================
-- 4. reports
-- ============================================================
CREATE TYPE report_status AS ENUM (
    'pending', 'verified', 'needs_review', 'rejected', 'duplicate', 'resolved'
);

CREATE TYPE report_severity AS ENUM (
    'low', 'medium', 'high', 'critical'
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES report_categories(id),
    title TEXT NOT NULL,
    description TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    zone_id UUID REFERENCES city_zones(id),
    severity report_severity DEFAULT 'medium',
    status report_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_category_id ON reports(category_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_zone_id ON reports(zone_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_location ON reports USING GIST (location);
CREATE INDEX idx_reports_severity ON reports(severity);

-- ============================================================
-- 5. report_media
-- ============================================================
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio');

CREATE TABLE report_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    media_type media_type NOT NULL DEFAULT 'image',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_media_report_id ON report_media(report_id);

-- ============================================================
-- 6. report_verifications
-- ============================================================
CREATE TYPE verification_status AS ENUM (
    'verified', 'needs_review', 'rejected', 'duplicate'
);

CREATE TABLE report_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    status verification_status NOT NULL,
    confidence NUMERIC(5,2) CHECK (confidence >= 0 AND confidence <= 100),
    reason TEXT,
    image_analysis JSONB,
    text_analysis JSONB,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_verifications_report_id ON report_verifications(report_id);
CREATE INDEX idx_report_verifications_status ON report_verifications(status);
CREATE INDEX idx_report_verifications_verified_at ON report_verifications(verified_at);

-- ============================================================
-- 7. weather_readings
-- ============================================================
CREATE TABLE weather_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES city_zones(id),
    temperature NUMERIC(5,2),
    feels_like NUMERIC(5,2),
    humidity INTEGER CHECK (humidity >= 0 AND humidity <= 100),
    pressure NUMERIC(7,2),
    wind_speed NUMERIC(5,2),
    rainfall NUMERIC(7,2),
    weather_condition TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weather_readings_zone_id ON weather_readings(zone_id);
CREATE INDEX idx_weather_readings_recorded_at ON weather_readings(recorded_at);

-- ============================================================
-- 8. aqi_readings
-- ============================================================
CREATE TABLE aqi_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES city_zones(id),
    aqi INTEGER NOT NULL CHECK (aqi >= 0),
    pm25 NUMERIC(7,2),
    pm10 NUMERIC(7,2),
    no2 NUMERIC(7,2),
    so2 NUMERIC(7,2),
    co NUMERIC(7,2),
    o3 NUMERIC(7,2),
    category TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_aqi_readings_zone_id ON aqi_readings(zone_id);
CREATE INDEX idx_aqi_readings_recorded_at ON aqi_readings(recorded_at);
CREATE INDEX idx_aqi_readings_aqi ON aqi_readings(aqi);

-- ============================================================
-- 9. predictions
-- ============================================================
CREATE TYPE prediction_type AS ENUM (
    'waterlogging', 'flood', 'aqi', 'pandemic', 'traffic'
);

CREATE TYPE risk_level AS ENUM (
    'low', 'moderate', 'high', 'critical', 'severe'
);

CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES city_zones(id),
    prediction_type prediction_type NOT NULL,
    model_name TEXT NOT NULL,
    prediction_value JSONB NOT NULL,
    risk_level risk_level NOT NULL,
    prediction_for TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_zone_id ON predictions(zone_id);
CREATE INDEX idx_predictions_type ON predictions(prediction_type);
CREATE INDEX idx_predictions_prediction_for ON predictions(prediction_for);
CREATE INDEX idx_predictions_risk_level ON predictions(risk_level);
CREATE INDEX idx_predictions_created_at ON predictions(created_at);

-- ============================================================
-- 10. alerts
-- ============================================================
CREATE TYPE alert_type AS ENUM (
    'HIGH_AQI', 'FLOOD_RISK', 'PANDEMIC_RISK', 'ACCIDENT', 'TRAFFIC', 
    'CITIZEN_REPORT', 'SYSTEM', 'EMERGENCY', 'WEATHER'
);

CREATE TYPE alert_severity AS ENUM (
    'info', 'warning', 'critical', 'emergency'
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type alert_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    severity alert_severity DEFAULT 'warning',
    zone_id UUID REFERENCES city_zones(id),
    report_id UUID REFERENCES reports(id),
    prediction_id UUID REFERENCES predictions(id),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_alerts_zone_id ON alerts(zone_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);
CREATE INDEX idx_alerts_report_id ON alerts(report_id);
CREATE INDEX idx_alerts_prediction_id ON alerts(prediction_id);

-- ============================================================
-- 11. hospitals
-- ============================================================
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    total_beds INTEGER DEFAULT 0,
    available_beds INTEGER DEFAULT 0,
    icu_beds INTEGER DEFAULT 0,
    specializations TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hospitals_location ON hospitals USING GIST (location);
CREATE INDEX idx_hospitals_is_active ON hospitals(is_active);
CREATE INDEX idx_hospitals_email ON hospitals(email);

-- ============================================================
-- 12. camp_requests
-- ============================================================
CREATE TYPE camp_status AS ENUM (
    'pending', 'approved', 'scheduled', 'completed', 'rejected'
);

CREATE TYPE camp_risk_level AS ENUM (
    'low', 'moderate', 'high', 'critical'
);

CREATE TABLE camp_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES city_zones(id),
    disease TEXT NOT NULL,
    risk_level camp_risk_level NOT NULL,
    reason TEXT,
    requested_date DATE,
    status camp_status DEFAULT 'pending',
    doctor_count INTEGER DEFAULT 0,
    nurse_count INTEGER DEFAULT 0,
    ambulance_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_camp_requests_hospital_id ON camp_requests(hospital_id);
CREATE INDEX idx_camp_requests_zone_id ON camp_requests(zone_id);
CREATE INDEX idx_camp_requests_status ON camp_requests(status);
CREATE INDEX idx_camp_requests_risk_level ON camp_requests(risk_level);
CREATE INDEX idx_camp_requests_created_at ON camp_requests(created_at);

-- ============================================================
-- 13. drivers
-- ============================================================
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    license_number TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    total_trips INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drivers_hospital_id ON drivers(hospital_id);
CREATE INDEX idx_drivers_is_active ON drivers(is_active);
CREATE INDEX idx_drivers_license_number ON drivers(license_number);

-- ============================================================
-- 14. ambulances
-- ============================================================
CREATE TYPE ambulance_status AS ENUM (
    'available', 'on_emergency', 'offline', 'maintenance'
);

CREATE TABLE ambulances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    vehicle_number TEXT NOT NULL UNIQUE,
    driver_id UUID REFERENCES drivers(id),
    status ambulance_status DEFAULT 'available',
    current_location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ambulances_hospital_id ON ambulances(hospital_id);
CREATE INDEX idx_ambulances_driver_id ON ambulances(driver_id);
CREATE INDEX idx_ambulances_status ON ambulances(status);
CREATE INDEX idx_ambulances_location ON ambulances USING GIST (current_location);
CREATE INDEX idx_ambulances_vehicle_number ON ambulances(vehicle_number);

-- ============================================================
-- 15. ambulance_locations
-- ============================================================
CREATE TABLE ambulance_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambulance_id UUID NOT NULL REFERENCES ambulances(id) ON DELETE CASCADE,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    speed NUMERIC(5,2),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ambulance_locations_ambulance_id ON ambulance_locations(ambulance_id);
CREATE INDEX idx_ambulance_locations_recorded_at ON ambulance_locations(recorded_at);
CREATE INDEX idx_ambulance_locations_location ON ambulance_locations USING GIST (location);
CREATE INDEX idx_ambulance_locations_ambulance_time ON ambulance_locations(ambulance_id, recorded_at DESC);

-- ============================================================
-- 16. traffic_signals
-- ============================================================
CREATE TYPE signal_status AS ENUM (
    'red', 'yellow', 'green', 'offline'
);

CREATE TABLE traffic_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    zone_id UUID REFERENCES city_zones(id),
    status signal_status DEFAULT 'red',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_traffic_signals_zone_id ON traffic_signals(zone_id);
CREATE INDEX idx_traffic_signals_status ON traffic_signals(status);
CREATE INDEX idx_traffic_signals_location ON traffic_signals USING GIST (location);

-- ============================================================
-- 17. signal_events
-- ============================================================
CREATE TABLE signal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signal_id UUID NOT NULL REFERENCES traffic_signals(id) ON DELETE CASCADE,
    ambulance_id UUID REFERENCES ambulances(id) ON DELETE SET NULL,
    status signal_status NOT NULL,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deactivated_at TIMESTAMPTZ
);

CREATE INDEX idx_signal_events_signal_id ON signal_events(signal_id);
CREATE INDEX idx_signal_events_ambulance_id ON signal_events(ambulance_id);
CREATE INDEX idx_signal_events_activated_at ON signal_events(activated_at);

-- ============================================================
-- Triggers for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Enable Row Level Security on all tables
-- ============================================================
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqi_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulance_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_events ENABLE ROW LEVEL SECURITY;