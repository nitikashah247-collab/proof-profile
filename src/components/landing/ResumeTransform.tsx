import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const coachWhispers = [
  "Your pricing transformation story is your strongest proof point — let me build a case study around it.",
  "I found 3 impact metrics in your resume you haven't highlighted yet. Want me to add them?",
  "Your headline undersells you. You're not a 'Marketing Manager' — you're a GTM strategist who builds revenue engines.",
  "Upload your board deck and I'll turn it into visual evidence for your profile.",
];

const ambassadorWhispers = [
  "Sarah drove $4.2M in pipeline and shortened sales cycles by 35%. She builds GTM engines, not just campaigns.",
  "Her pricing transformation delivered 62% revenue growth with zero churn. Want me to walk you through it?",
  "Based on your job description, Sarah hits 9 out of 10 requirements. The strongest match is her category creation experience.",
  "She has 4 verified case studies with real artifacts — board decks, campaign data, revenue dashboards.",
];

export const ResumeTransform = () => {
  const [coachIndex, setCoachIndex] = useState(0);
  const [ambassadorIndex, setAmbassadorIndex] = useState(0);
  const [showCoach, setShowCoach] = useState(false);
  const [showAmbassador, setShowAmbassador] = useState(false);

  // Stagger the initial appearance
  useEffect(() => {
    const t1 = setTimeout(() => setShowCoach(true), 1500);
    const t2 = setTimeout(() => setShowAmbassador(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Cycle coach whispers
  useEffect(() => {
    if (!showCoach) return;
    const timer = setInterval(() => {
      setShowCoach(false);
      setTimeout(() => {
        setCoachIndex((prev) => (prev + 1) % coachWhispers.length);
        setShowCoach(true);
      }, 600);
    }, 5500);
    return () => clearInterval(timer);
  }, [showCoach]);

  // Cycle ambassador whispers — offset by 2.5s
  useEffect(() => {
    if (!showAmbassador) return;
    const timer = setInterval(() => {
      setShowAmbassador(false);
      setTimeout(() => {
        setAmbassadorIndex((prev) => (prev + 1) % ambassadorWhispers.length);
        setShowAmbassador(true);
      }, 600);
    }, 5500);
    return () => clearInterval(timer);
  }, [showAmbassador]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-8 px-6">
      <div className="relative flex items-center justify-center gap-4 md:gap-8">

        {/* =============================== */}
        {/* LEFT: AI Coach whisper           */}
        {/* =============================== */}
        <div className="hidden md:flex flex-col items-end w-56 flex-shrink-0">
          {/* Label */}
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <img src="/proof-logo.png" alt="" className="w-5 h-5 rounded-full" />
            <span className="text-[10px] font-semibold text-foreground">AI Coach</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
          </motion.div>

          {/* Whisper bubble */}
          <AnimatePresence mode="wait">
            {showCoach && (
              <motion.div
                key={`coach-${coachIndex}`}
                className="relative bg-foreground text-background rounded-2xl rounded-tr-md px-4 py-3 text-[11px] leading-relaxed shadow-md max-w-full"
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.95 }}
                transition={{ duration: 0.4, ease }}
              >
                {coachWhispers[coachIndex]}
                {/* Arrow pointing right toward the profile */}
                <div className="absolute top-4 -right-1.5 w-3 h-3 bg-foreground rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* =============================== */}
        {/* CENTRE: The Profile              */}
        {/* =============================== */}
        <motion.div
          className="relative rounded-2xl border border-border bg-card p-6 shadow-xl w-full max-w-sm flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          {/* proof label */}
          <motion.span
            className="absolute top-4 right-5 text-[10px] font-semibold tracking-wide"
            style={{ fontFamily: "'Outfit', sans-serif", color: "#002bfe" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            proof
          </motion.span>

          {/* Profile header */}
          <div className="flex items-center gap-3.5 mb-5">
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
            >
              <span
                className="absolute rounded-full"
                style={{ inset: "-3px", border: "2px solid #002bfe60", animation: "photo-ring 3s ease-in-out infinite" }}
              />
              <span
                className="absolute rounded-full"
                style={{ inset: "-3px", border: "1px solid #002bfe30", animation: "photo-ring 3s ease-in-out infinite 1.5s" }}
              />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200" />
            </motion.div>
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <div className="text-base font-semibold text-foreground">Sarah Chen</div>
                <div className="text-xs text-muted-foreground">Head of Product Marketing · London</div>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="flex gap-5 pb-4 mb-4 border-b border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { value: "10+", label: "Years" },
              { value: "$4.2M", label: "Pipeline" },
              { value: "3x", label: "Growth" },
              { value: "35%", label: "Faster Sales" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <p className="text-sm font-bold" style={{ color: "#002bfe" }}>{stat.value}</p>
                <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Impact bar */}
          <motion.div
            className="rounded-xl border border-border p-3 mb-4 bg-muted/20"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold" style={{ color: "#002bfe" }}>62%</span>
              <span className="text-[8px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Revenue Growth</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: "#002bfe" }}
                initial={{ width: "0%" }}
                animate={{ width: "62%" }}
                transition={{ duration: 1.2, ease, delay: 1.3 }}
              />
            </div>
          </motion.div>

          {/* Skill pills */}
          <motion.div
            className="flex flex-wrap gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {["Product Marketing", "GTM Strategy", "B2B SaaS", "Revenue"].map((skill, i) => (
              <motion.span
                key={skill}
                className="text-[9px] px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#002bfe10", color: "#002bfe" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + i * 0.08 }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* =============================== */}
        {/* RIGHT: AI Ambassador whisper     */}
        {/* =============================== */}
        <div className="hidden md:flex flex-col items-start w-56 flex-shrink-0">
          {/* Label */}
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7, duration: 0.5 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: "#002bfe" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#002bfe" }} />
            </span>
            <span className="text-[10px] font-semibold text-foreground">AI Ambassador</span>
            <img
              src="/proof-logo.png"
              alt=""
              className="w-5 h-5 rounded-full"
              style={{ filter: "invert(1)" }}
            />
          </motion.div>

          {/* Whisper bubble */}
          <AnimatePresence mode="wait">
            {showAmbassador && (
              <motion.div
                key={`ambassador-${ambassadorIndex}`}
                className="relative bg-muted text-foreground rounded-2xl rounded-tl-md px-4 py-3 text-[11px] leading-relaxed shadow-md max-w-full"
                initial={{ opacity: 0, x: -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.4, ease }}
              >
                {ambassadorWhispers[ambassadorIndex]}
                {/* Arrow pointing left toward the profile */}
                <div className="absolute top-4 -left-1.5 w-3 h-3 bg-muted rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Labels underneath */}
      <div className="flex justify-center gap-16 mt-6">
        <motion.p
          className="text-[10px] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          ← AI Coach builds your profile
        </motion.p>
        <motion.p
          className="text-[10px] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.5 }}
        >
          AI Ambassador represents you →
        </motion.p>
      </div>
    </div>
  );
};
