import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

interface AdvisoryRole {
  company: string;
  stage: string;
  focus: string;
  description: string;
  logoUrl?: string;
}

interface AdvisoryRolesProps {
  roles: AdvisoryRole[];
}

export const AdvisoryRoles = ({ roles }: AdvisoryRolesProps) => {
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
          <h2 className="text-3xl font-bold mb-1">Advisory Roles</h2>
          <p className="text-muted-foreground mb-8">
            Startups and organisations where I provide strategic guidance
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.company}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                    {role.logoUrl ? (
                      <img
                        src={role.logoUrl}
                        alt={role.company}
                        className="h-8 object-contain"
                      />
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">
                        {role.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{role.company}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary uppercase">
                        {role.stage}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {role.focus}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
