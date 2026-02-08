import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const industries = [
  "Marketing & Brand",
  "Finance & Accounting",
  "Engineering & Technology",
  "Product & Design",
  "Operations & Strategy",
  "Sales & Business Development",
  "Human Resources",
  "Legal & Compliance",
  "Healthcare & Medical",
  "Education & Training",
  "Consulting & Advisory",
  "Real Estate & Property",
  "Hospitality & Events",
  "Creative & Media",
  "Data & Analytics",
];

const VISIBLE_COUNT = 3;
const INTERVAL_MS = 2500;

export const IndustryCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % industries.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, advance]);

  const getVisibleIndustries = () => {
    const visible: { label: string; index: number }[] = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const idx = (startIndex + i) % industries.length;
      visible.push({ label: industries[idx], index: idx });
    }
    return visible;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-20 pt-8 border-t border-border"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <p className="text-sm text-muted-foreground mb-6">
        Adapts to any role, any industry
      </p>

      <div className="flex items-center justify-center gap-8 md:gap-14 h-8 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {getVisibleIndustries().map(({ label, index }) => (
            <motion.span
              key={`${label}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-lg font-semibold text-muted-foreground/60 whitespace-nowrap"
            >
              {label}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
