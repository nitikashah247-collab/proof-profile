import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Award, Briefcase, Mic } from "lucide-react";

interface Credential {
  icon: "education" | "certification" | "advisory" | "speaking";
  title: string;
  subtitle: string;
}

interface CredentialsSectionProps {
  credentials: Credential[];
}

const iconMap = {
  education: GraduationCap,
  certification: Award,
  advisory: Briefcase,
  speaking: Mic,
};

export const CredentialsSection = ({ credentials }: CredentialsSectionProps) => {
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
          <h2 className="text-3xl font-bold mb-1">Credentials & Recognition</h2>
          <p className="text-muted-foreground mb-8">
            Professional qualifications and community involvement
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {credentials.map((cred, index) => {
              const Icon = iconMap[cred.icon];
              return (
                <motion.div
                  key={cred.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-[hsl(var(--exec-gold))] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "hsl(38 92% 50% / 0.12)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "hsl(38, 92%, 50%)" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-0.5">{cred.title}</h3>
                    <p className="text-sm text-muted-foreground">{cred.subtitle}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};