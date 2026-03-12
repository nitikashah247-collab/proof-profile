import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ResumeTransform = () => {
  const [phase, setPhase] = useState<"resume" | "transforming" | "profile">("resume");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("transforming"), 2500);
    const timer2 = setTimeout(() => setPhase("profile"), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-lg" style={{ minHeight: "340px" }}>
        
        {/* RESUME STATE */}
        <AnimatePresence>
          {(phase === "resume" || phase === "transforming") && (
            <motion.div
              className="absolute inset-0 p-8"
              initial={{ opacity: 1 }}
              animate={{ opacity: phase === "transforming" ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="h-5 w-44 bg-muted-foreground/20 rounded mb-2" />
                  <div className="h-3 w-56 bg-muted-foreground/10 rounded mb-1" />
                  <div className="h-3 w-40 bg-muted-foreground/10 rounded" />
                </div>
                <div className="h-3 w-32 bg-muted-foreground/10 rounded" />
              </div>

              <div className="mb-5">
                <div className="h-3 w-24 bg-muted-foreground/15 rounded mb-3" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-full bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-4/5 bg-muted-foreground/[0.08] rounded" />
                </div>
              </div>

              <div className="mb-5">
                <div className="h-3 w-28 bg-muted-foreground/15 rounded mb-3" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-full bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-3/5 bg-muted-foreground/[0.08] rounded" />
                </div>
              </div>

              <div className="mb-5">
                <div className="h-3 w-20 bg-muted-foreground/15 rounded mb-3" />
                <div className="flex gap-2 flex-wrap">
                  <div className="h-2.5 w-16 bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-20 bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-14 bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-[72px] bg-muted-foreground/[0.08] rounded" />
                </div>
              </div>

              <div>
                <div className="h-3 w-24 bg-muted-foreground/15 rounded mb-3" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-full bg-muted-foreground/[0.08] rounded" />
                  <div className="h-2.5 w-2/3 bg-muted-foreground/[0.08] rounded" />
                </div>
              </div>

              <div className="absolute top-4 right-4 text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
                .pdf
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROFILE STATE */}
        <AnimatePresence>
          {(phase === "transforming" || phase === "profile") && (
            <motion.div
              className="absolute inset-0 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "profile" ? 1 : 0.3 }}
              transition={{ duration: 1.2, ease, delay: phase === "transforming" ? 0.5 : 0 }}
            >
              <div className="flex items-start gap-4 mb-5">
                <motion.div 
                  className="relative flex-shrink-0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.3 }}
                >
                  <span
                    className="absolute rounded-full"
                    style={{ inset: '-3px', border: '2px solid #002bfe50', animation: 'photo-ring 3s ease-in-out infinite' }}
                  />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                </motion.div>

                <div className="flex-1">
                  <motion.div
                    className="h-4 bg-foreground rounded mb-1.5"
                    initial={{ width: 0 }}
                    animate={{ width: 128 }}
                    transition={{ duration: 0.5, ease, delay: 0.4 }}
                  />
                  <motion.div
                    className="h-2.5 bg-muted-foreground/30 rounded mb-1"
                    initial={{ width: 0 }}
                    animate={{ width: 192 }}
                    transition={{ duration: 0.5, ease, delay: 0.5 }}
                  />
                  <motion.div
                    className="h-2 bg-muted-foreground/20 rounded"
                    initial={{ width: 0 }}
                    animate={{ width: 112 }}
                    transition={{ duration: 0.5, ease, delay: 0.6 }}
                  />
                </div>
              </div>

              <motion.div
                className="flex gap-6 mb-5 pb-4 border-b border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.7 }}
              >
                {[
                  { value: "10+", label: "Years" },
                  { value: "$4.2M", label: "Pipeline" },
                  { value: "3x", label: "Growth" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold" style={{ color: "#002bfe" }}>{stat.value}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                className="rounded-xl border border-border p-3 mb-4 bg-muted/30"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.9 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: "#002bfe" }}>62%</span>
                  <span className="text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Revenue Growth</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#002bfe" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "62%" }}
                    transition={{ duration: 1, ease, delay: 1.1 }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-1.5 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {["Product Marketing", "GTM Strategy", "B2B SaaS", "Revenue"].map((skill, i) => (
                  <motion.span
                    key={skill}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                className="flex items-center gap-2 text-[10px] text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground" />
                </span>
                AI Advocate active
              </motion.div>

              <motion.div
                className="absolute top-4 right-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <span
                  className="text-[10px] font-semibold tracking-wider"
                  style={{ fontFamily: "'Outfit', sans-serif", color: "#002bfe" }}
                >
                  proof
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        className="text-center text-xs text-muted-foreground mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 0.5 }}
      >
        From static PDF to living career profile
      </motion.p>
    </div>
  );
};
