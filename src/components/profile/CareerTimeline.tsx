import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export const CareerTimeline = ({ entries }: CareerTimelineProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-2 text-foreground">Career Journey</h2>
          <p className="text-muted-foreground mb-10">Click on each role to see key achievements</p>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-border" />
            
            {/* Progress Line */}
            <motion.div
              className="absolute top-6 left-0 h-0.5 bg-primary"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Timeline Nodes */}
            <div className="relative flex justify-between mb-8">
              {entries.map((entry, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.3 }}
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className={`relative flex flex-col items-center group ${
                    entries.length <= 3 ? "flex-1" : ""
                  }`}
                >
                  {/* Node */}
                  <div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                      activeIndex === index
                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/25"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  
                  {/* Role Title - primary label */}
                  <span className={`mt-3 text-xs font-semibold text-center max-w-[120px] transition-colors leading-tight ${
                    activeIndex === index ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {entry.role}
                  </span>

                  {/* Company Name - secondary label */}
                  <span className={`mt-0.5 text-[10px] text-center max-w-[120px] transition-colors ${
                    activeIndex === index ? "text-muted-foreground" : "text-muted-foreground/70"
                  }`}>
                    {entry.company}
                  </span>
                  
                  {/* Year Label */}
                  <span className={`mt-1 text-[10px] font-medium transition-colors ${
                    activeIndex === index ? "text-primary" : "text-muted-foreground/60"
                  }`}>
                    {entry.startYear}{entry.endYear && entry.endYear !== entry.startYear ? `–${entry.endYear}` : ""}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Expanded Details Card */}
            <AnimatePresence mode="wait">
              {activeIndex !== null && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{entries[activeIndex].role}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            {entries[activeIndex].company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {entries[activeIndex].startYear} – {entries[activeIndex].endYear}
                          </span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {entries[activeIndex].company.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Key Achievements
                      </p>
                      <ul className="space-y-2">
                        {entries[activeIndex].achievements.map((achievement, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 text-sm text-foreground"
                          >
                            <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
