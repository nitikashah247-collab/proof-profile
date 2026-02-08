import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Linkedin,
  Sparkles,
  Send,
  Check,
  ArrowRight,
  User,
  Briefcase,
  Code,
  Megaphone,
  LineChart,
} from "lucide-react";
import { ResumeUpload, ResumeData } from "@/components/onboarding/ResumeUpload";
import { VoiceMemo } from "@/components/onboarding/VoiceMemo";
import {
  detectRoleCategory,
  getQuestionsForRole,
  findFollowUp,
  type RoleCategory,
  type InterviewQuestion,
} from "@/lib/interviewQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const archetypes = [
  {
    id: "executive",
    name: "Executive",
    icon: Briefcase,
    description: "Dark, data-driven, authoritative",
    color: "from-slate-500 to-slate-700",
  },
  {
    id: "creative",
    name: "Creative",
    icon: Megaphone,
    description: "Bold, visual, personality-forward",
    color: "from-orange-500 to-pink-500",
  },
  {
    id: "technical",
    name: "Technical",
    icon: Code,
    description: "Structured, systems-thinking",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "sales",
    name: "Sales",
    icon: LineChart,
    description: "Results-focused, high energy",
    color: "from-amber-500 to-red-500",
  },
  {
    id: "operations",
    name: "Operations",
    icon: User,
    description: "Precise, process-oriented",
    color: "from-emerald-500 to-teal-500",
  },
];

