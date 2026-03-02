import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface AICoachOrbProps {
  primaryColor?: string;
  onClick: () => void;
}

export const AICoachOrb = ({ primaryColor = "#3B5EF5", onClick }: AICoachOrbProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
    >
      {/* Outer breathing ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "-8px",
          border: `2px solid ${primaryColor}`,
          opacity: 0.2,
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.08, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main button */}
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center gap-2 text-white font-medium text-sm rounded-full shadow-lg cursor-pointer"
        style={{
          background: primaryColor,
          height: "52px",
          paddingLeft: hovered ? "18px" : "14px",
          paddingRight: hovered ? "18px" : "14px",
          minWidth: "52px",
          justifyContent: "center",
          boxShadow: `0 4px 20px ${primaryColor}50`,
          transition: "padding 0.3s ease, box-shadow 0.3s ease",
        }}
        whileHover={{
          boxShadow: `0 4px 30px ${primaryColor}70`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-5 h-5 flex-shrink-0" />

        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
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
