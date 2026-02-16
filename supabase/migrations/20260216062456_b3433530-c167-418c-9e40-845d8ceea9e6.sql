
-- Create profile_artifacts table
CREATE TABLE public.profile_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_artifacts ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own artifacts"
  ON public.profile_artifacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view artifacts via published profile"
  ON public.profile_artifacts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profile_versions pv
    WHERE pv.profile_id = profile_artifacts.profile_id
    AND pv.is_published = true
  ));

CREATE POLICY "Users can insert own artifacts"
  ON public.profile_artifacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own artifacts"
  ON public.profile_artifacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own artifacts"
  ON public.profile_artifacts FOR DELETE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_profile_artifacts_profile_id ON public.profile_artifacts(profile_id);
CREATE INDEX idx_profile_artifacts_user_id ON public.profile_artifacts(user_id);

-- Create profile-artifacts storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-artifacts', 'profile-artifacts', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile-artifacts bucket
CREATE POLICY "Users can upload own artifacts to storage"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-artifacts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view artifact files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-artifacts');

CREATE POLICY "Users can delete own artifact files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-artifacts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
