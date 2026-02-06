import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Skill {
  name: string;
  level: number; // 1-5
  yearsOfExperience: number;
  relatedCaseStudies: number[];
}

interface SkillsMatrixProps {
  skills: Skill[];
  activeSkill: string | null;
  onSkillClick: (skill: string | null) => void;
}

export const SkillsMatrix = ({ skills, activeSkill, onSkillClick }: SkillsMatrixProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getLevelLabel = (level: number) => {
    const labels = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    return labels[level - 1] || "Unknown";
  };

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <h2 className="text-3xl font-bold mb-2">Skills & Expertise</h2>
          <p className="text-muted-foreground mb-8">
            Click a skill to filter related case studies
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <motion.button
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => onSkillClick(activeSkill === skill.name ? null : skill.name)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 group ${
                  activeSkill === skill.name
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-semibold transition-colors ${
                    activeSkill === skill.name ? "text-primary" : "text-foreground"
                  }`}>
                    {skill.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {skill.yearsOfExperience}+ years
                  </span>
                </div>

                {/* Proficiency Bar */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${(skill.level / 5) * 100}%` } : {}}
                    transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {getLevelLabel(skill.level)}
                  </span>
                  {skill.relatedCaseStudies.length > 0 && (
                    <span className={`text-xs transition-colors ${
                      activeSkill === skill.name ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {skill.relatedCaseStudies.length} case {skill.relatedCaseStudies.length === 1 ? "study" : "studies"}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
