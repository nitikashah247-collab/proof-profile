import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Linkedin,
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { ResumeUpload, ResumeData } from "@/components/onboarding/ResumeUpload";
import { PhotoUpload } from "@/components/onboarding/PhotoUpload";
import { AdaptiveInterview, type InterviewResponse } from "@/components/onboarding/AdaptiveInterview";
import { ArtifactUpload, type ArtifactFile } from "@/components/onboarding/ArtifactUpload";
import { ThemeCustomization, type ThemeSettings } from "@/components/onboarding/ThemeCustomization";
import {
  detectRoleCategory,
  type RoleCategory,
} from "@/lib/interviewQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Onboarding = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedMethods, setSelectedMethods] = useState<Set<"resume" | "linkedin">>(new Set());
  const [activeUpload, setActiveUpload] = useState<"resume" | "linkedin" | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeFileUrl, setResumeFileUrl] = useState<string | null>(null);
  const [resumeComplete, setResumeComplete] = useState(false);
  const [linkedinComplete, setLinkedinComplete] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinError, setLinkedinError] = useState("");
  const [roleCategory, setRoleCategory] = useState<RoleCategory>("general");
  const [interviewResponses, setInterviewResponses] = useState<InterviewResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedArtifacts, setUploadedArtifacts] = useState<ArtifactFile[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const navigate = useNavigate();

  const handleStartFresh = () => {
    setRoleCategory("general");
    setStep(2);
  };

  const toggleMethod = (method: "resume" | "linkedin") => {
    setSelectedMethods((prev) => {
      const next = new Set(prev);
      if (next.has(method)) {
        next.delete(method);
      } else {
        next.add(method);
      }
      return next;
    });
  };

  const handleProceedToUploads = () => {
    if (selectedMethods.size === 0) return;
    if (selectedMethods.has("resume")) {
      setActiveUpload("resume");
    } else if (selectedMethods.has("linkedin")) {
      setActiveUpload("linkedin");
    }
  };

  const handleResumeUploadDone = (data: ResumeData, fileUrl: string) => {
    setResumeData(data);
    setResumeFileUrl(fileUrl);
    setResumeComplete(true);
    if (selectedMethods.has("linkedin") && !linkedinComplete) {
      setActiveUpload("linkedin");
    } else {
      const detectedRole = detectRoleCategory(data);
      setRoleCategory(detectedRole);
      setStep(2);
    }
  };

  const handleLinkedinSkip = () => {
    setLinkedinComplete(true);
    if (resumeData) {
      const detectedRole = detectRoleCategory(resumeData);
      setRoleCategory(detectedRole);
      setStep(2);
    } else {
      handleStartFresh();
    }
  };

  const handleInterviewComplete = (responses: InterviewResponse[]) => {
    setInterviewResponses(responses);
    setStep(3); // Go to artifact upload
  };

  const handleArtifactComplete = async (artifacts: ArtifactFile[]) => {
    setUploadedArtifacts(artifacts);

    // Save artifacts to database if any
    if (artifacts.length > 0 && user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        const artifactRows = artifacts.map((a) => ({
          profile_id: profile.id,
          user_id: user.id,
          file_name: a.name,
          file_type: a.type,
          file_size: a.size,
          file_url: a.url,
        }));

        const { error } = await supabase
          .from("profile_artifacts")
          .insert(artifactRows);

        if (error) {
          console.error("Failed to save artifacts:", error);
        }
      }
    }

    setStep(4); // Go to theme selection
  };

  const handleThemeComplete = (settings: ThemeSettings) => {
    setThemeSettings(settings);
    setStep(5); // Go to generate
  };

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      // 1. Fetch the user's profile, or create one if it was deleted
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error("Could not load your profile. Please try again.");
      }

      if (!profile) {
        const userName = resumeData?.full_name || "";
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            full_name: userName,
            slug: userName ? undefined : undefined,
          })
          .select()
          .single();

        if (createError || !newProfile) {
          throw new Error("Failed to create profile. Please try again.");
        }
        profile = newProfile;
      }

      // 2. Convert interview responses to chat-like format for generate-profile
      const interviewMessages = interviewResponses
        .filter(r => !r.skipped)
        .flatMap(r => [
          { role: "ai" as const, content: r.questionText },
          { role: "user" as const, content: r.responseText },
        ]);

      console.log("Calling generate-profile with resume data and", interviewMessages.length, "interview messages");
      const genResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-profile`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeData,
            interviewMessages,
            roleCategory,
            themeSettings,
            artifacts: uploadedArtifacts.map(a => ({
              url: a.url,
              name: a.name,
              type: a.type,
            })),
          }),
        }
      );

      let generated: any = null;
      if (genResponse.ok) {
        const genResult = await genResponse.json();
        if (genResult.success) {
          generated = genResult.generated;
          console.log("AI generated profile content:", Object.keys(generated));
        } else {
          console.error("Generate profile failed:", genResult.error);
        }
      } else {
        console.error("Generate profile HTTP error:", genResponse.status);
      }

      // 3. Ensure profile has a slug
      let slug = profile.slug;
      if (!slug) {
        const name = resumeData?.full_name || profile.full_name || "";
        slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || `user-${user.id.substring(0, 8)}`;
      }

      // 4. Update profile with AI-generated or resume data
      const updatePayload: Record<string, unknown> = {
        onboarding_completed: true,
        slug,
        industry: resumeData?.industry || profile.industry,
        years_experience: generated?.hero_stats?.years_experience || resumeData?.years_experience || profile.years_experience,
        location: resumeData?.location || profile.location,
        bio: generated?.bio || resumeData?.bio || profile.bio,
        headline: generated?.headline || resumeData?.headline || profile.headline,
      };

      if (resumeData?.full_name && !profile.full_name) {
        updatePayload.full_name = resumeData.full_name;
      }
      if (avatarUrl) {
        updatePayload.avatar_url = avatarUrl;
      }
      // Save theme settings
      if (themeSettings) {
        updatePayload.theme_base = themeSettings.themeBase;
        updatePayload.theme_primary_color = themeSettings.primaryColor;
        updatePayload.theme_secondary_color = themeSettings.secondaryColor;
        updatePayload.banner_type = themeSettings.bannerType;
        updatePayload.banner_value = themeSettings.bannerValue;
        updatePayload.banner_url = themeSettings.bannerUrl || null;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", profile.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw new Error("Failed to update profile.");
      }

      // 5. Create a default profile version
      const { error: versionError } = await supabase
        .from("profile_versions")
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          version_name: "Base Profile",
          is_default: true,
          is_published: true,
          slug,
        });

      if (versionError) {
        console.error("Version creation error:", versionError);
      }

      // 5. Save career timeline from AI-enriched data or resume
      const timelineSource = generated?.career_timeline?.length > 0
        ? generated.career_timeline.map((entry: any, index: number) => ({
            user_id: user.id,
            profile_id: profile.id,
            role: entry.role,
            company: entry.company,
            start_date: entry.start_year || "2020",
            end_date: entry.end_year === "Present" ? null : entry.end_year,
            description: entry.achievements?.slice(0, 2).join(". ") || null,
            key_achievement: entry.achievements?.[0] || null,
            sort_order: index,
          }))
        : (resumeData?.roles || []).map((role: any, index: number) => ({
            user_id: user.id,
            profile_id: profile.id,
            role: role.title,
            company: role.company,
            start_date: role.start_date || "2020-01",
            end_date: role.end_date || null,
            description: role.description || null,
            key_achievement: role.key_achievement || null,
            sort_order: index,
          }));

      if (timelineSource.length > 0) {
        const { error: timelineError } = await supabase
          .from("career_timeline")
          .insert(timelineSource);
        if (timelineError) console.error("Timeline insert error:", timelineError);
      }

      // 6. Save skills (prefer AI-enriched skills with proof points)
      const skillsToSave = generated?.skills_with_proof?.length > 0
        ? generated.skills_with_proof.map((skill: any, index: number) => ({
            user_id: user.id,
            profile_id: profile.id,
            name: skill.name,
            category: skill.category || null,
            proficiency: Math.round((skill.level || 4) * 20),
            sort_order: index,
          }))
        : (resumeData?.skills || []).map((skill: any, index: number) => ({
            user_id: user.id,
            profile_id: profile.id,
            name: skill.name,
            category: skill.category || null,
            sort_order: index,
          }));

      if (skillsToSave.length > 0) {
        const { error: skillsError } = await supabase
          .from("skills")
          .insert(skillsToSave);
        if (skillsError) console.error("Skills insert error:", skillsError);
      }

      // 7. Save case studies
      if (generated?.case_studies?.length > 0) {
        const caseStudyEntries = generated.case_studies.map((cs: any, idx: number) => ({
          user_id: user.id,
          profile_id: profile.id,
          title: cs.title || `Case Study ${idx + 1}`,
          challenge: cs.challenge || "",
          approach: cs.approach || "",
          results: cs.results || "",
          metrics: cs.metrics || [],
          sort_order: idx,
        }));

        const { error: csError } = await supabase
          .from("case_studies")
          .insert(caseStudyEntries);
        if (csError) console.error("Case studies insert error:", csError);
      }

      // 8. Save testimonials
      if (generated?.testimonials?.length > 0) {
        const testimonialEntries = generated.testimonials.map((t: any, idx: number) => ({
          user_id: user.id,
          profile_id: profile.id,
          quote: t.quote,
          author_name: t.author,
          author_role: t.role || "",
          author_company: t.company || "",
          sort_order: idx,
        }));

        const { error: testError } = await supabase
          .from("testimonials")
          .insert(testimonialEntries);
        if (testError) console.error("Testimonials insert error:", testError);
      }

      // 9. Create profile_sections with rich data
      const sectionsToCreate: Array<{
        user_id: string;
        profile_id: string;
        section_type: string;
        section_order: number;
        section_data: any;
        is_visible: boolean;
      }> = [];

      // Use AI-determined section ordering
      const sectionOrder: string[] = generated?.section_order || [
        "hero", "impact_charts", "case_studies", "career_timeline", "skills_matrix",
      ];

      // Build a map of section type → section data
      const sectionDataMap: Record<string, { section_data: any; condition: boolean }> = {
        hero: {
          section_data: {
            positioning_statement: generated?.positioning_statement || "",
            hero_stats: generated?.hero_stats || null,
            email: user.email || "",
            linkedin_url: linkedinUrl || "",
            themeBase: themeSettings?.themeBase || "light",
          },
          condition: true,
        },
        impact_charts: {
          section_data: {
            metrics: generated?.impact_metrics || [],
            visualizations: generated?.visualizations || [],
          },
          condition: (generated?.visualizations?.length > 0 || generated?.impact_metrics?.length > 0),
        },
        case_studies: {
          section_data: {
            case_studies: generated?.case_studies || [],
          },
          condition: generated?.case_studies?.length > 0,
        },
        career_timeline: {
          section_data: {
            timeline: generated?.career_timeline || [],
          },
          condition: true,
        },
        skills_matrix: {
          section_data: {
            skills_with_proof: generated?.skills_with_proof || [],
          },
          condition: skillsToSave.length > 0,
        },
        languages: {
          section_data: { languages: generated?.languages || [] },
          condition: generated?.languages?.length > 0,
        },
        publications: {
          section_data: { publications: generated?.publications || [] },
          condition: generated?.publications?.length > 0,
        },
        work_style: {
          section_data: { work_style: generated?.work_style || {} },
          condition: generated?.work_style?.dimensions?.length > 0,
        },
      };

      let order = 0;

      // Add sections in AI-determined order first
      for (const sType of sectionOrder) {
        const entry = sectionDataMap[sType];
        if (entry && entry.condition) {
          sectionsToCreate.push({
            user_id: user.id,
            profile_id: profile.id,
            section_type: sType,
            section_order: order++,
            section_data: entry.section_data,
            is_visible: true,
          });
          delete sectionDataMap[sType];
        }
      }

      // Add remaining sections not in the AI order
      for (const [sType, entry] of Object.entries(sectionDataMap)) {
        if (entry.condition) {
          sectionsToCreate.push({
            user_id: user.id,
            profile_id: profile.id,
            section_type: sType,
            section_order: order++,
            section_data: entry.section_data,
            is_visible: true,
          });
        }
      }

      // Insert all sections
      if (sectionsToCreate.length > 0) {
        const { error: sectionsError } = await supabase
          .from("profile_sections")
          .insert(sectionsToCreate);

        if (sectionsError) console.error("Sections insert error:", sectionsError);
        else console.log("Created", sectionsToCreate.length, "profile sections");
      }

      // 10. Save interview responses
      if (interviewResponses.length > 0) {
        const answeredResponses = interviewResponses.filter(r => !r.skipped);
        const chatFormatMessages = answeredResponses.flatMap(r => [
          { role: "ai", content: r.questionText },
          { role: "user", content: r.responseText },
        ]);

        const { error: convoError } = await supabase
          .from("onboarding_conversations")
          .insert([{
            user_id: user.id,
            messages: JSON.parse(JSON.stringify(chatFormatMessages)),
            status: "completed",
            extracted_data: resumeData ? JSON.parse(JSON.stringify(resumeData)) : null,
          }]);

        if (convoError) console.error("Conversation save error:", convoError);

        // Also save individual responses to interview_responses table
        const responseRows = interviewResponses.map(r => ({
          user_id: user.id,
          profile_id: profile.id,
          question_id: r.questionId,
          question_text: r.questionText,
          question_category: r.questionCategory,
          response_text: r.responseText || null,
          response_method: r.responseMethod,
          skipped: r.skipped,
        }));

        const { error: respError } = await supabase
          .from("interview_responses")
          .insert(responseRows);

        if (respError) console.error("Interview responses save error:", respError);
      }

      setIsGenerating(false);

      toast({
        title: "Your profile is live! 🎉",
        description: "You can now share it with anyone.",
      });

      navigate(`/p/${slug}`);
    } catch (err) {
      console.error("Profile generation error:", err);
      setIsGenerating(false);
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg icon-gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">Proof</span>
            </div>

            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 5 && (
                    <div
                      className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Upload */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold mb-4">
                  Let's build your <span className="text-primary">Proof</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  How would you like to get started?
                </p>

                {/* Profile Photo Upload */}
                <div className="mb-8">
                  <PhotoUpload onUpload={setAvatarUrl} currentUrl={avatarUrl || undefined} />
                </div>

                {!activeUpload ? (
                  <div className="space-y-8">
                    {/* Selection cards */}
                    <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      {[
                        {
                          id: "resume" as const,
                          icon: FileText,
                          title: "Upload Resume",
                          description: "Drop a PDF or DOCX and we'll extract everything",
                        },
                        {
                          id: "linkedin" as const,
                          icon: Linkedin,
                          title: "Import LinkedIn",
                          description: "Paste your LinkedIn profile URL",
                        },
                      ].map((option) => (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleMethod(option.id)}
                          className={`p-6 rounded-2xl border-2 text-left transition-all relative ${
                            selectedMethods.has(option.id)
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          {selectedMethods.has(option.id) && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                            <option.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-1">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </motion.button>
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Select one or both — more data means a better profile
                    </p>

                    <div className="flex flex-col items-center gap-3">
                      <Button
                        size="lg"
                        onClick={handleProceedToUploads}
                        disabled={selectedMethods.size === 0}
                        className="group"
                      >
                        Continue
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={handleStartFresh}
                        className="text-muted-foreground"
                      >
                        Skip — start from scratch
                      </Button>
                    </div>
                  </div>
                ) : activeUpload === "resume" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg mx-auto"
                  >
                    <ResumeUpload onComplete={handleResumeUploadDone} />
                    <div className="text-center mt-6">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveUpload(null)}
                        className="text-muted-foreground"
                      >
                        ← Back to options
                      </Button>
                    </div>
                  </motion.div>
                ) : activeUpload === "linkedin" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-lg mx-auto"
                  >
                    {resumeComplete && (
                      <div className="flex items-center gap-2 justify-center mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Resume uploaded successfully</span>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-left">Paste your LinkedIn profile URL</label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => {
                            setLinkedinUrl(e.target.value);
                            setLinkedinError("");
                          }}
                          placeholder="https://linkedin.com/in/yourname"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {linkedinError && (
                          <p className="text-sm text-destructive mt-1">{linkedinError}</p>
                        )}
                      </div>
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => setActiveUpload(null)}
                          className="text-muted-foreground"
                        >
                          ← Back
                        </Button>
                        <Button onClick={() => {
                          if (linkedinUrl.trim()) {
                            const urlPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
                            if (!urlPattern.test(linkedinUrl.trim())) {
                              setLinkedinError("Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/yourname)");
                              return;
                            }
                          }
                          setLinkedinComplete(true);
                          if (resumeData) {
                            const detectedRole = detectRoleCategory(resumeData);
                            setRoleCategory(detectedRole);
                            setStep(2);
                          } else {
                            handleStartFresh();
                          }
                        }}>
                          {linkedinUrl.trim() ? "Continue" : "Skip LinkedIn"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            )}

            {/* Step 2: Adaptive AI Interview */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdaptiveInterview
                  resumeData={resumeData}
                  roleCategory={roleCategory}
                  onComplete={handleInterviewComplete}
                />
              </motion.div>
            )}

            {/* Step 3: Artifact Upload */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ArtifactUpload
                  userId={user?.id || ""}
                  profileId=""
                  onComplete={handleArtifactComplete}
                />
              </motion.div>
            )}

            {/* Step 4: Theme Customization */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeCustomization
                  userId={user?.id || ""}
                  onComplete={handleThemeComplete}
                />
              </motion.div>
            )}

            {/* Step 5: Generate */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-xl mx-auto"
              >
                {!isGenerating ? (
                  <>
                    <div className="w-20 h-20 rounded-2xl icon-gradient-bg flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/25">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">
                      Ready to generate your{" "}
                      <span className="text-primary">Proof</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                      We'll create your professional profile based on everything you've shared
                    </p>

                    <div className="space-y-4 mb-12">
                      {resumeData && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                          <div className="w-10 h-10 rounded-lg bg-proof-success/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-proof-success" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Resume analysed</p>
                            <p className="text-sm text-muted-foreground">
                              {resumeData.full_name} — {resumeData.roles?.length || 0} roles extracted
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                        <div className="w-10 h-10 rounded-lg bg-proof-success/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-proof-success" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Profile information captured</p>
                          <p className="text-sm text-muted-foreground">
                            From your {resumeData ? "resume and " : ""}interview
                          </p>
                        </div>
                      </div>
                      {themeSettings && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                          <div className="w-10 h-10 rounded-lg bg-proof-success/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-proof-success" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">
                              {themeSettings.themeBase === "dark" ? "Dark" : "Light"} theme customized
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Your profile will match your chosen style
                            </p>
                          </div>
                        </div>
                      )}
                      {uploadedArtifacts.length > 0 && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                          <div className="w-10 h-10 rounded-lg bg-proof-success/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-proof-success" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{uploadedArtifacts.length} artifact{uploadedArtifacts.length > 1 ? "s" : ""} uploaded</p>
                            <p className="text-sm text-muted-foreground">
                              Will be analyzed and embedded in your profile
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      size="xl"
                      onClick={handleGenerate}
                      className="group"
                    >
                      Generate my Proof
                      <Sparkles className="w-5 h-5 ml-2" />
                    </Button>
                  </>
                ) : (
                  <div className="py-12">
                    <div className="w-24 h-24 rounded-full icon-gradient-bg flex items-center justify-center mx-auto mb-8 animate-pulse">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Crafting your Proof...
                    </h2>
                    <p className="text-muted-foreground">
                      Our AI is analysing your information and building your profile
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
