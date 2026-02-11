-- Add expiry_date column to profile_versions table
ALTER TABLE public.profile_versions 
ADD COLUMN expiry_date TIMESTAMP WITH TIME ZONE;

-- Create index for expiry_date to optimize queries
CREATE INDEX idx_profile_versions_expiry_date ON public.profile_versions(expiry_date);

-- Update existing free versions to have a default expiry (3 months from now)
-- We'll assume profiles with is_pro=false are free tier
UPDATE public.profile_versions 
SET expiry_date = created_at + INTERVAL '3 months'
WHERE expiry_date IS NULL 
AND is_published = true;