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

export const SkillsMatrix = ({ skills, activeSkill, onSkillClick }: SkillsMatrixProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getLevelLabel = (level: number) => {
    const labels = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    return labels[level - 1] || "Unknown";
  };

  // Deduplicate
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
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => onSkillClick(activeSkill === skill.name ? null : skill.name)}
      className={`flex items-center gap-2 bg-card border rounded-full px-4 py-2 text-sm transition-all ${
        activeSkill === skill.name
          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
          : "border-border hover:border-primary/30 hover:shadow-sm"
      }`}
    >
      <span className="font-medium text-foreground">{skill.name}</span>
      <span className="text-xs text-muted-foreground">{skill.yearsOfExperience}y</span>
      <span className="text-xs text-muted-foreground capitalize">· {getLevelLabel(skill.level)}</span>
    </motion.button>
  );

  const renderCategory = (label: string, items: Skill[], startIndex: number) => (
    <div className="mb-8" key={label}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, i) => renderSkillPill(skill, startIndex + i))}
      </div>
    </div>
  );

  return (
    <section ref={ref} className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl"
        >
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">Expertise</p>
            <h2 className="text-2xl font-semibold text-foreground">Skills & Expertise</h2>
            <p className="text-sm text-muted-foreground mt-1">Click a skill to filter related case studies</p>
          </div>

          {hasCategorization ? (
            <div>
              {coreCompetencies.length > 0 && renderCategory("Core Competencies", coreCompetencies, 0)}
              {technicalProficiencies.length > 0 && renderCategory("Technical Proficiencies", technicalProficiencies, coreCompetencies.length)}
              {uncategorized.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uncategorized.map((skill, i) => renderSkillPill(skill, coreCompetencies.length + technicalProficiencies.length + i))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {deduped.map((skill, i) => renderSkillPill(skill, i))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
