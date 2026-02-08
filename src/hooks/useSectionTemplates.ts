import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SectionTemplate {
  id: string;
  section_type: string;
  display_name: string;
  description: string;
  icon_name: string;
  recommended_for: string[];
  is_core: boolean;
  template_structure: Record<string, any>;
}

export const useSectionTemplates = () => {
  return useQuery({
    queryKey: ["section-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_templates")
        .select("*")
        .order("is_core", { ascending: false });

      if (error) throw error;
      return data as SectionTemplate[];
    },
    staleTime: Infinity, // Templates rarely change
  });
};

export const SECTION_CATEGORIES: Record<string, { label: string; types: string[] }> = {
  core: {
    label: "Core",
    types: ["hero", "about", "contact"],
  },
  impact: {
    label: "Impact & Results",
    types: ["case_studies", "wins", "revenue_metrics", "financial_dashboards"],
  },
  skills: {
    label: "Skills & Experience",
    types: ["skills", "timeline", "credentials", "tech_stack"],
  },
  personal: {
    label: "Personal & Creative",
    types: ["portfolio", "personal_projects", "lifestyle", "speaking_writing", "brand_work"],
  },
  finance: {
    label: "Finance & Operations",
    types: ["deal_experience", "advisory_roles", "process_frameworks"],
  },
  technical: {
    label: "Technical",
    types: ["code_portfolio", "open_source", "technical_writing"],
  },
  sales: {
    label: "Sales & Business",
    types: ["client_logos", "client_testimonials", "testimonials"],
  },
};
