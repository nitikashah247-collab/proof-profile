import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  Upload,
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

const chatQuestions = [
  "Tell me about a project you're most proud of and why?",
  "What do people come to you for? What's your edge?",
  "Walk me through a time you had to influence without authority.",
  "What metrics or outcomes best demonstrate your impact?",
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState<"resume" | "linkedin" | "manual" | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "ai" | "user"; content: string }>>([
    { role: "ai", content: "Hi! I'm here to help surface the stories and achievements that make you stand out. Let's start with something you're proud of." },
    { role: "ai", content: chatQuestions[0] },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    setChatMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setCurrentInput("");

    // Simulate AI response
    setTimeout(() => {
      if (questionIndex < chatQuestions.length - 1) {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "That's great insight! Let me ask you another question..." },
          { role: "ai", content: chatQuestions[questionIndex + 1] },
        ]);
        setQuestionIndex((prev) => prev + 1);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: "Perfect! I've got everything I need. Let's move on to choosing your profile style." },
        ]);
        setTimeout(() => setStep(3), 1500);
      }
    }, 1000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsGenerating(false);
    navigate("/demo");
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

            {/* Progress Steps */}
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
                      className={`w-12 h-0.5 ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
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

                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  {[
                    {
                      id: "resume" as const,
                      icon: FileText,
                      title: "Upload Resume",
                      description: "Drop a PDF and we'll extract everything",
                    },
                    {
                      id: "linkedin" as const,
                      icon: Linkedin,
                      title: "Import LinkedIn",
                      description: "Paste your profile URL",
                    },
                    {
                      id: "manual" as const,
                      icon: Upload,
                      title: "Start Fresh",
                      description: "Enter your info manually",
                    },
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setUploadMethod(option.id);
                        setStep(2);
                      }}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        uploadMethod === option.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
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
                    Answer a few questions to help me understand your impact
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

                  {/* Input */}
                  <div className="border-t border-border p-4">
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
                        onClick={handleSendMessage}
                        disabled={!currentInput.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Skip Button */}
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
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                        <div className="w-10 h-10 rounded-lg bg-proof-success/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-proof-success" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">Profile information captured</p>
                          <p className="text-sm text-muted-foreground">
                            From your resume and interview
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
                      Our AI is analyzing your information and building your profile
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
