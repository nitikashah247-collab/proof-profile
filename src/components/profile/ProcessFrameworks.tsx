import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface ProcessStep {
  label: string;
  description: string;
}

interface Framework {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

interface ProcessFrameworksProps {
  frameworks: Framework[];
}

export const ProcessFrameworks = ({ frameworks }: ProcessFrameworksProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-1">Process & Frameworks</h2>
          <p className="text-muted-foreground mb-8">
            Systems and methodologies I've built to drive repeatable results
          </p>

          <div className="space-y-8">
            {frameworks.map((framework, fIdx) => (
              <motion.div
                key={framework.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: fIdx * 0.15 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <h3 className="text-xl font-bold mb-1">{framework.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {framework.subtitle}
                </p>

                <div className="flex flex-wrap items-start gap-2">
                  {framework.steps.map((step, sIdx) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: fIdx * 0.15 + sIdx * 0.08 }}
                        className="flex flex-col items-center text-center max-w-[140px]"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 border border-primary/20">
                          <span className="text-lg font-bold text-primary">
                            {sIdx + 1}
                          </span>
                        </div>
                        <p className="text-sm font-semibold leading-tight">{step.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                          {step.description}
                        </p>
                      </motion.div>
                      {sIdx < framework.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
