import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Zap, Brain, MessageSquare, Target, Heart } from "lucide-react";

interface WorkStyleDimension {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number; // 0-100, 50 is center
  icon: React.ElementType;
}

interface WorkStyleVisualProps {
  dimensions: WorkStyleDimension[];
  traits: string[];
}

const EASE = [0.22, 1, 0.36, 1];

export const WorkStyleVisual = ({ dimensions, traits }: WorkStyleVisualProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE as any }}
          className="max-w-4xl"
        >
          <p className="section-overline mb-2">Preferences</p>
          <h2 className="section-heading text-4xl mb-3 text-foreground">How I Work</h2>
          <p className="text-muted-foreground mb-12">My working style and preferences</p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Slider Dimensions */}
            <div className="space-y-8">
              {dimensions.map((dim, index) => (
                <motion.div
                  key={dim.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: EASE as any }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <dim.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{dim.label}</span>
                  </div>

                  <div className="relative">
                    <div className="flex justify-between text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      <span>{dim.leftLabel}</span>
                      <span>{dim.rightLabel}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full relative overflow-hidden">
                      {/* Gradient fill */}
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.3), hsl(var(--primary)))" }}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${dim.value}%` } : {}}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: EASE as any }}
                      />
                      {/* Marker */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/25 border-2 border-background"
                        initial={{ left: "50%" }}
                        animate={isInView ? { left: `${dim.value}%` } : {}}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: "spring" }}
                        style={{ marginLeft: "-8px" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Traits — horizontal row of glass pills */}
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5" />
                Core Values & Principles
              </p>
              <div className="flex flex-wrap gap-3">
                {traits.map((trait, index) => (
                  <motion.div
                    key={trait}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.06 + 0.4, ease: EASE as any }}
                    className="glass-card rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary/30 transition-colors"
                  >
                    {trait}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const defaultWorkStyleDimensions: WorkStyleDimension[] = [
  {
    label: "Collaboration Style",
    leftLabel: "Independent",
    rightLabel: "Collaborative",
    value: 75,
    icon: Users,
  },
  {
    label: "Decision Making",
    leftLabel: "Deliberate",
    rightLabel: "Fast-Moving",
    value: 65,
    icon: Zap,
  },
  {
    label: "Problem Solving",
    leftLabel: "Analytical",
    rightLabel: "Intuitive",
    value: 40,
    icon: Brain,
  },
  {
    label: "Communication",
    leftLabel: "Written",
    rightLabel: "Verbal",
    value: 55,
    icon: MessageSquare,
  },
];
