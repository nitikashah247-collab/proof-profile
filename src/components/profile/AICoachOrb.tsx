import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AICoachOrbProps {
  primaryColor?: string;
  onClick: () => void;
}

const SparkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z"
      fill="currentColor"
    />
  </svg>
);

export const AICoachOrb = ({ primaryColor = "#3B5EF5", onClick }: AICoachOrbProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
    >
      {/* Outer breathing glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "-10px",
          background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Second breathing ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "-6px",
          border: `1.5px solid ${primaryColor}`,
          opacity: 0.15,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.05, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main button */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center gap-2.5 text-white font-medium text-sm rounded-full cursor-pointer overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}DD)`,
          height: "52px",
          paddingLeft: hovered ? "18px" : "14px",
          paddingRight: hovered ? "18px" : "14px",
          minWidth: "52px",
          justifyContent: "center",
          boxShadow: `0 4px 24px ${primaryColor}40, 0 0 0 1px ${primaryColor}20`,
          transition: "padding 0.3s ease, box-shadow 0.3s ease",
        }}
        whileHover={{
          boxShadow: `0 6px 32px ${primaryColor}60, 0 0 0 1px ${primaryColor}30`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Rotating spark icon */}
        <motion.div
          className="flex-shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SparkIcon />
          </motion.div>
        </motion.div>

        {/* Expandable text on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25 }}
              className="whitespace-nowrap overflow-hidden"
            >
              Ask your AI coach
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};
