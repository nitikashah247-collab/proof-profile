import { motion } from "framer-motion";

interface AmbientGlowProps {
  primaryColor?: string;
  className?: string;
}

export const AmbientGlow = ({ primaryColor = "#3B5EF5", className = "" }: AmbientGlowProps) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0, overflow: 'visible' }}
      aria-hidden="true"
    >
      <motion.div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          opacity: 0.15,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 20, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '200px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          opacity: 0.1,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 25, -20, 0],
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
