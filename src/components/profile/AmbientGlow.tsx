import { motion } from "framer-motion";

interface AmbientGlowProps {
  className?: string;
}

export const AmbientGlow = ({ className = "" }: AmbientGlowProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Primary glow blob — top left, drifts slowly */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ backgroundColor: 'hsl(var(--primary) / 0.08)' }}
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
        className="absolute top-40 -right-32 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ backgroundColor: 'hsl(var(--primary) / 0.05)' }}
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
