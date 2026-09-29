-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE id = auth.uid() AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is hospital admin
CREATE OR REPLACE FUNCTION is_hospital_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM hospitals
        WHERE email = auth.email() AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is driver
CREATE OR REPLACE FUNCTION is_driver()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM drivers
        WHERE hospital_id IN (
            SELECT id FROM hospitals WHERE email = auth.email()
        ) AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- admin_profiles
-- ============================================================
CREATE POLICY "Admins can view all admin profiles" ON admin_profiles
    FOR SELECT USING (is_admin());

CREATE POLICY "Super admins can manage admin profiles" ON admin_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_profiles
            WHERE id = auth.uid() AND role = 'super_admin' AND is_active = TRUE
        )
    );

-- ============================================================
-- city_zones
-- ============================================================
CREATE POLICY "Anyone can view city zones" ON city_zones
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage city zones" ON city_zones
    FOR ALL USING (is_admin());

-- ============================================================
-- report_categories
-- ============================================================
CREATE POLICY "Anyone can view report categories" ON report_categories
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage report categories" ON report_categories
    FOR ALL USING (is_admin());

-- ============================================================
-- reports
-- ============================================================
-- Citizens: can read verified/public reports, create their own
CREATE POLICY "Citizens can view verified reports" ON reports
    FOR SELECT USING (
        status IN ('verified', 'resolved') OR user_id = auth.uid()
    );

CREATE POLICY "Citizens can create reports" ON reports
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Citizens can update own pending reports" ON reports
    FOR UPDATE USING (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- Admins: full access
CREATE POLICY "Admins can manage all reports" ON reports
    FOR ALL USING (is_admin());

-- Hospital admins: can view reports near their hospitals
CREATE POLICY "Hospitals can view nearby reports" ON reports
    FOR SELECT USING (
        is_hospital_admin() AND zone_id IN (
            SELECT zone_id FROM hospitals h
            JOIN city_zones cz ON ST_DWithin(h.location, cz.boundary::geometry, 5000)
            WHERE h.email = auth.email()
        )
    );

-- ============================================================
-- report_media
-- ============================================================
CREATE POLICY "Users can view media for accessible reports" ON report_media
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reports r
            WHERE r.id = report_id AND (
                r.status IN ('verified', 'resolved') OR r.user_id = auth.uid() OR is_admin()
            )
        )
    );

CREATE POLICY "Report owners can upload media" ON report_media
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM reports r
            WHERE r.id = report_id AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all media" ON report_media
    FOR ALL USING (is_admin());

-- ============================================================
-- report_verifications
-- ============================================================
CREATE POLICY "Admins can view all verifications" ON report_verifications
    FOR SELECT USING (is_admin());

CREATE POLICY "System can insert verifications" ON report_verifications
    FOR INSERT WITH CHECK (TRUE); -- Backend service with service role

CREATE POLICY "Admins can update verifications" ON report_verifications
    FOR UPDATE USING (is_admin());

-- ============================================================
-- weather_readings
-- ============================================================
CREATE POLICY "Anyone can view weather readings" ON weather_readings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage weather readings" ON weather_readings
    FOR ALL USING (is_admin());

CREATE POLICY "Backend services can insert weather" ON weather_readings
    FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- aqi_readings
-- ============================================================
CREATE POLICY "Anyone can view AQI readings" ON aqi_readings
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage AQI readings" ON aqi_readings
    FOR ALL USING (is_admin());

CREATE POLICY "Backend services can insert AQI" ON aqi_readings
    FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- predictions
-- ============================================================
CREATE POLICY "Admins can view all predictions" ON predictions
    FOR SELECT USING (is_admin());

CREATE POLICY "Hospitals can view predictions for their zones" ON predictions
    FOR SELECT USING (
        is_hospital_admin() AND zone_id IN (
            SELECT cz.id FROM city_zones cz
            JOIN hospitals h ON ST_DWithin(h.location, cz.boundary::geometry, 10000)
            WHERE h.email = auth.email()
        )
    );

CREATE POLICY "Backend services can insert predictions" ON predictions
    FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- alerts
