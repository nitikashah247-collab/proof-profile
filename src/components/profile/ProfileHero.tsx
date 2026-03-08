import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Calendar, MapPin, Building2, Briefcase, Users, Award } from "lucide-react";

const CountUp = ({ target, suffix = "" }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [glowing, setGlowing] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || target <= 0) return;
    started.current = true;

    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setGlowing(true);
        setTimeout(() => setGlowing(false), 800);
      }
    };

    const timer = setTimeout(() => requestAnimationFrame(tick), 800);
    return () => clearTimeout(timer);
  }, [target]);

  return (
    <span
      style={{
        color: glowing ? 'hsl(var(--primary))' : undefined,
        textShadow: glowing ? '0 0 20px hsl(var(--primary) / 0.5)' : 'none',
        transition: 'color 0.3s ease, text-shadow 0.3s ease',
      }}
    >
      {count}{suffix}
    </span>
  );
};

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
  primaryColor?: string;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const ProfileHero = ({
  name,
  title,
  location,
  company,
  tagline,
  photoUrl,
  stats,
  email,
  calendlyUrl,
  linkedinUrl,
  primaryColor,
}: ProfileHeroProps) => {
  const initials = name.split(" ").map(n => n[0]).join("");

  const contactEmail = email || "";
  const mailtoGetInTouch = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Inquiry from your Proof profile")}`
    : null;
  const scheduleLink = calendlyUrl || (contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Schedule a call")}`
    : null);

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
    },
  ].filter(Boolean) as Array<{
    icon: React.ElementType | null;
    value: number;
    suffix: string;
    label: string;
  }>;

  return (
    <section className="pb-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* ANIMATION 1: Photo with pulsing ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="relative -mt-12 mb-4 w-fit"
        >
          {/* Pulsing ring 1 */}
          <span
            className="absolute rounded-full border-2 border-primary"
            style={{ inset: '-6px', animation: 'photo-ring 3s ease-in-out infinite' }}
          />
          <span
            className="absolute rounded-full border border-primary"
            style={{ inset: '-6px', animation: 'photo-ring 3s ease-in-out infinite 1.5s' }}
          />

          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="relative w-24 h-24 rounded-full border-4 border-background object-cover shadow-md"
            />
          ) : (
            <div className="relative w-24 h-24 rounded-full border-4 border-background icon-gradient-bg flex items-center justify-center text-3xl font-bold text-white shadow-md">
              {initials}
            </div>
          )}
        </motion.div>

        {/* ANIMATION 5: Name with shimmer */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="text-3xl md:text-4xl font-semibold text-foreground"
        >
          {name}
        </motion.h1>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
          className="text-base md:text-lg text-muted-foreground mt-1"
        >
          {title}
        </motion.p>

        {/* Location + Company */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="flex items-center gap-3 text-sm text-muted-foreground mt-2"
        >
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location}
            </span>
          )}
          {location && company && (
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          )}
          {company && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {company}
            </span>
          )}
        </motion.div>

        {/* Bio — truncated 2 lines */}
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.25 }}
            className="text-sm text-muted-foreground mt-3 line-clamp-3 max-w-2xl"
          >
            {tagline}
          </motion.p>
        )}

        {/* ANIMATION 4: CTA Buttons — primary has breathing glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="flex flex-wrap items-center gap-3 mt-4"
        >
          {mailtoGetInTouch && (
            <Button className="rounded-full cta-breathing-glow" asChild>
              <a href={mailtoGetInTouch}>
                <Mail className="w-4 h-4 mr-2" />
                Get in touch
              </a>
            </Button>
          )}
          {scheduleLink && (
            <Button variant="outline" className="rounded-full" asChild>
              <a href={scheduleLink} target={calendlyUrl ? "_blank" : undefined} rel={calendlyUrl ? "noopener noreferrer" : undefined}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule a call
              </a>
            </Button>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="ml-1">
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </a>
          )}
        </motion.div>

        {/* Stats Bar */}
        {statItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.4 }}
            className="flex items-center gap-8 mt-6 pt-6 border-t border-border"
          >
            {statItems.map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-metrics font-bold text-foreground">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};
