import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ResumeTransform = () => {
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowProfile(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
      <div
        className="relative rounded-2xl border border-border overflow-hidden shadow-lg"
        style={{ minHeight: "380px", background: showProfile ? "white" : "#fafafa" }}
      >
        {/* ============================================ */}
        {/* PHASE 1: STATIC RESUME — grey, boring, dead */}
        {/* ============================================ */}
        <motion.div
          className="absolute inset-0 p-8"
          animate={{
            opacity: showProfile ? 0 : 1,
            scale: showProfile ? 0.95 : 1,
            filter: showProfile ? "blur(8px)" : "blur(0px)",
          }}
          transition={{ duration: 1.5, ease }}
        >
          {/* ".pdf" watermark */}
          <div className="absolute top-5 right-6 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">
            resume.pdf
          </div>

          {/* Resume name block */}
          <div className="h-6 w-48 bg-neutral-300/60 rounded mb-1.5" />
          <div className="h-3 w-64 bg-neutral-200/60 rounded mb-1" />
          <div className="h-3 w-44 bg-neutral-200/50 rounded mb-6" />

          {/* Horizontal rule */}
          <div className="h-px w-full bg-neutral-200 mb-5" />

          {/* Experience section */}
          <div className="h-3 w-20 bg-neutral-300/50 rounded mb-3 uppercase" />

          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <div className="h-3 w-36 bg-neutral-200/60 rounded" />
              <div className="h-2.5 w-20 bg-neutral-200/40 rounded" />
            </div>
            <div className="h-2.5 w-full bg-neutral-100/80 rounded mb-1" />
            <div className="h-2.5 w-full bg-neutral-100/80 rounded mb-1" />
            <div className="h-2.5 w-3/4 bg-neutral-100/80 rounded" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <div className="h-3 w-40 bg-neutral-200/60 rounded" />
              <div className="h-2.5 w-20 bg-neutral-200/40 rounded" />
            </div>
            <div className="h-2.5 w-full bg-neutral-100/80 rounded mb-1" />
            <div className="h-2.5 w-full bg-neutral-100/80 rounded mb-1" />
            <div className="h-2.5 w-2/3 bg-neutral-100/80 rounded" />
          </div>

          {/* Skills section */}
          <div className="h-3 w-16 bg-neutral-300/50 rounded mb-3" />
          <div className="flex gap-2 flex-wrap mb-5">
            <div className="h-5 w-16 bg-neutral-200/40 rounded" />
            <div className="h-5 w-20 bg-neutral-200/40 rounded" />
            <div className="h-5 w-14 bg-neutral-200/40 rounded" />
            <div className="h-5 w-[72px] bg-neutral-200/40 rounded" />
            <div className="h-5 w-16 bg-neutral-200/40 rounded" />
          </div>

          {/* Education section */}
          <div className="h-3 w-20 bg-neutral-300/50 rounded mb-3" />
          <div className="h-2.5 w-52 bg-neutral-200/40 rounded mb-1" />
          <div className="h-2.5 w-36 bg-neutral-200/30 rounded" />
        </motion.div>

        {/* ================================================ */}
        {/* PHASE 2: PROOF PROFILE — colourful, alive, rich  */}
        {/* ================================================ */}
        <motion.div
          className="absolute inset-0 p-6"
          initial={{ opacity: 0 }}
          animate={{
            opacity: showProfile ? 1 : 0,
          }}
          transition={{ duration: 1, ease, delay: 0.5 }}
        >
          {/* "proof" label */}
          {showProfile && (
            <motion.div
              className="absolute top-4 right-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.4 }}
            >
              <span
                className="text-[11px] font-semibold tracking-wide"
                style={{ fontFamily: "'Outfit', sans-serif", color: "#002bfe" }}
              >
                proof
              </span>
            </motion.div>
          )}

          {showProfile && (
            <>
              {/* Profile header — photo + name */}
              <div className="flex items-start gap-4 mb-5">
                <motion.div
                  className="relative flex-shrink-0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease, delay: 0.6 }}
                >
                  <span
                    className="absolute rounded-full"
                    style={{
                      inset: "-3px",
                      border: "2px solid #002bfe70",
                      animation: "photo-ring 3s ease-in-out infinite",
                    }}
                  />
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200" />
                </motion.div>

                <div className="pt-1">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.7 }}
                  >
                    <div className="text-base font-semibold text-foreground">Sarah Chen</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.85 }}
                  >
                    <div className="text-xs text-muted-foreground">Head of Product Marketing · London, UK</div>
                  </motion.div>
                </div>
              </div>

              {/* Stats row */}
              <motion.div
                className="flex gap-8 mb-5 pb-4 border-b border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 1.0 }}
              >
                {[
                  { value: "10+", label: "Years" },
                  { value: "$4.2M", label: "Pipeline" },
                  { value: "3x", label: "Growth" },
                  { value: "35%", label: "Faster Sales" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 + i * 0.12 }}
                  >
                    <p className="text-sm font-bold" style={{ color: "#002bfe" }}>
                      {stat.value}
                    </p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Impact metric card */}
              <motion.div
                className="rounded-xl border border-border p-3.5 mb-4 bg-muted/30"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 1.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold" style={{ color: "#002bfe" }}>
                    62%
                  </span>
                  <span className="text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    Revenue Growth
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#002bfe" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "62%" }}
                    transition={{ duration: 1.2, ease, delay: 1.6 }}
                  />
                </div>
              </motion.div>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Product Marketing", "GTM Strategy", "B2B SaaS", "Revenue"].map(
                  (skill, i) => (
                    <motion.span
                      key={skill}
                      className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "#002bfe10",
                        color: "#002bfe",
                      }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.8 + i * 0.1 }}
                    >
                      {skill}
                    </motion.span>
                  )
                )}
              </div>

              {/* AI Advocate indicator */}
              <motion.div
                className="flex items-center gap-2 text-[10px] text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: "#002bfe" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#002bfe" }} />
                </span>
                AI Advocate active
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Caption */}
      <motion.p
        className="text-center text-xs text-muted-foreground mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: showProfile ? 1 : 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        From static PDF to living career profile
      </motion.p>
    </div>
  );
};
