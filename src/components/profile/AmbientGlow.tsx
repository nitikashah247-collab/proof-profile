import { motion } from "framer-motion";

interface AmbientGlowProps {
  primaryColor?: string;
  className?: string;
}

export const AmbientGlow = ({ primaryColor = "#3B5EF5", className = "" }: AmbientGlowProps) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ overflow: 'visible' }} aria-hidden="true">
      {/* Primary glow blob — top left, drifts slowly */}
      <motion.div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
        style={{ 
          backgroundColor: primaryColor,
          opacity: 0.1,
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 20, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Secondary glow blob — bottom right, counter-drifts */}
      <motion.div
        className="absolute top-40 -right-20 w-[400px] h-[400px] rounded-full"
        style={{ 
          backgroundColor: primaryColor,
          opacity: 0.06,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 25, -20, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};
