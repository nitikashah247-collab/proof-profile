import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl"
        >
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">Experience</p>
            <h2 className="text-2xl font-semibold text-foreground">Career Journey</h2>
          </div>

          {/* Vertical timeline */}
          <div className="relative pl-8 border-l-2 border-border">
            {entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative mb-8 last:mb-0"
              >
                {/* Dot on the line */}
                <div className="absolute -left-[25px] top-5 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                {/* Card */}
                <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    className="w-full text-left flex items-start justify-between"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{entry.role}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{entry.company}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {entry.startYear}{entry.endYear && entry.endYear !== entry.startYear ? ` – ${entry.endYear}` : ""}
                      </p>
                    </div>
                    {entry.achievements.length > 0 && (
                      <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 mt-1", expandedIndex === i && "rotate-180")} />
                    )}
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {expandedIndex === i && entry.achievements.length > 0 && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 space-y-1.5 overflow-hidden"
                      >
                        {entry.achievements.map((h, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
