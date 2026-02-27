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

  // Deduplicate skills by name (case-insensitive), keep highest level
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

  // Split into two groups
  const coreCompetencies = deduped.filter(s => s.category === "Core Competency");
  const technicalProficiencies = deduped.filter(s => s.category === "Technical Proficiency");
  const uncategorized = deduped.filter(s => s.category !== "Core Competency" && s.category !== "Technical Proficiency");

  // If no categorization, show all in one grid
  const hasCategorization = coreCompetencies.length > 0 || technicalProficiencies.length > 0;

  const renderSkillCard = (skill: Skill, index: number) => (
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
          activeSkill === skill.name ? "text-foreground" : "text-foreground"
        }`}>
          {skill.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {skill.yearsOfExperience}+ years
        </span>
      </div>

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
            activeSkill === skill.name ? "text-muted-foreground" : "text-muted-foreground"
          }`}>
            {skill.relatedCaseStudies.length} case {skill.relatedCaseStudies.length === 1 ? "study" : "studies"}
          </span>
        )}
      </div>
    </motion.button>
  );

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

          {hasCategorization ? (
            <div className="space-y-10">
              {coreCompetencies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Core Competencies</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {coreCompetencies.map((skill, index) => renderSkillCard(skill, index))}
                  </div>
                </div>
              )}
              {technicalProficiencies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Technical Proficiencies</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {technicalProficiencies.map((skill, index) => renderSkillCard(skill, index + coreCompetencies.length))}
                  </div>
                </div>
              )}
              {uncategorized.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {uncategorized.map((skill, index) => renderSkillCard(skill, index + coreCompetencies.length + technicalProficiencies.length))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {deduped.map((skill, index) => renderSkillCard(skill, index))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
