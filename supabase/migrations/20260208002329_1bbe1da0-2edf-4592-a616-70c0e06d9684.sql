
-- Create section_templates table (read-only reference data)
CREATE TABLE public.section_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Layout',
  recommended_for text[] NOT NULL DEFAULT '{}',
  is_core boolean NOT NULL DEFAULT false,
  template_structure jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.section_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read section templates"
  ON public.section_templates FOR SELECT USING (true);

-- Create profile_sections table
CREATE TABLE public.profile_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  section_type text NOT NULL,
  section_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  section_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(profile_id, section_type)
);

ALTER TABLE public.profile_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sections"
  ON public.profile_sections FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view sections via published profile"
  ON public.profile_sections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profile_versions pv
    WHERE pv.profile_id = profile_sections.profile_id AND pv.is_published = true
  ));

CREATE POLICY "Users can create their own sections"
  ON public.profile_sections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sections"
  ON public.profile_sections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sections"
  ON public.profile_sections FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_profile_sections_updated_at
  BEFORE UPDATE ON public.profile_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add visible_sections column to profile_versions for per-version visibility
ALTER TABLE public.profile_versions
  ADD COLUMN visible_sections jsonb DEFAULT NULL;

-- Seed section_templates with all section types

-- Core sections
INSERT INTO public.section_templates (section_type, display_name, description, icon_name, is_core, recommended_for, template_structure) VALUES
('hero', 'Hero', 'Name, title, positioning, and key metrics', 'User', true, '{}', '{"fields": ["name", "title", "metrics"]}'),
('about', 'About', 'Summary paragraph about your background', 'FileText', true, '{}', '{"fields": ["summary"]}'),
('contact', 'Contact', 'Email, LinkedIn, and call-to-action', 'Mail', true, '{}', '{"fields": ["email", "linkedin", "cta_text"]}');

-- Universal sections
INSERT INTO public.section_templates (section_type, display_name, description, icon_name, is_core, recommended_for, template_structure) VALUES
('case_studies', 'Impact Stories', 'Expandable project cards showcasing your work', 'Briefcase', false, '{}', '{"fields": ["title", "challenge", "approach", "results", "metrics"]}'),
('skills', 'Skills & Proof Points', 'Grid of skills with evidence and proficiency', 'Target', false, '{}', '{"fields": ["name", "category", "proficiency"]}'),
('timeline', 'Career Timeline', 'Visual journey through your roles', 'Clock', false, '{}', '{"fields": ["role", "company", "start_date", "end_date", "description"]}'),
('testimonials', 'Testimonials', 'Quotes from colleagues and clients', 'Quote', false, '{}', '{"fields": ["quote", "author_name", "author_role", "author_company"]}'),
('credentials', 'Education & Certifications', 'Degrees, certifications, and awards', 'Award', false, '{}', '{"fields": ["title", "institution", "year", "type"]}');

-- Marketing/Creative
INSERT INTO public.section_templates (section_type, display_name, description, icon_name, is_core, recommended_for, template_structure) VALUES
('portfolio', 'Visual Portfolio', 'Image gallery with captions and links', 'Image', false, '{marketing,creative,design}', '{"fields": ["images"]}'),
('brand_work', 'Brand Work', 'Logos and companies you have worked with', 'Building2', false, '{marketing,creative}', '{"fields": ["companies"]}'),
('personal_projects', 'Personal Projects', 'Side projects and creative work', 'Rocket', false, '{creative,engineering}', '{"fields": ["title", "description", "link", "image"]}'),
('lifestyle', 'Beyond Work', 'Photos and interests showing personality', 'Heart', false, '{marketing,creative}', '{"fields": ["images", "interests"]}'),
('speaking_writing', 'Speaking & Writing', 'Links to talks, articles, and content', 'Mic', false, '{marketing,creative,leadership}', '{"fields": ["title", "type", "url", "date"]}');

-- Finance/Operations
INSERT INTO public.section_templates (section_type, display_name, description, icon_name, is_core, recommended_for, template_structure) VALUES
('financial_dashboards', 'Financial Impact', 'Charts showing financial metrics and impact', 'TrendingUp', false, '{finance,operations}', '{"fields": ["metric_name", "value", "change", "chart_type"]}'),
('process_frameworks', 'Systems & Processes', 'Visual diagrams of frameworks you built', 'GitBranch', false, '{operations,engineering}', '{"fields": ["title", "description", "diagram_url"]}'),
('advisory_roles', 'Board & Advisory', 'Companies and boards you advise', 'Users', false, '{finance,leadership}', '{"fields": ["company", "role", "start_date"]}'),
('deal_experience', 'Deal Experience', 'M&A, fundraising, and deal tables', 'DollarSign', false, '{finance}', '{"fields": ["deal_name", "type", "value", "year", "role"]}');

-- Technical/Engineering
INSERT INTO public.section_templates (section_type, display_name, description, icon_name, is_core, recommended_for, template_structure) VALUES
('code_portfolio', 'Code & Projects', 'GitHub links, code snippets, and projects', 'Code', false, '{engineering,technical}', '{"fields": ["title", "description", "github_url", "demo_url", "tech_stack"]}'),
('tech_stack', 'Technical Skills', 'Tech logos with proficiency levels', 'Cpu', false, '{engineering,technical}', '{"fields": ["name", "category", "proficiency", "icon"]}'),
('open_source', 'Open Source', 'Open source contribution history', 'GitMerge', false, '{engineering}', '{"fields": ["project", "contributions", "stars", "url"]}'),
('technical_writing', 'Technical Writing', 'Blog posts, documentation, and guides', 'BookOpen', false, '{engineering,technical}', '{"fields": ["title", "url", "date", "publication"]}');

-- Sales/BD
INSERT INTO public.section_templates (section_type, display_name, description, icon_name, is_core, recommended_for, template_structure) VALUES
('wins', 'Major Wins', 'Trophy case of significant deals and achievements', 'Trophy', false, '{sales,business_development}', '{"fields": ["title", "value", "client", "year"]}'),
('client_logos', 'Client Portfolio', 'Companies and clients you have worked with', 'Building', false, '{sales,business_development}', '{"fields": ["company", "logo_url", "industry"]}'),
('revenue_metrics', 'Revenue Impact', 'Sales dashboards and revenue metrics', 'BarChart3', false, '{sales}', '{"fields": ["metric", "value", "period", "chart_type"]}'),
('client_testimonials', 'Client Testimonials', 'Customer quotes and success stories', 'MessageSquare', false, '{sales,business_development}', '{"fields": ["quote", "client_name", "client_company", "client_role"]}');
