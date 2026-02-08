import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

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
    url: "sarah-chen.showproof.app",
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
    url: "michael-zhang.showproof.app",
    demoPath: "/demo/finance",
    initials: "MZ",
    name: "Michael Zhang",
    role: "Chief Financial Officer · Auckland, NZ",
    location: "Auckland",
    bio: "15 years driving financial strategy and operational excellence in high-growth tech. I turn ambitious growth plans into sustainable, fundable business models.",
    tags: ["Capital Raising", "FP&A", "Financial Modeling"],
    avatarBg: "bg-[hsl(222,47%,11%)]",
  },
};

export const Hero = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("marketing");
  const profile = profilePreviews[activeTab];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-powered career profiles
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-normal tracking-tight mb-6 leading-[1.1]"
          >
            Resumes are dead.{" "}
            <span className="text-primary">Show them who you really are.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Create a living profile that adapts to every opportunity.
            One identity, infinite versions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="group shadow-lg shadow-primary/25">
                Create your Proof
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to={profile.demoPath}>
              <Button variant="outline" size="lg">
                <Play className="w-4 h-4" />
                See a demo profile
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Adapts to any role, any industry
            </p>
            <div className="flex items-center justify-center gap-10 md:gap-16">
              {["Marketing", "Finance", "Engineering", "Design", "Operations"].map(
                (role) => (
                  <span
                    key={role}
                    className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  >
                    {role}
                  </span>
                )
              )}
            </div>
          </motion.div>
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
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "marketing"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              🎨 Marketing Leader
            </button>
            <button
              onClick={() => setActiveTab("finance")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === "finance"
                  ? "bg-[hsl(222,47%,11%)] text-white shadow-lg shadow-[hsl(222,47%,11%)]/25"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              📊 Finance Executive
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
                      className={`w-20 h-20 rounded-2xl ${profile.avatarBg} flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                        activeTab === "marketing"
                          ? "shadow-primary/25"
                          : "shadow-[hsl(222,47%,11%)]/25"
                      }`}
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
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              activeTab === "marketing"
                                ? "bg-primary/10 text-primary"
                                : "bg-[hsl(222,47%,11%)]/10 text-[hsl(222,47%,11%)]"
                            }`}
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
                              <span
                                className="text-xl font-bold block"
                                style={{ color: "hsl(38, 92%, 50%)" }}
                              >
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
              className="text-sm text-muted-foreground hover:text-primary transition-colors group"
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