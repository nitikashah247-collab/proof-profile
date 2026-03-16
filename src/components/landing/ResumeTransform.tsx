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
  "Based on your job description, Sarah hits 9 out of 10 requirements. Her strongest match is category creation.",
  "She has 4 verified case studies with real artifacts — board decks, campaign data, and revenue dashboards.",
];

type ActiveSide = "coach" | "ambassador";

export const ResumeTransform = () => {
  const [activeSide, setActiveSide] = useState<ActiveSide>("coach");
  const [coachIndex, setCoachIndex] = useState(0);
  const [ambassadorIndex, setAmbassadorIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  // Initial delay before first whisper appears
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Alternate between coach and ambassador every 4 seconds
  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setActiveSide((prev) => {
        if (prev === "coach") {
          return "ambassador";
        } else {
          // When switching back to coach, advance the coach index
          setCoachIndex((ci) => (ci + 1) % coachWhispers.length);
          return "coach";
        }
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [visible]);

  // Advance ambassador index each time we leave ambassador
  useEffect(() => {
    if (activeSide === "coach" && visible) {
      setAmbassadorIndex((prev) => (prev + 1) % ambassadorWhispers.length);
    }
  }, [activeSide, visible]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 mb-6 px-6">
      <div className="relative flex items-center justify-center">

        {/* LEFT: AI Coach whisper */}
        <div className="hidden md:flex flex-col items-end justify-start w-52 flex-shrink-0 mr-6">
          {/* Label — always visible */}
          <motion.div
            className="flex flex-col items-end mb-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-foreground">AI Coach</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: "#e8e2e2" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#e8e2e2" }} />
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground mt-0.5">Helps you build your best profile</span>
          </motion.div>

          {/* Whisper bubble — only visible when coach is active */}
          <div className="min-h-[90px] flex items-start justify-end w-full">
            <AnimatePresence mode="wait">
              {visible && activeSide === "coach" && (
                <motion.div
                  key={`coach-${coachIndex}`}
                  className="relative bg-foreground text-background rounded-2xl rounded-tr-sm px-4 py-3 text-[11px] leading-relaxed text-left shadow-md"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {coachWhispers[coachIndex]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CENTRE: The Profile */}
        <motion.div
          className="relative rounded-2xl border border-border bg-white p-6 shadow-xl w-full max-w-xs flex-shrink-0"
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
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
            >
              <span className="absolute rounded-full" style={{ inset: "-3px", border: "2px solid #002bfe60", animation: "photo-ring 3s ease-in-out infinite" }} />
              <span className="absolute rounded-full" style={{ inset: "-3px", border: "1px solid #002bfe30", animation: "photo-ring 3s ease-in-out infinite 1.5s" }} />
              <img src="/demo-sarah.png" alt="Sarah Chen" className="w-12 h-12 rounded-full object-cover" />
            </motion.div>
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <div className="text-sm font-semibold text-foreground text-left">Sarah Chen</div>
                <div className="text-[11px] text-muted-foreground text-left">Head of Product Marketing · London</div>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="flex gap-4 pb-3.5 mb-3.5 border-b border-border"
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
              <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}>
                <p className="text-xs font-bold" style={{ color: "#002bfe" }}>{stat.value}</p>
                <p className="text-[7px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Skill pills */}
          <motion.div className="flex flex-wrap gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            {["Product Marketing", "GTM Strategy", "B2B SaaS", "Category Creation"].map((skill, i) => (
              <motion.span
                key={skill}
                className="text-[8px] px-2 py-0.5 rounded-full"
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

        {/* RIGHT: AI Ambassador whisper */}
        <div className="hidden md:flex flex-col items-start justify-start w-52 flex-shrink-0 ml-6">
          {/* Label — always visible */}
          <motion.div
            className="flex items-center gap-2 mb-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-40" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground" />
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground">AI Ambassador</span>
            <img src="/proof-logo.png" alt="" className="w-5 h-5 rounded-full" />
          </motion.div>

          {/* Whisper bubble — only visible when ambassador is active */}
          <div className="min-h-[90px] flex items-start w-full">
            <AnimatePresence mode="wait">
              {visible && activeSide === "ambassador" && (
                <motion.div
                  key={`ambassador-${ambassadorIndex}`}
                  className="relative bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-[11px] leading-relaxed text-left shadow-md"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {ambassadorWhispers[ambassadorIndex]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Subtle labels */}
      <div className="hidden md:flex justify-between max-w-3xl mx-auto mt-3 px-4">
        <motion.p className="text-[9px] text-muted-foreground/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          Helps you build your best profile
        </motion.p>
        <motion.p className="text-[9px] text-muted-foreground/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
          Represents you to every visitor
        </motion.p>
      </div>
    </div>
  );
};
