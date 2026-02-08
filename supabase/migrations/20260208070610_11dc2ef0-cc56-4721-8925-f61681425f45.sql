
-- Add slug column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create a function to generate a unique slug from full_name
CREATE OR REPLACE FUNCTION public.generate_profile_slug(full_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base slug: lowercase, replace spaces with hyphens, remove non-alphanumeric
  base_slug := lower(trim(full_name));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- If empty, generate a random slug
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'user-' || substr(gen_random_uuid()::text, 1, 8);
  END IF;
  
  final_slug := base_slug;
  
  -- Check for duplicates and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$function$;

-- Update handle_new_user to also generate slug
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  generated_slug TEXT;
  user_name TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'full_name', '');
  generated_slug := public.generate_profile_slug(user_name);
  
  INSERT INTO public.profiles (user_id, full_name, marketing_opted_in, slug)
  VALUES (
    NEW.id,
    user_name,
    COALESCE((NEW.raw_user_meta_data ->> 'marketing_opted_in')::boolean, false),
    generated_slug
  );
  RETURN NEW;
END;
$function$;

-- Add RLS policy for public profile viewing by slug
CREATE POLICY "Public can view profiles by slug"
ON public.profiles
FOR SELECT
USING (
  slug IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profile_versions pv 
    WHERE pv.profile_id = profiles.id 
    AND pv.is_published = true
  )
);

-- Generate slugs for any existing profiles that don't have one
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, full_name FROM public.profiles WHERE slug IS NULL
  LOOP
    UPDATE public.profiles 
    SET slug = public.generate_profile_slug(r.full_name)
    WHERE id = r.id;
  END LOOP;
END;
$$;
