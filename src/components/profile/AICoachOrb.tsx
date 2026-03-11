import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AICoachOrbProps {
  primaryColor?: string;
  onClick: () => void;
}

const LoveKnotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3C9.5 3 7.5 4.5 7.5 7C7.5 8.5 8.2 9.5 9 10.2C7.2 10.8 5.5 12.5 5.5 15C5.5 18 8 20.5 12 21C16 20.5 18.5 18 18.5 15C18.5 12.5 16.8 10.8 15 10.2C15.8 9.5 16.5 8.5 16.5 7C16.5 4.5 14.5 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M9.5 10C8 11 7 12.5 7 14.5C7 16.5 8.5 18.5 12 19C15.5 18.5 17 16.5 17 14.5C17 12.5 16 11 14.5 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M10 7C10 5.5 10.8 4.5 12 4.5C13.2 4.5 14 5.5 14 7C14 8.5 13 9.5 12 10C11 9.5 10 8.5 10 7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="12" cy="12.5" r="1.5" fill="currentColor" opacity="0.6" />
  </svg>
);

export const AICoachOrb = ({ primaryColor = "#3B5EF5", onClick }: AICoachOrbProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
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
        {/* Rotating love knot icon */}
        <motion.div
          className="flex-shrink-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <LoveKnotIcon />
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
