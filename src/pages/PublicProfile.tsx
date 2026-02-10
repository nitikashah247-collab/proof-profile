import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Briefcase, Award, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CaseStudy {
  id: string;
  title: string;
  challenge: string;
  approach: string;
  results: string;
  metrics: Array<{ label: string; value: string }>;
}

interface TimelineEntry {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  key_achievement: string | null;
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
}

interface ProfileSection {
  id: string;
  section_type: string;
  section_order: number;
  is_visible: boolean;
  section_data: Record<string, any>;
}

const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

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

      // Fetch all related data in parallel
      const [sectionsRes, timelineRes, skillsRes, caseStudiesRes] = await Promise.all([
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
      ]);

      setSections((sectionsRes.data as ProfileSection[]) || []);
      setTimeline((timelineRes.data as TimelineEntry[]) || []);
      setSkills((skillsRes.data as Skill[]) || []);
      setCaseStudies((caseStudiesRes.data as unknown as CaseStudy[]) || []);
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

  // Find section data by type
  const getSection = (type: string) => sections.find((s) => s.section_type === type);
  const heroSection = getSection("hero");
  const impactSection = getSection("impact_charts");
  const skillsSection = getSection("skills_matrix");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-2xl icon-gradient-bg flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white shadow-2xl shadow-primary/20">
              {profile.full_name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?"}
            </div>
            <h1 className="text-4xl font-bold mb-2">{profile.full_name}</h1>
            {profile.headline && (
              <p className="text-xl text-muted-foreground mb-3">{profile.headline}</p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              {profile.industry && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {profile.industry}
                </span>
              )}
              {profile.years_experience && (
                <span>{profile.years_experience}+ years experience</span>
              )}
            </div>
            {profile.bio && (
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-4 leading-relaxed">
                {profile.bio}
              </p>
            )}
            {heroSection?.section_data?.positioning_statement && (
              <p className="text-base text-primary font-medium max-w-xl mx-auto italic">
                "{heroSection.section_data.positioning_statement}"
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl pb-24 space-y-16">
        {/* Impact Metrics */}
        {impactSection?.section_data?.metrics?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Impact & Results
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {impactSection.section_data.metrics.map((metric: any, i: number) => (
                <Card key={i} className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{metric.value}</p>
                  <p className="text-sm font-medium">{metric.label}</p>
                  {metric.context && (
                    <p className="text-xs text-muted-foreground mt-1">{metric.context}</p>
                  )}
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Career Timeline */}
        {timeline.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Career Timeline
            </h2>
            <div className="space-y-6">
              {timeline.map((entry) => (
                <div key={entry.id} className="relative pl-8 border-l-2 border-border pb-6 last:pb-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary" />
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{entry.role}</h3>
                    <span className="text-muted-foreground">at {entry.company}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {entry.start_date} — {entry.end_date || "Present"}
                  </p>
                  {entry.description && (
                    <p className="text-sm text-foreground/70 mb-1">{entry.description}</p>
                  )}
                  {entry.key_achievement && (
                    <p className="text-sm text-primary font-medium flex items-start gap-1">
                      <Award className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      {entry.key_achievement}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Case Studies */}
        {caseStudies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Case Studies
            </h2>
            <div className="space-y-6">
              {caseStudies.map((cs) => (
                <Card key={cs.id} className="p-6">
                  <h3 className="text-lg font-bold mb-4">{cs.title}</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {cs.challenge && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Challenge</p>
                        <p className="text-sm">{cs.challenge}</p>
                      </div>
                    )}
                    {cs.approach && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Approach</p>
                        <p className="text-sm">{cs.approach}</p>
                      </div>
                    )}
                    {cs.results && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Results</p>
                        <p className="text-sm">{cs.results}</p>
                      </div>
                    )}
                  </div>
                  {cs.metrics && Array.isArray(cs.metrics) && cs.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                      {cs.metrics.map((m: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {m.label}: <span className="font-bold ml-1">{m.value}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
            {(() => {
              // Group skills by category
              const grouped = skills.reduce((acc, skill) => {
                const cat = skill.category || "General";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(skill);
                return acc;
              }, {} as Record<string, Skill[]>);

              const proofPoints = skillsSection?.section_data?.skills_with_proof || [];
              const proofMap = new Map(proofPoints.map((s: any) => [s.name, s.proof_point]));

              return (
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(grouped).map(([category, catSkills]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map((skill) => (
                          <div key={skill.id} className="group relative">
                            <Badge variant="outline" className="cursor-default">
                              {skill.name}
                            </Badge>
                            {proofMap.get(skill.name) && (
                              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 bg-popover border border-border rounded-lg p-2 text-xs max-w-[200px] shadow-lg">
                                {proofMap.get(skill.name) as string}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </motion.section>
        )}
      </div>

      {/* Proof Badge */}
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
    </div>
  );
};

export default PublicProfile;
