import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Users, Zap, Brain, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useSectionTemplates } from "@/hooks/useSectionTemplates";

// Reuse demo-quality components
import { ProfileHero } from "@/components/profile/ProfileHero";
import { DynamicImpactCharts } from "@/components/profile/DynamicImpactCharts";
import { CaseStudyCard } from "@/components/profile/CaseStudyCard";
import { CareerTimeline } from "@/components/profile/CareerTimeline";
import { SkillsMatrix } from "@/components/profile/SkillsMatrix";
import { TestimonialsCarousel } from "@/components/profile/TestimonialsCarousel";
import { WorkStyleVisual } from "@/components/profile/WorkStyleVisual";
import { CoverBanner } from "@/components/profile/CoverBanner";
import { ProfileOwnerBar } from "@/components/profile/ProfileOwnerBar";
import { AnalyticsPreview } from "@/components/profile/AnalyticsPreview";
import { AddSectionModal } from "@/components/profile/AddSectionModal";
import { GenericSectionRenderer } from "@/components/profile/GenericSectionRenderer";
import { CareerCoachDrawer } from "@/components/editor/CareerCoachDrawer";
import { ProofGallerySection } from "@/components/profile/ProofGallerySection";
import { InlineEditWrapper } from "@/components/profile/InlineEditWrapper";
import {
  HeroInlineEdit,
  CaseStudyInlineEdit,
  SkillsInlineEdit,
  TimelineInlineEdit,
  ImpactChartsInlineEdit,
  WorkStyleInlineEdit,
  LanguagesInlineEdit,
  PublicationsInlineEdit,
  TestimonialsInlineEdit,
} from "@/components/profile/inline-editors";
import { GenericInlineEdit } from "@/components/profile/inline-editors/GenericInlineEdit";

interface ProfileSection {
  id: string;
  section_type: string;
  section_order: number;
  is_visible: boolean;
  section_data: Record<string, any>;
}

const WORK_STYLE_ICONS: Record<string, React.ElementType> = {
  "Collaboration Style": Users,
  "Decision Making": Zap,
  "Problem Solving": Brain,
  "Communication": MessageSquare,
};

