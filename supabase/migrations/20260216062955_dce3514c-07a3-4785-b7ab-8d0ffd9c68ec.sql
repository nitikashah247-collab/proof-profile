
-- Add theme customization columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS theme_base TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS theme_primary_color TEXT DEFAULT '#3B82F6',
ADD COLUMN IF NOT EXISTS theme_secondary_color TEXT DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS banner_type TEXT DEFAULT 'gradient',
ADD COLUMN IF NOT EXISTS banner_value TEXT DEFAULT 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Create profile-banners storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-banners', 'profile-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile-banners bucket
CREATE POLICY "Users can upload own banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-banners');

CREATE POLICY "Users can update own banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
