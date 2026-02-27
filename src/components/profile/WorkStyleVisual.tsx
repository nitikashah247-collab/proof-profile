import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Zap, Brain, MessageSquare, Target, Heart } from "lucide-react";

interface WorkStyleDimension {
  label: string; leftLabel: string; rightLabel: string; value: number; icon: React.ElementType;
}
interface WorkStyleVisualProps { dimensions: WorkStyleDimension[]; traits: string[]; }

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const WorkStyleVisual = ({ dimensions, traits }: WorkStyleVisualProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease }}
      className="py-12"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">Work Style</p>
            <h2 className="text-2xl font-semibold text-foreground">How I Work</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {dimensions.map((dim, index) => (
                <motion.div
                  key={dim.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <dim.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{dim.label}</span>
                  </div>
                  <div className="relative">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{dim.leftLabel}</span><span>{dim.rightLabel}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full shadow-lg shadow-primary/25 border-2 border-background"
                        initial={{ left: "50%" }}
                        animate={isInView ? { left: `${dim.value}%` } : {}}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring" }}
                        style={{ marginLeft: "-10px" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" />Core Values & Principles
              </p>
              <div className="grid grid-cols-2 gap-3">
                {traits.map((trait, index) => (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease, delay: index * 0.05 + 0.4 }}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <Target className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{trait}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const defaultWorkStyleDimensions: WorkStyleDimension[] = [
  { label: "Collaboration Style", leftLabel: "Independent", rightLabel: "Collaborative", value: 75, icon: Users },
  { label: "Decision Making", leftLabel: "Deliberate", rightLabel: "Fast-Moving", value: 65, icon: Zap },
  { label: "Problem Solving", leftLabel: "Analytical", rightLabel: "Intuitive", value: 40, icon: Brain },
  { label: "Communication", leftLabel: "Written", rightLabel: "Verbal", value: 55, icon: MessageSquare },
];
