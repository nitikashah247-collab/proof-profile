import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const aiConversations = [
  {
    question: "What makes Sarah a fit for our Head of Growth role?",
    answer: "Sarah drove $4.2M in influenced pipeline and 3x product adoption growth at her last company. She doesn't just run campaigns — she builds the GTM engine. Exactly what a Head of Growth needs.",
  },
  {
    question: "Does she have pricing strategy experience?",
    answer: "Yes — she shortened sales cycles by 35% by reworking positioning and pricing tiers. She also ran the product marketing side of a pricing transformation that drove 62% revenue growth.",
  },
  {
    question: "How does her experience compare to our job requirements?",
    answer: "Your JD asks for B2B SaaS, GTM leadership, and cross-functional influence. Sarah has 10+ years across all three — plus she's built category creation playbooks from scratch. She's overqualified, honestly.",
  },
  {
    question: "What would she bring in the first 90 days?",
    answer: "Based on her track record: an audit of your current positioning, a refreshed GTM framework, and quick wins on sales enablement. She's done this exact playbook at three companies.",
  },
];

export const ResumeTransform = () => {
  const [phase, setPhase] = useState<"both" | "dissolving" | "profile">("both");
  const [conversationIndex, setConversationIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("dissolving"), 3500);
    const t2 = setTimeout(() => setPhase("profile"), 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (phase !== "profile") return;

    const answerTimer = setTimeout(() => setShowAnswer(true), 800);

    const cycleTimer = setInterval(() => {
      setShowAnswer(false);
      setTimeout(() => {
        setConversationIndex((prev) => (prev + 1) % aiConversations.length);
        setTimeout(() => setShowAnswer(true), 600);
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(answerTimer);
      clearInterval(cycleTimer);
    };
  }, [phase]);

  const currentConvo = aiConversations[conversationIndex];

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-6">

        {/* ============================= */}
        {/* LEFT: STATIC RESUME — boring  */}
        {/* ============================= */}
        <motion.div
          className="relative rounded-2xl border border-border bg-[#f8f8f7] p-7 overflow-hidden flex-shrink-0"
          style={{ width: "340px", minHeight: "400px" }}
          animate={{
            opacity: phase === "both" ? 1 : 0,
            scale: phase === "dissolving" ? 0.9 : 1,
            filter: phase === "dissolving" ? "blur(14px)" : "blur(0px)",
            width: phase === "profile" ? 0 : 340,
            padding: phase === "profile" ? 0 : 28,
            marginRight: phase === "profile" ? 0 : undefined,
          }}
          transition={{ duration: 1.5, ease }}
        >
          <div className="absolute top-4 right-5 text-[9px] font-mono text-neutral-400/50 uppercase tracking-[0.15em]">
            resume.pdf
          </div>

          <div className="h-5 w-40 bg-neutral-300/70 rounded mb-1.5" />
          <div className="h-2.5 w-52 bg-neutral-200/60 rounded mb-1" />
          <div className="h-2.5 w-36 bg-neutral-200/50 rounded mb-5" />

          <div className="h-px w-full bg-neutral-200/80 mb-4" />

          <div className="h-2.5 w-20 bg-neutral-300/40 rounded mb-3" />
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <div className="h-2.5 w-32 bg-neutral-200/60 rounded" />
              <div className="h-2 w-16 bg-neutral-200/40 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-neutral-100/80 rounded" />
              <div className="h-2 w-full bg-neutral-100/80 rounded" />
              <div className="h-2 w-3/4 bg-neutral-100/80 rounded" />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <div className="h-2.5 w-36 bg-neutral-200/60 rounded" />
              <div className="h-2 w-16 bg-neutral-200/40 rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-full bg-neutral-100/80 rounded" />
              <div className="h-2 w-full bg-neutral-100/80 rounded" />
              <div className="h-2 w-2/3 bg-neutral-100/80 rounded" />
            </div>
          </div>

          <div className="h-2.5 w-14 bg-neutral-300/40 rounded mb-2.5" />
          <div className="flex gap-1.5 flex-wrap mb-4">
            <div className="h-4 w-14 bg-neutral-200/40 rounded" />
            <div className="h-4 w-[72px] bg-neutral-200/40 rounded" />
            <div className="h-4 w-12 bg-neutral-200/40 rounded" />
            <div className="h-4 w-16 bg-neutral-200/40 rounded" />
          </div>

          <div className="h-2.5 w-[72px] bg-neutral-300/40 rounded mb-2" />
          <div className="h-2 w-44 bg-neutral-200/30 rounded mb-1" />
          <div className="h-2 w-32 bg-neutral-200/25 rounded" />
        </motion.div>

        {/* ============================================== */}
        {/* RIGHT: PROOF PROFILE + LIVE AI CONVERSATION    */}
        {/* ============================================== */}
        <motion.div
          className="flex-shrink-0 flex flex-col gap-4"
          style={{ width: phase === "profile" ? "520px" : "380px" }}
          animate={{ width: phase === "profile" ? 520 : 380 }}
          transition={{ duration: 1, ease }}
        >
          {/* Profile card */}
          <motion.div
            className="relative rounded-2xl border border-border bg-white p-5 overflow-hidden shadow-lg"
            layout
            transition={{ duration: 1, ease }}
          >
            <motion.div
              className="absolute top-4 right-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <span className="text-[11px] font-semibold tracking-wide" style={{ fontFamily: "'Outfit', sans-serif", color: "#002bfe" }}>
                proof
              </span>
            </motion.div>

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="relative flex-shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.3 }}
              >
                <span className="absolute rounded-full" style={{ inset: "-3px", border: "2px solid #002bfe70", animation: "photo-ring 3s ease-in-out infinite" }} />
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200" />
              </motion.div>
              <div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <div className="text-sm font-semibold text-foreground">Sarah Chen</div>
                  <div className="text-[11px] text-muted-foreground">Head of Product Marketing · London, UK</div>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="flex gap-5 pb-3 border-b border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { value: "10+", label: "Years" },
                { value: "$4.2M", label: "Pipeline" },
                { value: "3x", label: "Growth" },
                { value: "35%", label: "Faster Sales" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}>
                  <p className="text-xs font-bold" style={{ color: "#002bfe" }}>{stat.value}</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="flex flex-wrap gap-1 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
              {["Product Marketing", "GTM Strategy", "B2B SaaS", "Revenue"].map((skill, i) => (
                <motion.span
                  key={skill}
                  className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#002bfe10", color: "#002bfe" }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + i * 0.08 }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* AI Conversation */}
          <motion.div
            className="rounded-2xl border border-border bg-white p-5 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: phase !== "both" ? 1 : 0, y: phase !== "both" ? 0 : 15 }}
            transition={{ duration: 0.6, ease, delay: 1.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: "#002bfe" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#002bfe" }} />
              </span>
              <span className="text-[11px] font-semibold text-foreground">AI Advocate</span>
              <span className="text-[9px] text-muted-foreground ml-auto">Live</span>
            </div>

            <div className="space-y-3 min-h-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`q-${conversationIndex}`}
                  className="flex justify-end"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-foreground text-background px-3.5 py-2.5 text-[11px] leading-relaxed">
                    {currentConvo.question}
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {showAnswer && (
                  <motion.div
                    key={`a-${conversationIndex}`}
                    className="flex justify-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted text-foreground px-3.5 py-2.5 text-[11px] leading-relaxed">
                      {currentConvo.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {!showAnswer && phase === "profile" && (
                <motion.div
                  className="flex justify-start mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Caption */}
      <motion.p
        className="text-center text-xs text-muted-foreground mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "profile" ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Your career profile, always advocating for you
      </motion.p>
    </div>
  );
};
