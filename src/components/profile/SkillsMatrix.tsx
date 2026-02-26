import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Skill {
  name: string;
  level: number; // 1-5
  yearsOfExperience: number;
  relatedCaseStudies: number[];
  category?: string;
}

interface SkillsMatrixProps {
  skills: Skill[];
  activeSkill: string | null;
  onSkillClick: (skill: string | null) => void;
}

const EASE = [0.22, 1, 0.36, 1];

export const SkillsMatrix = ({ skills, activeSkill, onSkillClick }: SkillsMatrixProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const getLevelLabel = (level: number) => {
    const labels = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    return labels[level - 1] || "Unknown";
  };

  // Deduplicate skills by name
  const deduped = (() => {
    const seen = new Map<string, Skill>();
    for (const skill of skills) {
      const key = skill.name.toLowerCase().trim();
      if (seen.has(key)) {
        const existing = seen.get(key)!;
        if (skill.level > existing.level) seen.set(key, skill);
      } else {
        seen.set(key, skill);
      }
    }
    return Array.from(seen.values());
  })();

  const coreCompetencies = deduped.filter(s => s.category === "Core Competency");
  const technicalProficiencies = deduped.filter(s => s.category === "Technical Proficiency");
  const uncategorized = deduped.filter(s => s.category !== "Core Competency" && s.category !== "Technical Proficiency");
  const hasCategorization = coreCompetencies.length > 0 || technicalProficiencies.length > 0;

  const renderSkillPill = (skill: Skill, index: number) => (
    <motion.button
      key={skill.name}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05, ease: EASE as any }}
      onClick={() => onSkillClick(activeSkill === skill.name ? null : skill.name)}
      className={`group relative rounded-full px-5 py-2.5 text-sm font-medium border transition-all duration-300 ${
        activeSkill === skill.name
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
          : "bg-primary/8 border-primary/15 text-foreground hover:bg-primary/15 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      }`}
    >
      <span>{skill.name}</span>
      <span className={`ml-2 text-xs ${
        activeSkill === skill.name ? "text-primary-foreground/70" : "text-muted-foreground"
      }`}>
        {skill.yearsOfExperience}y · {getLevelLabel(skill.level)}
      </span>
    </motion.button>
  );

  const renderCategoryGroup = (title: string, items: Skill[], startIndex: number) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{title}</h3>
        <div className="flex flex-wrap gap-3">
          {items.map((skill, index) => renderSkillPill(skill, startIndex + index))}
        </div>
      </div>
    );
  };

  return (
    <section ref={ref} className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE as any }}
          className="max-w-5xl"
        >
          <p className="section-overline mb-2">Expertise</p>
          <h2 className="section-heading text-4xl mb-3 text-foreground">Skills & Expertise</h2>
          <p className="text-muted-foreground mb-10">
            Click a skill to filter related case studies
          </p>

          {hasCategorization ? (
            <div className="space-y-8">
              {renderCategoryGroup("Core Competencies", coreCompetencies, 0)}
              {renderCategoryGroup("Technical Proficiencies", technicalProficiencies, coreCompetencies.length)}
              {uncategorized.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {uncategorized.map((skill, index) => renderSkillPill(skill, coreCompetencies.length + technicalProficiencies.length + index))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {deduped.map((skill, index) => renderSkillPill(skill, index))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
