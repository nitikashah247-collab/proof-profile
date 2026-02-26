import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Calendar, ChevronRight, Award } from "lucide-react";

interface TimelineEntry {
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  location?: string;
  achievements: string[];
  logo?: string;
}

interface CareerTimelineProps {
  entries: TimelineEntry[];
}

const EASE = [0.22, 1, 0.36, 1];

export const CareerTimeline = ({ entries }: CareerTimelineProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: EASE as any }}
          className="max-w-5xl"
        >
          <p className="section-overline mb-2">Experience</p>
          <h2 className="section-heading text-4xl mb-3 text-foreground">Career Journey</h2>
          <p className="text-muted-foreground mb-12">Click on each role to see key achievements</p>

          {/* Vertical timeline */}
          <div className="relative pl-8">
          {/* Vertical line */}
            <div className="absolute left-[7px] md:left-[7px] top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {entries.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: EASE as any }}
                  className="relative"
                >
                  {/* Single dot on line */}
                  <div
                    className="absolute top-6 w-[15px] h-[15px] rounded-full border-[3px] border-background z-10 transition-all duration-300"
                    style={{
                      left: "0px",
                      background: activeIndex === index ? "hsl(var(--foreground))" : "hsl(var(--border))",
                    }}
                  />

                  {/* Card */}
                  <button
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className={`w-full text-left ml-4 glass-card rounded-2xl p-6 transition-all duration-300 ${
                      activeIndex === index
                        ? "border-primary/30 shadow-lg shadow-primary/5"
                        : "hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl text-foreground">{entry.role}</h3>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                          {entry.company}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {entry.startYear}{entry.endYear && entry.endYear !== entry.startYear ? ` – ${entry.endYear}` : ""}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {entry.company.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    </div>

                    {/* Achievements — shown when active */}
                    <AnimatePresence>
                      {activeIndex === index && entry.achievements.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                            {entry.achievements.map((achievement, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                                <span>{achievement}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