// Section types that have dedicated renderers (not handled by the generic loop)
const DEDICATED_SECTION_TYPES = [
  "hero", "about", "contact", "impact_charts", "case_studies",
  "career_timeline", "skills_matrix", "skills", "testimonials",
  "client_testimonials", "work_style", "languages", "publications",
];

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();

  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({ totalViews: 0, avgTimeOnPage: "0s", topSection: "—", viewsThisWeek: 0 });
  const { data: sectionTemplates = [] } = useSectionTemplates();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(data);
      const ownerCheck = !!user && data.user_id === user.id;
      setIsOwner(ownerCheck);

      // Fetch all related data in parallel
      const [sectionsRes, timelineRes, skillsRes, caseStudiesRes, testimonialsRes] = await Promise.all([
        supabase
          .from("profile_sections")
          .select("*")
          .eq("profile_id", data.id)
          .order("section_order", { ascending: true }),
        supabase
          .from("career_timeline")
          .select("*")
          .eq("profile_id", data.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("skills")
          .select("*")
          .eq("profile_id", data.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("case_studies")
          .select("*")
          .eq("profile_id", data.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("testimonials")
          .select("*")
          .eq("profile_id", data.id)
          .order("sort_order", { ascending: true }),
      ]);

      // For owners, show all sections; for visitors, only visible ones
      const allSections = (sectionsRes.data as ProfileSection[]) || [];
      setSections(ownerCheck ? allSections : allSections.filter((s) => s.is_visible));
      setTimeline(timelineRes.data || []);
      setSkills(skillsRes.data || []);
      setCaseStudies(caseStudiesRes.data || []);
      setTestimonials(testimonialsRes.data || []);

      // Record profile view for non-owners
      if (!ownerCheck) {
        const versionRes = await supabase
          .from("profile_versions")
          .select("id")
          .eq("profile_id", data.id)
          .eq("is_published", true)
          .limit(1)
          .maybeSingle();

        if (versionRes.data) {
          supabase
            .from("profile_views")
            .insert({
              profile_id: data.id,
              profile_version_id: versionRes.data.id,
            })
            .then(({ error: viewErr }) => {
              if (viewErr) console.error("Failed to record view:", viewErr);
            });
        }
      }

      // Fetch analytics for owner
      if (ownerCheck) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const { data: views } = await supabase
          .from("profile_views")
          .select("*")
          .eq("profile_id", data.id);

        const allViews = views || [];
        const weekViews = allViews.filter((v) => new Date(v.viewed_at) >= weekAgo);
        const avgTime = allViews.length > 0
          ? Math.round(allViews.reduce((sum, v) => sum + (v.time_on_page_seconds || 0), 0) / allViews.length)
          : 0;
        const sectionCounts: Record<string, number> = {};
        allViews.forEach((v) => (v.sections_viewed || []).forEach((s: string) => {
          sectionCounts[s] = (sectionCounts[s] || 0) + 1;
        }));
        const topSection = Object.entries(sectionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
        setAnalyticsData({
          totalViews: allViews.length,
          avgTimeOnPage: avgTime > 60 ? `${Math.round(avgTime / 60)}m` : `${avgTime}s`,
          topSection,
          viewsThisWeek: weekViews.length,
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [slug, user]);

  // --- Add section handler ---
  const handleAddSection = async (sectionType: string) => {
    if (!profile || !user) return;
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.section_order)) + 1 : 0;

    const { data: created, error } = await supabase
      .from("profile_sections")
      .insert({
        profile_id: profile.id,
        user_id: user.id,
        section_type: sectionType,
        section_order: maxOrder,
        section_data: {},
        is_visible: true,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Failed to add section", description: error.message, variant: "destructive" });
      return;
    }
    if (created) {
      setSections((prev) => [...prev, created as ProfileSection]);
      toast({ title: "Section added! Hover over it to start editing." });
    }
  };

  // --- Remove section handler with undo ---
  const pendingRemovalRef = useRef<{ section: ProfileSection; timeoutId: ReturnType<typeof setTimeout> } | null>(null);

  useEffect(() => {
    return () => {
      if (pendingRemovalRef.current) {
        clearTimeout(pendingRemovalRef.current.timeoutId);
        supabase.from("profile_sections").delete().eq("id", pendingRemovalRef.current.section.id);
      }
    };
  }, []);

  const handleRemoveSection = async (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    // Commit any previous pending removal immediately
    if (pendingRemovalRef.current) {
      clearTimeout(pendingRemovalRef.current.timeoutId);
      await supabase.from("profile_sections").delete().eq("id", pendingRemovalRef.current.section.id);
    }

    // Optimistic UI removal
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setEditingSection(null);

    // Set 5-second timer for permanent deletion
    const timeoutId = setTimeout(async () => {
      await supabase.from("profile_sections").delete().eq("id", sectionId);
      pendingRemovalRef.current = null;
    }, 5000);

    pendingRemovalRef.current = { section, timeoutId };

    const template = sectionTemplates.find((t) => t.section_type === section.section_type);
    const displayName = template?.display_name || section.section_type.replace(/_/g, " ");

    toast({
      title: `${displayName} removed`,
      description: (
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm">Section removed from profile</span>
          <button
            type="button"
            onClick={() => {
              clearTimeout(timeoutId);
              setSections((prev) => [...prev, section].sort((a, b) => a.section_order - b.section_order));
              pendingRemovalRef.current = null;
              toast({ title: `${displayName} restored` });
            }}
            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Undo
          </button>
        </div>
      ) as any,
      duration: 5000,
    });
  };

  // --- Section reordering handler ---
  const handleMoveSection = async (sectionId: string, direction: "up" | "down") => {
    const sorted = [...sections].sort((a, b) => a.section_order - b.section_order);
    const idx = sorted.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const updated = [...sorted];
    const tempOrder = updated[idx].section_order;
    updated[idx] = { ...updated[idx], section_order: updated[swapIdx].section_order };
    updated[swapIdx] = { ...updated[swapIdx], section_order: tempOrder };
    updated.sort((a, b) => a.section_order - b.section_order);
    setSections(updated);

    await Promise.all([
      supabase.from("profile_sections").update({ section_order: updated.find(s => s.id === sectionId)!.section_order }).eq("id", sectionId),
      supabase.from("profile_sections").update({ section_order: updated.find(s => s.id === sorted[swapIdx].id)!.section_order }).eq("id", sorted[swapIdx].id),
    ]);
  };

  // --- Inline editing handlers ---
  const handleSectionSave = async (sectionId: string, newData: Record<string, any>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, section_data: newData } : s))
    );
    const { error } = await supabase
      .from("profile_sections")
      .update({ section_data: newData })
      .eq("id", sectionId);
    if (error) {
      console.error("Failed to save section:", error);
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
    setEditingSection(null);
  };

  const handleCaseStudySave = async (newData: Record<string, any>) => {
    if (caseStudiesSection) {
      await handleSectionSave(caseStudiesSection.id, newData);
    } else if (profile && user) {
      const { data: created, error } = await supabase
        .from("profile_sections")
        .insert({
          profile_id: profile.id,
          user_id: user.id,
          section_type: "case_studies",
          section_order: sections.length,
          section_data: newData,
        })
        .select()
        .single();
      if (error) {
        console.error("Failed to create case studies section:", error);
      } else if (created) {
        setSections((prev) => [...prev, created as ProfileSection]);
      }
      setEditingSection(null);
    }
  };

  const handleProfileFieldSave = async (updates: Record<string, any>) => {
    setProfile((prev: any) => ({ ...prev, ...updates }));
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);
    if (error) {
      console.error("Failed to save profile field:", error);
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const handleHeroSave = async (profileUpdates: Record<string, any>, sectionUpdates: Record<string, any>) => {
    await handleProfileFieldSave(profileUpdates);
    const heroSec = sections.find((s) => s.section_type === "hero");
    if (heroSec) {
      await handleSectionSave(heroSec.id, sectionUpdates);
    }
    setEditingSection(null);
  };

  const handleTestimonialsSave = async (items: Array<{ quote: string; author: string; role: string; company: string }>) => {
    if (!profile || !user) return;
    const { error: delError } = await supabase
      .from("testimonials")
      .delete()
      .eq("profile_id", profile.id)
      .eq("user_id", user.id);
    if (delError) {
      console.error("Failed to delete old testimonials:", delError);
      toast({ title: "Save failed", description: delError.message, variant: "destructive" });
      return;
    }
    if (items.length > 0) {
      const rows = items.map((t, idx) => ({
        user_id: user.id,
        profile_id: profile.id,
        quote: t.quote,
        author_name: t.author,
        author_role: t.role,
        author_company: t.company,
        sort_order: idx,
      }));
      const { error: insError } = await supabase.from("testimonials").insert(rows);
      if (insError) {
        console.error("Failed to save testimonials:", insError);
        toast({ title: "Save failed", description: insError.message, variant: "destructive" });
        return;
      }
    }
    setTestimonials(items.map((t, idx) => ({
      id: `temp-${idx}`,
      quote: t.quote,
      author_name: t.author,
      author_role: t.role,
      author_company: t.company,
      sort_order: idx,
      profile_id: profile.id,
      user_id: user.id,
    })));
    setEditingSection(null);
  };

  // Theme style — apply user's dark/light theme choice from Step 4
  const themeStyle = useMemo(() => {
    if (!profile) return {};
    const isDark = profile.theme_base === "dark";
    const primary = profile.theme_primary_color || "#3B82F6";
    const secondary = profile.theme_secondary_color || "#8B5CF6";

    return {
      "--background": isDark ? "222 47% 6%" : "0 0% 100%",
      "--foreground": isDark ? "210 40% 98%" : "222 47% 11%",
      "--card": isDark ? "222 47% 11%" : "220 14% 98%",
      "--card-foreground": isDark ? "210 40% 98%" : "222 47% 11%",
      "--popover": isDark ? "222 47% 11%" : "0 0% 100%",
      "--popover-foreground": isDark ? "210 40% 98%" : "222 47% 11%",
      "--muted": isDark ? "215 25% 14%" : "220 14% 96%",
      "--muted-foreground": isDark ? "215 20% 65%" : "220 9% 46%",
      "--border": isDark ? "215 25% 20%" : "220 13% 91%",
      "--input": isDark ? "215 25% 20%" : "220 13% 91%",
      "--secondary": isDark ? "215 25% 17%" : "220 14% 96%",
      "--secondary-foreground": isDark ? "210 40% 98%" : "222 47% 11%",
      "--accent": isDark ? "215 25% 17%" : "220 14% 96%",
      "--accent-foreground": isDark ? "210 40% 98%" : "222 47% 11%",
      "--theme-primary-hex": primary,
      "--theme-secondary-hex": secondary,
    } as React.CSSProperties;
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Profile not found</h1>
          <p className="text-muted-foreground mb-8">
            This profile doesn't exist or hasn't been published yet.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Extract section data
  const getSection = (type: string) => sections.find((s) => s.section_type === type);
  const heroSection = getSection("hero");
  const impactSection = getSection("impact_charts");
  const caseStudiesSection = getSection("case_studies");
  const timelineSection = getSection("career_timeline");
  const skillsSection = getSection("skills_matrix");
  const testimonialsSection = getSection("testimonials");
  const workStyleSection = getSection("work_style");
  const languagesSection = getSection("languages");
  const publicationsSection = getSection("publications");

  // Helper to get section position info
  const getSectionPosition = (sectionType: string) => {
    const section = getSection(sectionType);
    if (!section) return { isFirst: true, isLast: true };
    const sorted = [...sections].sort((a, b) => a.section_order - b.section_order);
    const idx = sorted.findIndex((s) => s.id === section.id);
    return { isFirst: idx === 0, isLast: idx === sorted.length - 1 };
  };

  // Build hero stats
  const heroStats = heroSection?.section_data?.hero_stats || {};
  const normalizedHeroStats = {
    yearsExperience: heroStats.years_experience || heroStats.yearsExperience || profile.years_experience || 0,
    projectsLed: heroStats.projects_led || heroStats.projectsLed || 0,
    teamsManaged: heroStats.people_managed || heroStats.teamsManaged || 0,
    keyMetric: heroStats.key_metric || heroStats.keyMetric || { value: 0, label: "", suffix: "" },
  };

  // Build skill names for hero tags (deduplicated)
  const skillNameSet = new Set<string>();
  const skillNames = skills.filter(s => {
    const key = s.name.toLowerCase().trim();
    if (skillNameSet.has(key)) return false;
    skillNameSet.add(key);
    return true;
  }).map(s => s.name);

  // Build skills data for SkillsMatrix with category from section_data
  const skillProofMap = new Map<string, any>();
  const skillsWithProof = skillsSection?.section_data?.skills_with_proof || [];
  for (const sp of skillsWithProof) {
    skillProofMap.set(sp.name?.toLowerCase()?.trim(), sp);
  }

  const seenSkills = new Set<string>();
  const skillsData = skills.filter(skill => {
    const key = skill.name.toLowerCase().trim();
    if (seenSkills.has(key)) return false;
    seenSkills.add(key);
    return true;
  }).map((skill) => {
    const proof = skillProofMap.get(skill.name.toLowerCase().trim());
    return {
      name: skill.name,
      level: Math.round((skill.proficiency || 80) / 20),
      yearsOfExperience: proof?.years || Math.max(1, Math.round((profile.years_experience || 5) * (skill.proficiency || 80) / 100)),
      relatedCaseStudies: [] as number[],
      category: proof?.category || skill.category || "",
    };
  });

  // Build case studies
  const caseStudyCards = caseStudies.map((cs) => ({
    title: cs.title,
    company: "—",
    keyMetric: cs.metrics?.[0]?.value || "✓",
    summary: cs.challenge?.substring(0, 100) || cs.title,
    challenge: cs.challenge || "",
    approach: cs.approach || "",
    outcome: cs.results || "",
    skills: cs.metrics?.map((m: any) => m.label) || [],
    artifacts: [],
  }));

  const enrichedCaseStudies = caseStudiesSection?.section_data?.items || caseStudiesSection?.section_data?.case_studies;
  const finalCaseStudyCards = enrichedCaseStudies?.length > 0
    ? enrichedCaseStudies.map((cs: any) => ({
        title: cs.title,
        company: cs.company || "—",
        keyMetric: cs.key_metric || cs.metrics?.[0]?.value || "✓",
        summary: cs.summary || cs.challenge?.substring(0, 100) || cs.title,
        challenge: cs.challenge || "",
        approach: cs.approach || "",
        outcome: cs.results || "",
        skills: cs.skills_used || cs.skills || [],
        artifacts: cs.artifacts || [],
      }))
    : caseStudyCards;

  const filteredCaseStudies = activeSkill
    ? finalCaseStudyCards.filter((cs: any) => cs.skills.includes(activeSkill))
    : finalCaseStudyCards;

  // Build timeline
  const timelineEntries = timelineSection?.section_data?.timeline?.length > 0
    ? timelineSection.section_data.timeline.map((entry: any) => ({
        company: entry.company,
        role: entry.role,
        startYear: entry.start_year || entry.startYear || "",
        endYear: entry.end_year || entry.endYear || "Present",
        achievements: entry.achievements || [],
      }))
    : timeline.map((entry) => ({
        company: entry.company,
        role: entry.role,
        startYear: entry.start_date?.substring(0, 4) || "",
        endYear: entry.end_date ? entry.end_date.substring(0, 4) : "Present",
        achievements: [entry.key_achievement, entry.description].filter(Boolean),
      }));

  // Build testimonials
  const testimonialCards = testimonials.map((t) => ({
    quote: t.quote,
    author: t.author_name,
    role: t.author_role || "",
    company: t.author_company || "",
  }));

  // Build work style data
  const workStyleData = workStyleSection?.section_data?.work_style;
  const workStyleDimensions = workStyleData?.dimensions?.map((d: any) => ({
    label: d.label,
    leftLabel: d.left_label || d.leftLabel || "",
    rightLabel: d.right_label || d.rightLabel || "",
    value: d.value || 50,
    icon: WORK_STYLE_ICONS[d.label] || Users,
  })) || [];

  // Visualizations from impact section
  const visualizations = impactSection?.section_data?.visualizations || [];

  // Proof gallery
  const proofGallery = caseStudiesSection?.section_data?.proofGallery || [];

  // Legacy archetype support
  const archetype = heroSection?.section_data?.archetype || heroSection?.section_data?.themeBase || "";

  // Helper to check if a section has meaningful content
  const sectionHasContent = (section: ProfileSection | undefined) => {
    if (!section) return false;
    const d = section.section_data;
    if (!d || Object.keys(d).length === 0) return false;
    // Check for items array or type-specific array
    const items = d.items || d[section.section_type];
    if (Array.isArray(items) && items.length > 0) return true;
    // Check for any string values
    return Object.values(d).some((v) => typeof v === "string" && v.length > 0);
  };

  // Generic sections (not handled by dedicated renderers)
  const genericSections = sections
    .filter((s) => !DEDICATED_SECTION_TYPES.includes(s.section_type) && (s.is_visible || isOwner))
    .sort((a, b) => a.section_order - b.section_order);

  return (
    <div className="min-h-screen profile-page text-foreground" style={themeStyle}>
      {/* Owner controls */}
      {isOwner && (
        <ProfileOwnerBar onAddSection={() => setShowAddSection(true)} />
      )}

      {/* Add Section Modal */}
      {showAddSection && (
        <AddSectionModal
          open={showAddSection}
          onClose={() => setShowAddSection(false)}
          onAddSection={handleAddSection}
          activeSectionTypes={sections.map((s) => s.section_type)}
        />
      )}

      {/* Analytics Preview - owner only */}
      <AnalyticsPreview data={analyticsData} isOwner={isOwner} />

      {/* Cover Banner */}
      <CoverBanner
        bannerType={profile.banner_type}
        bannerValue={profile.banner_value}
        bannerUrl={profile.banner_url || undefined}
        primaryColor={profile.theme_primary_color}
        archetype={archetype}
      />

      {/* Hero Section */}
      <InlineEditWrapper
        isOwner={isOwner}
        sectionId={heroSection?.id || "hero"}
        sectionType="hero"
        sectionLabel="Hero"
        isEditing={editingSection === "hero"}
        onEditStart={() => setEditingSection("hero")}
        onEditEnd={() => setEditingSection(null)}
        isCoreSection={true}
        onMoveUp={heroSection ? () => handleMoveSection(heroSection.id, "up") : undefined}
        onMoveDown={heroSection ? () => handleMoveSection(heroSection.id, "down") : undefined}
        isFirst={getSectionPosition("hero").isFirst}
        isLast={getSectionPosition("hero").isLast}
        editForm={
          <HeroInlineEdit
            profileData={profile}
            sectionData={heroSection?.section_data || {}}
            onSave={handleHeroSave}
            onCancel={() => setEditingSection(null)}
          />
        }
      >
        <ProfileHero
          name={profile.full_name || ""}
          title={profile.headline || ""}
          location={profile.location || ""}
          company={profile.industry || ""}
          tagline={profile.bio || ""}
          photoUrl={profile.avatar_url || undefined}
          skills={[]}
          activeSkill={null}
          onSkillClick={() => {}}
          stats={normalizedHeroStats}
          email={heroSection?.section_data?.email || ""}
          calendlyUrl={heroSection?.section_data?.calendly_url || ""}
          linkedinUrl={heroSection?.section_data?.linkedin_url || ""}
        />
      </InlineEditWrapper>

      {/* Impact Charts — FIX 4: hide empty for non-owners */}
      {(visualizations.length > 0 || (isOwner && impactSection)) && (isOwner || visualizations.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={impactSection?.id || "impact"}
          sectionType="impact_charts"
          sectionLabel="Impact Metrics"
          isEditing={editingSection === "impact_charts"}
          onEditStart={() => setEditingSection("impact_charts")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={impactSection ? () => handleRemoveSection(impactSection.id) : undefined}
          isEmpty={visualizations.length === 0}
          onMoveUp={impactSection ? () => handleMoveSection(impactSection.id, "up") : undefined}
          onMoveDown={impactSection ? () => handleMoveSection(impactSection.id, "down") : undefined}
          isFirst={getSectionPosition("impact_charts").isFirst}
          isLast={getSectionPosition("impact_charts").isLast}
          editForm={
            <ImpactChartsInlineEdit
              sectionData={impactSection?.section_data || {}}
              onSave={(data) => handleSectionSave(impactSection!.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <DynamicImpactCharts visualizations={visualizations} />
        </InlineEditWrapper>
      )}

      {/* Case Studies — FIX 4: hide empty for non-owners */}
      {(finalCaseStudyCards.length > 0 || (isOwner && caseStudiesSection)) && (isOwner || finalCaseStudyCards.length > 0) && (() => {
        const limitedCaseStudies = finalCaseStudyCards.slice(0, 5);
        const limitedFiltered = activeSkill
          ? limitedCaseStudies.filter((cs: any) => cs.skills.includes(activeSkill))
          : limitedCaseStudies;
        return (
          <InlineEditWrapper
            isOwner={isOwner}
            sectionId={caseStudiesSection?.id || "cases"}
            sectionType="case_studies"
            sectionLabel="Impact Stories"
            isEditing={editingSection === "case_studies"}
            onEditStart={() => setEditingSection("case_studies")}
            onEditEnd={() => setEditingSection(null)}
            onRemove={caseStudiesSection ? () => handleRemoveSection(caseStudiesSection.id) : undefined}
            isEmpty={finalCaseStudyCards.length === 0}
            onMoveUp={caseStudiesSection ? () => handleMoveSection(caseStudiesSection.id, "up") : undefined}
            onMoveDown={caseStudiesSection ? () => handleMoveSection(caseStudiesSection.id, "down") : undefined}
            isFirst={getSectionPosition("case_studies").isFirst}
            isLast={getSectionPosition("case_studies").isLast}
            editForm={
              <CaseStudyInlineEdit
                sectionData={caseStudiesSection?.section_data || {}}
                onSave={handleCaseStudySave}
                onCancel={() => setEditingSection(null)}
              />
            }
          >
            <section className="py-16 lg:py-20">
              <div className="container mx-auto px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-5xl"
                >
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <p className="section-overline mb-2">Case Studies</p>
                      <h2 className="section-heading text-4xl text-foreground">Impact Stories</h2>
                      <p className="text-muted-foreground mt-2">
                        {activeSkill
                          ? `Showing ${filteredCaseStudies.length} stories related to "${activeSkill}"`
                          : "Real results from real challenges"}
                      </p>
                    </div>
                    {activeSkill && (
                      <Button variant="ghost" size="sm" onClick={() => setActiveSkill(null)}>
                        Clear filter ×
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {limitedFiltered.map((study: any, index: number) => (
                      <CaseStudyCard
                        key={index}
                        study={study}
                        index={index}
                        isHighlighted={!activeSkill}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
          </InlineEditWrapper>
        );
      })()}

      {/* Proof Gallery */}
      {proofGallery.length > 0 && (
        <ProofGallerySection items={proofGallery} />
      )}

      {/* Career Timeline — FIX 4: hide empty for non-owners */}
      {(timelineEntries.length > 0 || (isOwner && timelineSection)) && (isOwner || timelineEntries.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={timelineSection?.id || "timeline"}
          sectionType="career_timeline"
          sectionLabel="Career Journey"
          isEditing={editingSection === "career_timeline"}
          onEditStart={() => setEditingSection("career_timeline")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={timelineSection ? () => handleRemoveSection(timelineSection.id) : undefined}
          isEmpty={timelineEntries.length === 0}
          onMoveUp={timelineSection ? () => handleMoveSection(timelineSection.id, "up") : undefined}
          onMoveDown={timelineSection ? () => handleMoveSection(timelineSection.id, "down") : undefined}
          isFirst={getSectionPosition("career_timeline").isFirst}
          isLast={getSectionPosition("career_timeline").isLast}
          editForm={
            <TimelineInlineEdit
              sectionData={timelineSection?.section_data || {}}
              onSave={(data) => handleSectionSave(timelineSection!.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <CareerTimeline entries={timelineEntries.slice(0, 6)} />
        </InlineEditWrapper>
      )}

      {/* Skills Matrix — FIX 4: hide empty for non-owners */}
      {(skillsData.length > 0 || (isOwner && skillsSection)) && (isOwner || skillsData.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={skillsSection?.id || "skills"}
          sectionType="skills_matrix"
          sectionLabel="Skills"
          isEditing={editingSection === "skills_matrix"}
          onEditStart={() => setEditingSection("skills_matrix")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={skillsSection ? () => handleRemoveSection(skillsSection.id) : undefined}
          isEmpty={skillsData.length === 0}
          onMoveUp={skillsSection ? () => handleMoveSection(skillsSection.id, "up") : undefined}
          onMoveDown={skillsSection ? () => handleMoveSection(skillsSection.id, "down") : undefined}
          isFirst={getSectionPosition("skills_matrix").isFirst}
          isLast={getSectionPosition("skills_matrix").isLast}
          editForm={
            <SkillsInlineEdit
              sectionData={skillsSection?.section_data || {}}
              skills={skills}
              profileId={profile.id}
              onSave={(data) => handleSectionSave(skillsSection!.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <SkillsMatrix
            skills={skillsData}
            activeSkill={activeSkill}
            onSkillClick={setActiveSkill}
          />
        </InlineEditWrapper>
      )}

      {/* Testimonials — FIX 4: hide empty for non-owners */}
      {(testimonialCards.length > 0 || (isOwner && testimonialsSection)) && (isOwner || testimonialCards.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={testimonialsSection?.id || "testimonials"}
          sectionType="testimonials"
          sectionLabel="Testimonials"
          isEditing={editingSection === "testimonials"}
          onEditStart={() => setEditingSection("testimonials")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={testimonialsSection ? () => handleRemoveSection(testimonialsSection.id) : undefined}
          isEmpty={testimonialCards.length === 0}
          onMoveUp={testimonialsSection ? () => handleMoveSection(testimonialsSection.id, "up") : undefined}
          onMoveDown={testimonialsSection ? () => handleMoveSection(testimonialsSection.id, "down") : undefined}
          isFirst={getSectionPosition("testimonials").isFirst}
          isLast={getSectionPosition("testimonials").isLast}
          editForm={
            <TestimonialsInlineEdit
              testimonials={testimonialCards}
              onSave={handleTestimonialsSave}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <TestimonialsCarousel testimonials={testimonialCards} />
        </InlineEditWrapper>
      )}

      {/* Languages — FIX 4: hide empty for non-owners */}
      {((languagesSection?.section_data?.languages?.length > 0) || (isOwner && languagesSection)) && (isOwner || languagesSection?.section_data?.languages?.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={languagesSection!.id}
          sectionType="languages"
          sectionLabel="Languages"
          isEditing={editingSection === "languages"}
          onEditStart={() => setEditingSection("languages")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={() => handleRemoveSection(languagesSection!.id)}
          isEmpty={!(languagesSection!.section_data.languages || []).length}
          onMoveUp={() => handleMoveSection(languagesSection!.id, "up")}
          onMoveDown={() => handleMoveSection(languagesSection!.id, "down")}
          isFirst={getSectionPosition("languages").isFirst}
          isLast={getSectionPosition("languages").isLast}
          editForm={
            <LanguagesInlineEdit
              sectionData={languagesSection!.section_data}
              onSave={(data) => handleSectionSave(languagesSection!.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl"
              >
                <p className="section-overline mb-2">Communication</p>
                <h2 className="section-heading text-4xl mb-10 text-foreground">Languages</h2>
                <div className="flex flex-wrap gap-4">
                  {(languagesSection!.section_data.languages || []).map((lang: any, i: number) => (
                    <div key={i} className="px-5 py-3 rounded-xl border border-border bg-card flex items-center gap-3">
                      <span className="text-lg">🌐</span>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{lang.name}</p>
                        <p className="text-xs text-muted-foreground">{lang.proficiency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </InlineEditWrapper>
      )}

      {/* Publications — FIX 4: hide empty for non-owners */}
      {((publicationsSection?.section_data?.publications?.length > 0) || (isOwner && publicationsSection)) && (isOwner || publicationsSection?.section_data?.publications?.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={publicationsSection!.id}
          sectionType="publications"
          sectionLabel="Publications"
          isEditing={editingSection === "publications"}
          onEditStart={() => setEditingSection("publications")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={() => handleRemoveSection(publicationsSection!.id)}
          isEmpty={!(publicationsSection!.section_data.publications || []).length}
          onMoveUp={() => handleMoveSection(publicationsSection!.id, "up")}
          onMoveDown={() => handleMoveSection(publicationsSection!.id, "down")}
          isFirst={getSectionPosition("publications").isFirst}
          isLast={getSectionPosition("publications").isLast}
          editForm={
            <PublicationsInlineEdit
              sectionData={publicationsSection!.section_data}
              onSave={(data) => handleSectionSave(publicationsSection!.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl"
              >
                <p className="section-overline mb-2">Writing & Research</p>
                <h2 className="section-heading text-4xl mb-10 text-foreground">Publications</h2>
                <div className="space-y-4">
                  {(publicationsSection!.section_data.publications || []).map((pub: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl border border-border bg-card flex items-start gap-4 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{pub.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {[pub.outlet, pub.year].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0">
                          Read →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </InlineEditWrapper>
      )}

      {/* Work Style — FIX 4: hide empty for non-owners */}
      {(workStyleDimensions.length > 0 || (isOwner && workStyleSection)) && (isOwner || workStyleDimensions.length > 0) && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={workStyleSection?.id || "workstyle"}
          sectionType="work_style"
          sectionLabel="Work Style"
          isEditing={editingSection === "work_style"}
          onEditStart={() => setEditingSection("work_style")}
          onEditEnd={() => setEditingSection(null)}
          onRemove={workStyleSection ? () => handleRemoveSection(workStyleSection.id) : undefined}
          isEmpty={workStyleDimensions.length === 0}
          onMoveUp={workStyleSection ? () => handleMoveSection(workStyleSection.id, "up") : undefined}
          onMoveDown={workStyleSection ? () => handleMoveSection(workStyleSection.id, "down") : undefined}
          isFirst={getSectionPosition("work_style").isFirst}
          isLast={getSectionPosition("work_style").isLast}
          editForm={
            <WorkStyleInlineEdit
              sectionData={workStyleSection?.section_data || {}}
              onSave={(data) => handleSectionSave(workStyleSection!.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <WorkStyleVisual
            dimensions={workStyleDimensions}
            traits={workStyleData?.traits || []}
          />
        </InlineEditWrapper>
      )}

      {/* Dynamic generic sections — render ALL other section types */}
      {genericSections.map((section) => {
        const template = sectionTemplates.find((t) => t.section_type === section.section_type);
        const displayName = template?.display_name || section.section_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const items = section.section_data?.items || section.section_data?.[section.section_type] || [];
        const hasItems = Array.isArray(items) && items.length > 0;
        const hasContent = hasItems || sectionHasContent(section);
        const sortedAll = [...sections].sort((a, b) => a.section_order - b.section_order);
        const globalIdx = sortedAll.findIndex((s) => s.id === section.id);

        return (
          <InlineEditWrapper
            key={section.id}
            isOwner={isOwner}
            sectionId={section.id}
            sectionType={section.section_type}
            sectionLabel={displayName}
            isEditing={editingSection === section.section_type}
            onEditStart={() => setEditingSection(section.section_type)}
            onEditEnd={() => setEditingSection(null)}
            onRemove={() => handleRemoveSection(section.id)}
            isEmpty={!hasContent}
            isCoreSection={false}
            onMoveUp={() => handleMoveSection(section.id, "up")}
            onMoveDown={() => handleMoveSection(section.id, "down")}
            isFirst={globalIdx === 0}
            isLast={globalIdx === sortedAll.length - 1}
            editForm={
              <GenericInlineEdit
                sectionData={section.section_data || {}}
                sectionType={section.section_type}
                displayName={displayName}
                onSave={(data) => handleSectionSave(section.id, data)}
                onCancel={() => setEditingSection(null)}
              />
            }
          >
            {hasContent ? (
              <GenericSectionRenderer
                sectionType={section.section_type}
                displayName={displayName}
                sectionData={section.section_data}
              />
            ) : null}
          </InlineEditWrapper>
        );
      })}

      {/* Add Section — bottom of profile, owner only */}
      {isOwner && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl">
              <button
                onClick={() => setShowAddSection(true)}
                className="w-full py-8 rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-6 h-6" />
                <span className="font-medium">Add a new section to your profile</span>
                <span className="text-xs text-muted-foreground">
                  Choose from {sectionTemplates.filter((t) => !t.is_core).length}+ section types for any industry
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="profile-footer">
        <div className="container mx-auto px-6 lg:px-8 flex justify-center">
          {!isOwner && (
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:shadow-lg transition-shadow"
            >
              <div className="w-5 h-5 rounded icon-gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">P</span>
              </div>
              <span className="text-xs text-muted-foreground">Built with Proof</span>
            </Link>
          )}
        </div>
      </div>

      {/* AI Career Coach - only for profile owner */}
      {isOwner && (
        <CareerCoachDrawer
          profileData={profile}
          sections={sections}
          activeSectionTypes={sections.map((s) => s.section_type)}
          onAddSection={() => setShowAddSection(true)}
        />
      )}
    </div>
  );
};

export default PublicProfile;
