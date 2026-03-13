import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ResumeTransform = () => {
  const [phase, setPhase] = useState<"both" | "dissolving" | "profile">("both");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("dissolving"), 3500);
    const t2 = setTimeout(() => setPhase("profile"), 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-8">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">

        {/* ============================= */}
        {/* LEFT: STATIC RESUME — boring  */}
        {/* ============================= */}
        <motion.div
          className="relative rounded-2xl border border-border bg-[#f8f8f7] p-7 overflow-hidden"
          style={{ width: "380px", minHeight: "380px" }}
          animate={{
            opacity: phase === "both" ? 1 : phase === "dissolving" ? 0 : 0,
            scale: phase === "dissolving" ? 0.92 : 1,
            filter: phase === "dissolving" ? "blur(12px)" : "blur(0px)",
            x: phase === "profile" ? -100 : 0,
            width: phase === "profile" ? 0 : 380,
            padding: phase === "profile" ? 0 : 28,
          }}
          transition={{ duration: 1.5, ease }}
        >
          {/* "resume.pdf" label */}
          <div className="absolute top-4 right-5 text-[9px] font-mono text-neutral-400/60 uppercase tracking-[0.15em]">
            resume.pdf
          </div>

          {/* Name */}
          <div className="h-5 w-40 bg-neutral-300/70 rounded mb-1.5" />
          <div className="h-2.5 w-52 bg-neutral-200/60 rounded mb-1" />
          <div className="h-2.5 w-36 bg-neutral-200/50 rounded mb-5" />

          {/* HR */}
          <div className="h-px w-full bg-neutral-200/80 mb-4" />

          {/* Experience header */}
          <div className="h-2.5 w-20 bg-neutral-300/40 rounded mb-3" />

          {/* Job 1 */}
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

          {/* Job 2 */}
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

          {/* Skills */}
          <div className="h-2.5 w-14 bg-neutral-300/40 rounded mb-2.5" />
          <div className="flex gap-1.5 flex-wrap mb-4">
            <div className="h-4 w-14 bg-neutral-200/40 rounded" />
            <div className="h-4 w-[72px] bg-neutral-200/40 rounded" />
            <div className="h-4 w-12 bg-neutral-200/40 rounded" />
            <div className="h-4 w-16 bg-neutral-200/40 rounded" />
          </div>

          {/* Education */}
          <div className="h-2.5 w-[72px] bg-neutral-300/40 rounded mb-2" />
          <div className="h-2 w-44 bg-neutral-200/30 rounded mb-1" />
          <div className="h-2 w-32 bg-neutral-200/25 rounded" />
        </motion.div>

        {/* ================================ */}
        {/* RIGHT: PROOF PROFILE — alive     */}
        {/* ================================ */}
        <motion.div
          className="relative rounded-2xl border border-border bg-white p-6 overflow-hidden shadow-lg"
          style={{ width: "380px", minHeight: "380px" }}
          animate={{
            x: phase === "profile" ? 0 : 0,
            width: 380,
          }}
          layout
          transition={{ duration: 1, ease }}
        >
          {/* "proof" label */}
          <motion.div
            className="absolute top-4 right-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <span
              className="text-[11px] font-semibold tracking-wide"
              style={{ fontFamily: "'Outfit', sans-serif", color: "#002bfe" }}
            >
              proof
            </span>
          </motion.div>

          {/* Profile header */}
          <div className="flex items-start gap-4 mb-5">
            <motion.div
              className="relative flex-shrink-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
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
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.5 }}
              >
                <div className="text-base font-semibold text-foreground">Sarah Chen</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.65 }}
              >
                <div className="text-xs text-muted-foreground">
                  Head of Product Marketing · London, UK
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            className="flex gap-6 mb-5 pb-4 border-b border-border"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.8 }}
          >
            {[
              { value: "10+", label: "Years" },
              { value: "$4.2M", label: "Pipeline" },
              { value: "3x", label: "Growth" },
              { value: "35%", label: "Faster Sales" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
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

          {/* Impact bar */}
          <motion.div
            className="rounded-xl border border-border p-3.5 mb-4 bg-muted/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 1.2 }}
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
                transition={{ duration: 1.2, ease, delay: 1.4 }}
              />
            </div>
          </motion.div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {["Product Marketing", "GTM Strategy", "B2B SaaS", "Revenue"].map(
              (skill, i) => (
                <motion.span
                  key={skill}
                  className="text-[10px] px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#002bfe10", color: "#002bfe" }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.6 + i * 0.08 }}
                >
                  {skill}
                </motion.span>
              )
            )}
          </div>

          {/* AI Advocate chat bubble */}
          <motion.div
            className="rounded-xl bg-muted/50 border border-border p-3 mb-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.0 }}
          >
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[8px] text-background font-bold">AI</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Sarah grew pipeline by $4.2M and shortened sales cycles by 35%. Want me to walk you through her GTM strategy?
              </p>
            </div>
          </motion.div>

          {/* AI Advocate active */}
          <motion.div
            className="flex items-center gap-2 text-[10px] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.3 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
                style={{ backgroundColor: "#002bfe" }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ backgroundColor: "#002bfe" }}
              />
            </span>
            AI Advocate active
          </motion.div>
        </motion.div>
      </div>

      {/* Caption */}
      <motion.p
        className="text-center text-xs text-muted-foreground mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "profile" ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        From static PDF to living career profile
      </motion.p>
    </div>
  );
};