const Onboarding = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedMethods, setSelectedMethods] = useState<Set<"resume" | "linkedin">>(new Set());
  const [activeUpload, setActiveUpload] = useState<"resume" | "linkedin" | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeFileUrl, setResumeFileUrl] = useState<string | null>(null);
  const [resumeComplete, setResumeComplete] = useState(false);
  const [linkedinComplete, setLinkedinComplete] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "ai" | "user"; content: string }>>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [roleCategory, setRoleCategory] = useState<RoleCategory>("general");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [pendingFollowUp, setPendingFollowUp] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const buildInitialMessages = (data: ResumeData | null, role: RoleCategory, roleQuestions: InterviewQuestion[]): Array<{ role: "ai" | "user"; content: string }> => {
    const roleName = role === "general" ? "professional" : role;
    
    if (data && data.full_name) {
      const rolesSummary = data.roles?.slice(0, 2).map((r) => `${r.title} at ${r.company}`).join(", ") || "your experience";
      return [
        {
          role: "ai",
          content: `Great, I've analysed your resume, ${data.full_name}! I can see you've worked as ${rolesSummary}. I've tailored my questions for your ${roleName} background — let's surface the stories that make you stand out.`,
        },
        { role: "ai", content: roleQuestions[0].question },
      ];
    }
    return [
      { role: "ai", content: `Hi! I'm here to help surface the stories and achievements that make you stand out. I'll ask questions tailored for ${roleName} professionals. Let's start!` },
      { role: "ai", content: roleQuestions[0].question },
    ];
  };



  const handleStartFresh = () => {
    const roleQuestions = getQuestionsForRole("general");
    setQuestions(roleQuestions);
    setRoleCategory("general");
    const initialMessages = buildInitialMessages(null, "general", roleQuestions);
    setChatMessages(initialMessages);
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
    // Show the first selected upload
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
    // If LinkedIn is also selected and not done, show that next
    if (selectedMethods.has("linkedin") && !linkedinComplete) {
      setActiveUpload("linkedin");
    } else {
      // All uploads done, proceed to interview
      const detectedRole = detectRoleCategory(data);
      setRoleCategory(detectedRole);
      const roleQuestions = getQuestionsForRole(detectedRole);
      setQuestions(roleQuestions);
      const initialMessages = buildInitialMessages(data, detectedRole, roleQuestions);
      setChatMessages(initialMessages);
      setStep(2);
    }
  };

  const handleLinkedinSkip = () => {
    setLinkedinComplete(true);
    if (resumeData) {
      const detectedRole = detectRoleCategory(resumeData);
      setRoleCategory(detectedRole);
      const roleQuestions = getQuestionsForRole(detectedRole);
      setQuestions(roleQuestions);
      const initialMessages = buildInitialMessages(resumeData, detectedRole, roleQuestions);
      setChatMessages(initialMessages);
      setStep(2);
    } else {
      handleStartFresh();
    }
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || currentInput;
    if (!text.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: text }]);
    setCurrentInput("");

    setTimeout(() => {
      const currentQuestion = questions[questionIndex];
      
      // Check for adaptive follow-up based on user response
      if (!pendingFollowUp && currentQuestion) {
        const followUp = findFollowUp(currentQuestion, text);
        if (followUp) {
          setPendingFollowUp(true);
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", content: "That's fascinating — let me dig deeper on that..." },
            { role: "ai", content: followUp },
          ]);
          return;
        }
      }

      // Reset follow-up state
      setPendingFollowUp(false);

      if (questionIndex < questions.length - 1) {
        const nextIdx = questionIndex + 1;
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "Great insight! Let me ask you something else..." },
          { role: "ai", content: questions[nextIdx].question },
        ]);
        setQuestionIndex(nextIdx);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "Brilliant! I've got everything I need. Let's move on to choosing your profile style." },
        ]);
        setTimeout(() => setStep(3), 1500);
      }
    }, 800);
  };

  const handleVoiceTranscript = (text: string) => {
    setCurrentInput(text);
    // Auto-send after a brief delay so user can see the transcript
    setTimeout(() => {
      handleSendMessage(text);
    }, 500);
  };

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      // 1. Fetch the user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        throw new Error("Could not find your profile. Please try again.");
      }

      // 2. Update profile with resume data & mark onboarding complete
      const updatePayload: Record<string, unknown> = {
        onboarding_completed: true,
        industry: resumeData?.industry || profile.industry,
        years_experience: resumeData?.years_experience || profile.years_experience,
        location: resumeData?.location || profile.location,
        bio: resumeData?.bio || profile.bio,
        headline: resumeData?.headline || profile.headline,
      };

      if (resumeData?.full_name && !profile.full_name) {
        updatePayload.full_name = resumeData.full_name;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", profile.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw new Error("Failed to update profile.");
      }

      // 3. Create a default profile version
      const { error: versionError } = await supabase
        .from("profile_versions")
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          version_name: "Base Profile",
          is_default: true,
          is_published: true,
          slug: profile.slug,
        });

      if (versionError) {
        console.error("Version creation error:", versionError);
        // Don't throw — profile is saved, version is secondary
      }

      // 4. Save career timeline from resume
      if (resumeData?.roles && resumeData.roles.length > 0) {
        const timelineEntries = resumeData.roles.map((role, index) => ({
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

        const { error: timelineError } = await supabase
          .from("career_timeline")
          .insert(timelineEntries);

        if (timelineError) console.error("Timeline insert error:", timelineError);
      }

      // 5. Save skills from resume
      if (resumeData?.skills && resumeData.skills.length > 0) {
        const skillEntries = resumeData.skills.map((skill, index) => ({
          user_id: user.id,
          profile_id: profile.id,
          name: skill.name,
          category: skill.category || null,
          sort_order: index,
        }));

        const { error: skillsError } = await supabase
          .from("skills")
          .insert(skillEntries);

        if (skillsError) console.error("Skills insert error:", skillsError);
      }

      // 6. Save interview conversation
      if (chatMessages.length > 0) {
        const { error: convoError } = await supabase
          .from("onboarding_conversations")
          .insert([{
            user_id: user.id,
            messages: JSON.parse(JSON.stringify(chatMessages)),
            status: "completed",
            extracted_data: resumeData ? JSON.parse(JSON.stringify(resumeData)) : null,
          }]);

        if (convoError) console.error("Conversation save error:", convoError);
      }

      setIsGenerating(false);

      toast({
        title: "Your profile is live! 🎉",
        description: "You can now share it with anyone.",
      });

      // Redirect to their public profile
      navigate(`/p/${profile.slug}`);
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
              {[1, 2, 3, 4].map((s) => (
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
                  {s < 4 && (
                    <div
                      className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`}
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
                <p className="text-xl text-muted-foreground mb-12">
                  How would you like to get started?
                </p>

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
                          description: "Paste your profile URL (coming soon)",
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
                    className="max-w-lg mx-auto text-center"
                  >
                    {resumeComplete && (
                      <div className="flex items-center gap-2 justify-center mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Resume uploaded successfully</span>
                      </div>
                    )}
                    <p className="text-muted-foreground mb-4">
                      LinkedIn import is coming soon. You can skip this step for now.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveUpload(null)}
                        className="text-muted-foreground"
                      >
                        ← Back
                      </Button>
                      <Button onClick={handleLinkedinSkip}>
                        Continue without LinkedIn
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            )}

            {/* Step 2: AI Chat */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    AI Interview
                  </div>
                  <h1 className="text-3xl font-bold mb-2">
                    Let's surface your best stories
                  </h1>
                  <p className="text-muted-foreground">
                    {resumeData
                      ? `We've tailored questions for your ${roleCategory === "general" ? "professional" : roleCategory} background. Answer a few more to go deeper.`
                      : "Answer a few questions to help me understand your impact"}
                  </p>
                </div>

                {/* Chat Window */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          }`}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-border p-4 space-y-3">
                    <p className="text-xs text-muted-foreground text-center">
                      💬 Type your answer or 🎤 record a voice memo (faster and easier!)
                    </p>
                    <div className="flex items-center gap-3">
                      <Textarea
                        placeholder="Type your answer..."
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 resize-none bg-muted/50 border-0 focus-visible:ring-1"
                        rows={2}
                      />
                      <Button
                        size="icon"
                        onClick={() => handleSendMessage()}
                        disabled={!currentInput.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                    <VoiceMemo onTranscript={handleVoiceTranscript} />
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(3)}
                    className="text-muted-foreground"
                  >
                    Skip for now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Archetype Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold mb-4">
                  Choose your <span className="text-primary">style</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-12">
                  Select the archetype that best represents your professional identity
                </p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-12">
                  {archetypes.map((archetype) => (
                    <motion.button
                      key={archetype.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedArchetype(archetype.id)}
                      className={`p-6 rounded-2xl border text-center transition-all ${
                        selectedArchetype === archetype.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${archetype.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <archetype.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{archetype.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {archetype.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <Button
                  size="xl"
                  onClick={() => setStep(4)}
                  disabled={!selectedArchetype}
                  className="group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            )}

            {/* Step 4: Generate */}
            {step === 4 && (
              <motion.div
                key="step4"
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
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                        <div className="w-10 h-10 rounded-lg bg-proof-success/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-proof-success" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">
                            {archetypes.find((a) => a.id === selectedArchetype)?.name} style selected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your profile will match this aesthetic
                          </p>
                        </div>
                      </div>
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
