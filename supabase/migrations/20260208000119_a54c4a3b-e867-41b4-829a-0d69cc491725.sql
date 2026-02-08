
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  headline TEXT DEFAULT '',
  location TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profile_versions table (tailored versions for different jobs)
CREATE TABLE public.profile_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL DEFAULT 'Default',
  target_role TEXT DEFAULT '',
  target_company TEXT DEFAULT '',
  customized_headline TEXT DEFAULT '',
  customized_bio TEXT DEFAULT '',
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create case_studies table
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  challenge TEXT DEFAULT '',
  approach TEXT DEFAULT '',
  results TEXT DEFAULT '',
  metrics JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  proficiency INTEGER DEFAULT 80,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create career_timeline table
CREATE TABLE public.career_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT DEFAULT 'Present',
  description TEXT DEFAULT '',
  key_achievement TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT '',
  author_company TEXT DEFAULT '',
  quote TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profile_views table (analytics)
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_version_id UUID NOT NULL REFERENCES public.profile_versions(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_ip TEXT DEFAULT '',
  viewer_user_agent TEXT DEFAULT '',
  referrer TEXT DEFAULT '',
  time_on_page_seconds INTEGER DEFAULT 0,
  sections_viewed TEXT[] DEFAULT '{}',
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create onboarding_conversations table (AI interview history)
CREATE TABLE public.onboarding_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress',
  extracted_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_conversations ENABLE ROW LEVEL SECURITY;

-- Profiles: users can CRUD their own, anyone can view published profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- Profile versions: users can CRUD their own, anyone can view published
CREATE POLICY "Users can view their own versions" ON public.profile_versions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view published versions" ON public.profile_versions FOR SELECT USING (is_published = true);
CREATE POLICY "Users can create their own versions" ON public.profile_versions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own versions" ON public.profile_versions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own versions" ON public.profile_versions FOR DELETE USING (auth.uid() = user_id);

-- Case studies: users can CRUD their own
CREATE POLICY "Users can view their own case studies" ON public.case_studies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view case studies via profile" ON public.case_studies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profile_versions pv WHERE pv.profile_id = case_studies.profile_id AND pv.is_published = true)
);
CREATE POLICY "Users can create their own case studies" ON public.case_studies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own case studies" ON public.case_studies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own case studies" ON public.case_studies FOR DELETE USING (auth.uid() = user_id);

-- Skills: users can CRUD their own
CREATE POLICY "Users can view their own skills" ON public.skills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view skills via profile" ON public.skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profile_versions pv WHERE pv.profile_id = skills.profile_id AND pv.is_published = true)
);
CREATE POLICY "Users can create their own skills" ON public.skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON public.skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON public.skills FOR DELETE USING (auth.uid() = user_id);

-- Career timeline: users can CRUD their own
CREATE POLICY "Users can view their own timeline" ON public.career_timeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view timeline via profile" ON public.career_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profile_versions pv WHERE pv.profile_id = career_timeline.profile_id AND pv.is_published = true)
);
CREATE POLICY "Users can create their own timeline" ON public.career_timeline FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own timeline" ON public.career_timeline FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own timeline" ON public.career_timeline FOR DELETE USING (auth.uid() = user_id);

-- Testimonials: users can CRUD their own
CREATE POLICY "Users can view their own testimonials" ON public.testimonials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view testimonials via profile" ON public.testimonials FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profile_versions pv WHERE pv.profile_id = testimonials.profile_id AND pv.is_published = true)
);
CREATE POLICY "Users can create their own testimonials" ON public.testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own testimonials" ON public.testimonials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own testimonials" ON public.testimonials FOR DELETE USING (auth.uid() = user_id);

-- Profile views: anyone can insert (tracking), only profile owner can read
CREATE POLICY "Anyone can create profile views" ON public.profile_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Profile owners can view their analytics" ON public.profile_views FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_views.profile_id AND p.user_id = auth.uid())
);

-- Onboarding conversations: users can CRUD their own
CREATE POLICY "Users can view their own conversations" ON public.onboarding_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own conversations" ON public.onboarding_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON public.onboarding_conversations FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profile_versions_updated_at BEFORE UPDATE ON public.profile_versions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_onboarding_updated_at BEFORE UPDATE ON public.onboarding_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-assets', 'profile-assets', true);

-- Storage policies
CREATE POLICY "Users can upload their own assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own assets" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own assets" ON storage.objects FOR DELETE USING (bucket_id = 'profile-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Profile assets are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'profile-assets');
