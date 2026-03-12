import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Briefcase, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { IndustryCarousel } from "@/components/landing/IndustryCarousel";

type ProfileTab = "marketing" | "finance";

const profilePreviews: Record<
  ProfileTab,
  {
    url: string;
    demoPath: string;
    initials: string;
    name: string;
    role: string;
    location: string;
    bio: string;
    tags: string[];
    avatarBg: string;
  }
> = {
  marketing: {
    url: "sarah-chen.proof.app",
    demoPath: "/demo",
    initials: "SC",
    name: "Sarah Chen",
    role: "Head of Product Marketing · San Francisco",
    location: "San Francisco",
    bio: "I turn complex products into stories that resonate. 8+ years driving growth for B2B SaaS companies through positioning, messaging, and go-to-market strategy.",
    tags: ["Product Marketing", "GTM Strategy", "B2B SaaS"],
    avatarBg: "icon-gradient-bg",
  },
  finance: {
    url: "michael-zhang.proof.app",
    demoPath: "/demo/finance",
    initials: "MZ",
    name: "Michael Zhang",
    role: "Chief Financial Officer · Auckland, NZ",
    location: "Auckland",
    bio: "15 years driving financial strategy and operational excellence in high-growth tech. I turn ambitious growth plans into sustainable, fundable business models.",
    tags: ["Capital Raising", "FP&A", "Financial Modeling"],
    avatarBg: "bg-foreground",
  },
};

export const Hero = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("marketing");
  const profile = profilePreviews[activeTab];
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateProof = () => {
    if (user) {
      toast({ title: "You already have a profile!", description: "Redirecting to your dashboard." });
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-foreground text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ada5a5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ada5a5]"></span>
            </span>
            The career profile, reinvented
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-2 leading-[1.1]"
          >
            Resumes are dead.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-4xl md:text-6xl font-extralight tracking-tight mb-8 leading-[1.1]"
          >
            <span className="italic">Show them who you really are.</span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl font-normal text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Proof builds a living career profile from your resume and a short AI conversation. Evidence-backed. Beautifully designed. With an AI advocate that represents you — even when you're not in the room.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="group rounded-full shadow-lg shadow-black/10" onClick={handleCreateProof}>
              Create your Proof
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link to={profile.demoPath}>
              <Button variant="outline" size="lg" className="rounded-full">
                <Play className="w-4 h-4" />
                See it in action
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <IndustryCarousel />
        </div>

        {/* Profile Preview Card with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          {/* Profile Type Tabs */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab("marketing")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "marketing"
                  ? "bg-foreground text-background shadow-lg shadow-black/10"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Marketing Leader
            </button>
            <button
              onClick={() => setActiveTab("finance")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "finance"
                  ? "bg-foreground text-background shadow-lg shadow-black/10"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Finance Executive
            </button>
          </div>

          <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-black/5">
            <div className="rounded-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground font-mono"
                    >
                      {profile.url}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Profile Content Preview */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "finance" ? 30 : -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "finance" ? -30 : 30 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="p-8 md:p-10 min-h-[320px] bg-background"
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div
                      className={`w-20 h-20 rounded-2xl ${profile.avatarBg} flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg shadow-black/10`}
                    >
                      {profile.initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                      <p className="text-muted-foreground mb-4">{profile.role}</p>
                      <p className="text-foreground/80 max-w-xl leading-relaxed">
                        {profile.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-6">
                        {profile.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-accent text-accent-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Key Stats Row - Finance specific */}
                      {activeTab === "finance" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-border"
                        >
                          {[
                            { value: "$85M", label: "Capital Raised" },
                            { value: "22%", label: "Cost Reduction" },
                            { value: "3x", label: "Revenue Growth" },
                            { value: "12", label: "Team Built" },
                          ].map((stat) => (
                            <div key={stat.label} className="text-center">
                              <span className="text-xl font-bold block text-foreground">
                                {stat.value}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {stat.label}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* View full profile link */}
          <div className="flex justify-center mt-6">
            <Link
              to={profile.demoPath}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              View full {activeTab === "marketing" ? "marketing" : "finance"}{" "}
              profile →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};