-- ============================================================
CREATE POLICY "Users can view alerts for their zones" ON alerts
    FOR SELECT USING (
        zone_id IS NULL OR
        zone_id IN (
            SELECT cz.id FROM city_zones cz
            WHERE ST_DWithin(cz.boundary::geography, (
                SELECT location FROM reports WHERE user_id = auth.uid() ORDER BY created_at DESC LIMIT 1
            ), 5000)
        ) OR
        is_admin() OR
        is_hospital_admin()
    );

CREATE POLICY "Admins can manage all alerts" ON alerts
    FOR ALL USING (is_admin());

CREATE POLICY "Backend services can insert alerts" ON alerts
    FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- hospitals
-- ============================================================
CREATE POLICY "Anyone can view active hospitals" ON hospitals
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage hospitals" ON hospitals
    FOR ALL USING (is_admin());

CREATE POLICY "Hospital admins can view own hospital" ON hospitals
    FOR SELECT USING (email = auth.email());

-- ============================================================
-- camp_requests
-- ============================================================
CREATE POLICY "Hospital admins can manage own camp requests" ON camp_requests
    FOR ALL USING (
        hospital_id IN (SELECT id FROM hospitals WHERE email = auth.email())
    );

CREATE POLICY "Admins can view all camp requests" ON camp_requests
    FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update camp request status" ON camp_requests
    FOR UPDATE USING (is_admin());

-- ============================================================
-- drivers
-- ============================================================
CREATE POLICY "Hospital admins can manage own drivers" ON drivers
    FOR ALL USING (
        hospital_id IN (SELECT id FROM hospitals WHERE email = auth.email())
    );

CREATE POLICY "Admins can view all drivers" ON drivers
    FOR SELECT USING (is_admin());

CREATE POLICY "Drivers can view own profile" ON drivers
    FOR SELECT USING (
        hospital_id IN (
            SELECT id FROM hospitals WHERE email = auth.email()
        ) AND id IN (
            SELECT id FROM drivers WHERE id = auth.uid()
        )
    );

-- ============================================================
-- ambulances
-- ============================================================
CREATE POLICY "Hospital admins can manage own ambulances" ON ambulances
    FOR ALL USING (
        hospital_id IN (SELECT id FROM hospitals WHERE email = auth.email())
    );

CREATE POLICY "Admins can view all ambulances" ON ambulances
    FOR SELECT USING (is_admin());

CREATE POLICY "Drivers can view assigned ambulance" ON ambulances
    FOR SELECT USING (
        driver_id IN (
            SELECT id FROM drivers WHERE hospital_id IN (
                SELECT id FROM hospitals WHERE email = auth.email()
            )
        )
    );

CREATE POLICY "Drivers can update own ambulance status/location" ON ambulances
    FOR UPDATE USING (
        driver_id IN (
            SELECT id FROM drivers WHERE hospital_id IN (
                SELECT id FROM hospitals WHERE email = auth.email()
            )
        )
    ) WITH CHECK (
        driver_id IN (
            SELECT id FROM drivers WHERE hospital_id IN (
                SELECT id FROM hospitals WHERE email = auth.email()
            )
        )
    );

-- ============================================================
-- ambulance_locations
-- ============================================================
CREATE POLICY "Hospital admins can view own ambulance locations" ON ambulance_locations
    FOR SELECT USING (
        ambulance_id IN (
            SELECT id FROM ambulances WHERE hospital_id IN (
                SELECT id FROM hospitals WHERE email = auth.email()
            )
        )
    );

CREATE POLICY "Admins can view all ambulance locations" ON ambulance_locations
    FOR SELECT USING (is_admin());

CREATE POLICY "Backend/Drivers can insert locations" ON ambulance_locations
    FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- traffic_signals
-- ============================================================
CREATE POLICY "Anyone can view traffic signals" ON traffic_signals
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage traffic signals" ON traffic_signals
    FOR ALL USING (is_admin());

-- ============================================================
-- signal_events
-- ============================================================
CREATE POLICY "Admins can view all signal events" ON signal_events
    FOR SELECT USING (is_admin());

CREATE POLICY "Hospital admins can view own signal events" ON signal_events
    FOR SELECT USING (
        ambulance_id IN (
            SELECT id FROM ambulances WHERE hospital_id IN (
                SELECT id FROM hospitals WHERE email = auth.email()
            )
        )
    );

CREATE POLICY "Backend can manage signal events" ON signal_events
    FOR ALL USING (TRUE);