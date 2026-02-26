import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Calendar, MapPin, Building2, Briefcase, Award, Users } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface ProfileHeroProps {
  name: string;
  title: string;
  location: string;
  company: string;
  tagline: string;
  photoUrl?: string;
  skills: string[];
  activeSkill: string | null;
  onSkillClick: (skill: string | null) => void;
  stats: {
    yearsExperience: number;
    projectsLed: number;
    teamsManaged: number;
    keyMetric: { value: number; label: string; suffix: string };
  };
  email?: string;
  calendlyUrl?: string;
  linkedinUrl?: string;
}

const appleEase = [0.22, 1, 0.36, 1] as const;

export const ProfileHero = ({
  name,
  title,
  location,
  company,
  tagline,
  photoUrl,
  skills,
  activeSkill,
  onSkillClick,
  stats,
  email,
  calendlyUrl,
  linkedinUrl,
}: ProfileHeroProps) => {
  const initials = name.split(" ").map(n => n[0]).join("");

  const contactEmail = email || "";
  const mailtoGetInTouch = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Inquiry from your Proof profile")}`
    : null;
  const scheduleLink = calendlyUrl || (contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Schedule a call")}`
    : null);

  // Build stat items, filtering out zeros
  const statItems = [
    stats.yearsExperience > 0 && {
      icon: Briefcase,
      value: stats.yearsExperience,
      suffix: "+",
      label: "Years Experience",
    },
    stats.projectsLed > 0 && {
      icon: Award,
      value: stats.projectsLed,
      suffix: "+",
      label: "Projects Led",
    },
    stats.teamsManaged > 0 && {
      icon: Users,
      value: stats.teamsManaged,
      suffix: "+",
      label: "People Managed",
    },
    stats.keyMetric.value > 0 && {
      icon: null as React.ElementType | null,
      value: stats.keyMetric.value,
      suffix: stats.keyMetric.suffix,
      label: stats.keyMetric.label,
      isPrimary: true,
    },
  ].filter(Boolean) as Array<{
    icon: React.ElementType | null;
    value: number;
    suffix: string;
    label: string;
    isPrimary?: boolean;
  }>;

  return (
    <section className="pt-32 pb-24 lg:pb-32 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Small avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: appleEase as any }}
              className="shrink-0"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-xl shadow-primary/10 border-2 border-background"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl icon-gradient-bg flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-primary/10">
                  {initials}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              {/* Name — editorial serif */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: appleEase as any, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-normal tracking-[-0.03em] leading-[1.05] mb-3"
              >
                {name}
              </motion.h1>

              {/* Headline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: appleEase as any, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground mb-5 max-w-2xl"
              >
                {title}
              </motion.p>

              {/* Location + Company */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: appleEase as any, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {company}
                </span>
              </motion.div>

              {/* Tagline */}
              {tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: appleEase as any, delay: 0.35 }}
                  className="text-base text-foreground/70 mb-10 max-w-2xl leading-relaxed"
                >
                  {tagline}
                </motion.p>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: appleEase as any, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3"
              >
                {mailtoGetInTouch && (
                  <Button size="lg" className="rounded-full px-8" asChild>
                    <a href={mailtoGetInTouch}>
                      <Mail className="w-4 h-4 mr-2" />
                      Get in touch
                    </a>
                  </Button>
                )}
                {scheduleLink && (
                  <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                    <a href={scheduleLink} target={calendlyUrl ? "_blank" : undefined} rel={calendlyUrl ? "noopener noreferrer" : undefined}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule a call
                    </a>
                  </Button>
                )}
                {linkedinUrl && (
                  <Button variant="ghost" size="icon" className="rounded-full ml-1" asChild>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </div>

          {/* Glassmorphism Stats Bar */}
          {statItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: appleEase as any, delay: 0.5 }}
              className="bg-white/60 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 mt-14"
            >
              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: `repeat(${Math.min(statItems.length, 4)}, 1fr)` }}
              >
                {statItems.map((stat, i) => (
                  <div
                    key={i}
                    className={`text-center md:text-left ${
                      i < statItems.length - 1 ? "md:border-r border-border/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      {stat.icon && <stat.icon className="w-4 h-4 text-primary/60" />}
                      <span className="text-3xl font-mono font-semibold tracking-tight text-foreground">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
