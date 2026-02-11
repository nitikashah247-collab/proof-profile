import { useState, useEffect } from "react";
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
  }, [slug]);

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
  const heroStats = heroSection?.section_data?.hero_stats || {
    yearsExperience: profile.years_experience || 5,
    projectsLed: 20,
    teamsManaged: 10,
    keyMetric: { value: 0, label: "Projects", suffix: "+" },
  };

  const normalizedHeroStats = {
    yearsExperience: heroStats.years_experience || heroStats.yearsExperience || profile.years_experience || 5,
    projectsLed: heroStats.projects_led || heroStats.projectsLed || 20,
    teamsManaged: heroStats.people_managed || heroStats.teamsManaged || 10,
    keyMetric: heroStats.key_metric || heroStats.keyMetric || { value: 0, label: "Projects", suffix: "+" },
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

  // Deduplicate skills
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

  // Build case studies for CaseStudyCard (matching demo format)
  const caseStudyCards = caseStudies.map((cs) => ({
    title: cs.title,
    company: "—",
    keyMetric: cs.metrics?.[0]?.value || "✓",
    summary: cs.challenge?.substring(0, 100) || cs.title,
    challenge: cs.challenge || "",
    approach: cs.approach || "",
    outcome: cs.results || "",
    skills: cs.metrics?.map((m: any) => m.label) || [],
  }));

  // Use AI-enriched case studies from section_data if available (they have company + skills_used)
  const enrichedCaseStudies = caseStudiesSection?.section_data?.case_studies;
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
      }))
    : caseStudyCards;

  // Filter case studies by active skill
  const filteredCaseStudies = activeSkill
    ? finalCaseStudyCards.filter((cs: any) => cs.skills.includes(activeSkill))
    : finalCaseStudyCards;

  // Build timeline for CareerTimeline (matching demo format)
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

  // Build testimonials for TestimonialsCarousel
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

  // Determine archetype from hero section or industry
  const archetype = heroSection?.section_data?.archetype || "";

  // Map archetype to theme class for full-page styling
  const archetypeThemeMap: Record<string, string> = {
    executive: "theme-executive",
    creative: "theme-creative",
    technical: "theme-technical",
    sales: "theme-sales",
    operations: "theme-operations",
  };
  const themeClass = archetypeThemeMap[archetype] || "";

  return (
    <div className={`min-h-screen bg-background ${themeClass}`}>
      {/* Owner controls */}
      {isOwner && <ProfileOwnerBar />}

      {/* Cover Banner */}
      <CoverBanner archetype={archetype} bannerUrl={profile.banner_url || undefined} />

      {/* Hero Section - same as demos */}
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

      {/* Impact Charts - AI-generated visualizations */}
      {visualizations.length > 0 && (
        <DynamicImpactCharts visualizations={visualizations} />
      )}

      {/* Case Studies - expandable cards like demos (limit to 5) */}
      {finalCaseStudyCards.length > 0 && (() => {
        const limitedCaseStudies = finalCaseStudyCards.slice(0, 5);
        const limitedFiltered = activeSkill
          ? limitedCaseStudies.filter((cs: any) => cs.skills.includes(activeSkill))
          : limitedCaseStudies;
        return (
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
                  <h2 className="text-3xl font-bold mb-2">Impact Stories</h2>
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
        );
      })()}

      {/* Career Timeline - interactive nodes like demos (limit to 6 roles) */}
      {timelineEntries.length > 0 && (
        <CareerTimeline entries={timelineEntries.slice(0, 6)} />
      )}

      {/* Skills Matrix - visual grid with proficiency bars */}
      {skillsData.length > 0 && (
        <SkillsMatrix
          skills={skillsData}
          activeSkill={activeSkill}
          onSkillClick={setActiveSkill}
        />
      )}

      {/* Testimonials Carousel */}
      {testimonialCards.length > 0 && (
        <TestimonialsCarousel testimonials={testimonialCards} />
      )}

      {/* Languages */}
      {languagesSection?.section_data?.languages?.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl"
            >
              <h2 className="text-3xl font-bold mb-8">Languages</h2>
              <div className="flex flex-wrap gap-4">
                {languagesSection.section_data.languages.map((lang: any, i: number) => (
                  <div key={i} className="px-5 py-3 rounded-xl border border-border bg-card flex items-center gap-3">
                    <span className="text-lg">🌐</span>
                    <div>
                      <p className="font-semibold text-sm">{lang.name}</p>
                      <p className="text-xs text-muted-foreground">{lang.proficiency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Publications */}
      {publicationsSection?.section_data?.publications?.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl"
            >
              <h2 className="text-3xl font-bold mb-8">Publications</h2>
              <div className="space-y-4">
                {publicationsSection.section_data.publications.map((pub: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{pub.title}</p>
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
      )}

      {/* Work Style */}
      {workStyleDimensions.length > 0 && (
        <WorkStyleVisual
          dimensions={workStyleDimensions}
          traits={workStyleData?.traits || []}
        />
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
            <span className="text-sm font-medium">Made with Proof</span>
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
