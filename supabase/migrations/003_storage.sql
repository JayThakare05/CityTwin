-- ============================================================
-- STORAGE BUCKET AND POLICIES
-- ============================================================

-- Create report-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'report-images',
    'report-images',
    FALSE,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for report-images
-- Organized as: report-images/{report_id}/{filename}

-- Users can upload to their own report folders
CREATE POLICY "Users can upload to own report folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'report-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Users can view images from their own reports
CREATE POLICY "Users can view own report images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'report-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Admins can view all report images
CREATE POLICY "Admins can view all report images" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'report-images' AND
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = TRUE)
    );

-- Admins can delete any report images
CREATE POLICY "Admins can delete report images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'report-images' AND
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_active = TRUE)
    );

-- Service role can manage all (for backend processing)
CREATE POLICY "Service role full access" ON storage.objects
    FOR ALL USING (auth.role() = 'service_role');