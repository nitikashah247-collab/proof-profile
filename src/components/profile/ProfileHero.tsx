import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Calendar, MapPin, Building2, Briefcase, Users, Award } from "lucide-react";
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

  return (
    <section className="pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-[0.02]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start gap-8"
          >
            {/* Photo/Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative group"
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-36 h-36 rounded-2xl object-cover shadow-2xl shadow-primary/20 border-4 border-background"
                />
              ) : (
                <div className="w-36 h-36 rounded-2xl icon-gradient-bg flex items-center justify-center text-5xl font-bold text-white shadow-2xl shadow-primary/20">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-background flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                {name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground mb-4"
              >
                {title}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {company}
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg text-foreground/80 mb-8 max-w-2xl"
              >
                {tagline}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3"
              >
                {mailtoGetInTouch && (
                  <Button size="lg" asChild>
                    <a href={mailtoGetInTouch}>
                      <Mail className="w-5 h-5 mr-2" />
                      Get in touch
                    </a>
                  </Button>
                )}
                {scheduleLink && (
                  <Button variant="outline" size="lg" asChild>
                    <a href={scheduleLink} target={calendlyUrl ? "_blank" : undefined} rel={calendlyUrl ? "noopener noreferrer" : undefined}>
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule a call
                    </a>
                  </Button>
                )}
                {linkedinUrl && (
                  <Button variant="ghost" size="icon" className="ml-2" asChild>
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Skills - Clickable Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => onSkillClick(activeSkill === skill ? null : skill)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeSkill === skill
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                    : activeSkill === null
                    ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    : "bg-muted text-muted-foreground border-border opacity-50 hover:opacity-75"
                }`}
              >
                {skill}
              </button>
            ))}
            {activeSkill && (
              <button
                onClick={() => onSkillClick(null)}
                className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filter ×
              </button>
            )}
          </motion.div>

          {/* Quick Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-6 rounded-2xl border border-border bg-card"
          >
            <div className="text-center md:text-left md:border-r border-border">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">
                  <AnimatedCounter value={stats.yearsExperience} suffix="+" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Years Experience</p>
            </div>
            <div className="text-center md:text-left md:border-r border-border">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">
                  <AnimatedCounter value={stats.projectsLed} suffix="+" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Projects Led</p>
            </div>
            <div className="text-center md:text-left md:border-r border-border">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold">
                  <AnimatedCounter value={stats.teamsManaged} suffix="+" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">People Managed</p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="text-2xl font-bold text-primary">
                  <AnimatedCounter 
                    value={stats.keyMetric.value} 
                    suffix={stats.keyMetric.suffix} 
                  />
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{stats.keyMetric.label}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
