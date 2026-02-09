import { motion } from "framer-motion";

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

export const IndustryCarousel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-20 pt-8 border-t border-border"
    >
      <p className="text-sm text-muted-foreground mb-6">
        Adapts to any role, any industry
      </p>

      <div className="marquee-container group">
        <div className="marquee-track group-hover:[animation-play-state:paused]">
          {industries.map((label) => (
            <span key={label} className="marquee-item">
              {label}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {industries.map((label) => (
            <span key={`dup-${label}`} className="marquee-item" aria-hidden>
              {label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
