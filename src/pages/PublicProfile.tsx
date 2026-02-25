import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Users, Zap, Brain, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
} from "@/components/profile/inline-editors";

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
      setIsOwner(!!user && data.user_id === user.id);
      // Fetch all related data in parallel
      const [sectionsRes, timelineRes, skillsRes, caseStudiesRes, testimonialsRes] = await Promise.all([
        supabase
          .from("profile_sections")
          .select("*")
          .eq("profile_id", data.id)
          .eq("is_visible", true)
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

      setSections((sectionsRes.data as ProfileSection[]) || []);
      setTimeline(timelineRes.data || []);
      setSkills(skillsRes.data || []);
      setCaseStudies(caseStudiesRes.data || []);
      setTestimonials(testimonialsRes.data || []);
      setLoading(false);
    };

    fetchProfile();
  }, [slug, user]);

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
    }
    setEditingSection(null);
  };

  const handleCaseStudySave = async (newData: Record<string, any>) => {
    if (caseStudiesSection) {
      await handleSectionSave(caseStudiesSection.id, newData);
    } else if (profile && user) {
      // No profile_sections row exists yet — create one
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
    await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id);
  };

  const handleHeroSave = async (profileUpdates: Record<string, any>, sectionUpdates: Record<string, any>) => {
    await handleProfileFieldSave(profileUpdates);
    const heroSec = sections.find((s) => s.section_type === "hero");
    if (heroSec) {
      await handleSectionSave(heroSec.id, sectionUpdates);
    }
    setEditingSection(null);
  };

  // Apply custom theme from profile settings
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

  return (
    <div className="min-h-screen bg-background text-foreground" style={themeStyle}>
      {/* Owner controls */}
      {isOwner && <ProfileOwnerBar />}

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
        onSave={handleSectionSave}
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
          skills={skillNames.slice(0, 7)}
          activeSkill={activeSkill}
          onSkillClick={setActiveSkill}
          stats={normalizedHeroStats}
          email={heroSection?.section_data?.email || ""}
          calendlyUrl={heroSection?.section_data?.calendly_url || ""}
          linkedinUrl={heroSection?.section_data?.linkedin_url || ""}
        />
      </InlineEditWrapper>

      {/* Impact Charts */}
      {visualizations.length > 0 && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={impactSection?.id || "impact"}
          sectionType="impact_charts"
          sectionLabel="Impact Metrics"
          isEditing={editingSection === "impact_charts"}
          onEditStart={() => setEditingSection("impact_charts")}
          onEditEnd={() => setEditingSection(null)}
          onSave={handleSectionSave}
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

      {/* Case Studies */}
      {finalCaseStudyCards.length > 0 && (() => {
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
            onSave={handleSectionSave}
            editForm={
              <CaseStudyInlineEdit
                sectionData={caseStudiesSection?.section_data || {}}
                onSave={handleCaseStudySave}
                onCancel={() => setEditingSection(null)}
              />
            }
          >
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-5xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-foreground">Impact Stories</h2>
                      <p className="text-muted-foreground">
                        {activeSkill
                          ? `Showing ${filteredCaseStudies.length} stories related to "${activeSkill}"`
                          : "Click a skill above to filter by expertise"}
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

      {/* Career Timeline */}
      {timelineEntries.length > 0 && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={timelineSection?.id || "timeline"}
          sectionType="career_timeline"
          sectionLabel="Career Journey"
          isEditing={editingSection === "career_timeline"}
          onEditStart={() => setEditingSection("career_timeline")}
          onEditEnd={() => setEditingSection(null)}
          onSave={handleSectionSave}
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

      {/* Skills Matrix */}
      {skillsData.length > 0 && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={skillsSection?.id || "skills"}
          sectionType="skills_matrix"
          sectionLabel="Skills"
          isEditing={editingSection === "skills_matrix"}
          onEditStart={() => setEditingSection("skills_matrix")}
          onEditEnd={() => setEditingSection(null)}
          onSave={handleSectionSave}
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

      {/* Testimonials */}
      {testimonialCards.length > 0 && (
        <TestimonialsCarousel testimonials={testimonialCards} />
      )}

      {/* Languages */}
      {languagesSection?.section_data?.languages?.length > 0 && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={languagesSection.id}
          sectionType="languages"
          sectionLabel="Languages"
          isEditing={editingSection === "languages"}
          onEditStart={() => setEditingSection("languages")}
          onEditEnd={() => setEditingSection(null)}
          onSave={handleSectionSave}
          editForm={
            <LanguagesInlineEdit
              sectionData={languagesSection.section_data}
              onSave={(data) => handleSectionSave(languagesSection.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl"
              >
                <h2 className="text-3xl font-bold mb-8 text-foreground">Languages</h2>
                <div className="flex flex-wrap gap-4">
                  {languagesSection.section_data.languages.map((lang: any, i: number) => (
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

      {/* Publications */}
      {publicationsSection?.section_data?.publications?.length > 0 && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={publicationsSection.id}
          sectionType="publications"
          sectionLabel="Publications"
          isEditing={editingSection === "publications"}
          onEditStart={() => setEditingSection("publications")}
          onEditEnd={() => setEditingSection(null)}
          onSave={handleSectionSave}
          editForm={
            <PublicationsInlineEdit
              sectionData={publicationsSection.section_data}
              onSave={(data) => handleSectionSave(publicationsSection.id, data)}
              onCancel={() => setEditingSection(null)}
            />
          }
        >
          <section className="py-16">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl"
              >
                <h2 className="text-3xl font-bold mb-8 text-foreground">Publications</h2>
                <div className="space-y-4">
                  {publicationsSection.section_data.publications.map((pub: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-card flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{pub.title}</p>
                        <p className="text-xs text-muted-foreground">
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

      {/* Work Style */}
      {workStyleDimensions.length > 0 && (
        <InlineEditWrapper
          isOwner={isOwner}
          sectionId={workStyleSection?.id || "workstyle"}
          sectionType="work_style"
          sectionLabel="Work Style"
          isEditing={editingSection === "work_style"}
          onEditStart={() => setEditingSection("work_style")}
          onEditEnd={() => setEditingSection(null)}
          onSave={handleSectionSave}
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

      {/* Proof Badge */}
      {!isOwner && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-5 h-5 rounded icon-gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">P</span>
            </div>
            <span className="text-sm font-medium text-foreground">Made with Proof</span>
          </Link>
        </div>
      )}

      {/* AI Career Coach - only for profile owner */}
      {isOwner && (
        <CareerCoachDrawer
          profileData={profile}
          sections={sections}
          activeSectionTypes={sections.map((s) => s.section_type)}
          onAddSection={() => {}}
        />
      )}
    </div>
  );
};

export default PublicProfile;
