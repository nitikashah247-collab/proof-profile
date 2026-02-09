import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Newspaper, Palette, Heart } from "lucide-react";

interface PersonalProject {
  title: string;
  type: "newsletter" | "design" | "community" | "side-project";
  description: string;
  detail: string;
  url?: string;
}

interface PersonalProjectsProps {
  projects: PersonalProject[];
}

const typeIcons = {
  newsletter: Newspaper,
  design: Palette,
  community: Heart,
  "side-project": Palette,
};

export const PersonalProjects = ({ projects }: PersonalProjectsProps) => {
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
          <h2 className="text-3xl font-bold mb-1">Personal Projects</h2>
          <p className="text-muted-foreground mb-8">
            Passion projects and creative work outside the day job
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const Icon = typeIcons[project.type];
              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                  <p className="text-sm text-primary/80 font-medium mb-2">
                    {project.description}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.detail}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                    >
                      View Project
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
