import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Briefcase, TrendingUp, Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { IndustryCarousel } from "@/components/landing/IndustryCarousel";

type ProfileTab = "marketing" | "finance" | "engineering";

const profilePreviews: Record<
  ProfileTab,
  {
    url: string;
    demoPath: string;
    photo: string;
    name: string;
    role: string;
    location: string;
    bio: string;
    tags: string[];
    stats: { value: string; label: string }[];
    accentColor: string;
  }
> = {
  marketing: {
    url: "sarah-chen.showproof.app",
    demoPath: "/demo",
    photo: "/demo-sarah.png",
    name: "Sarah Chen",
    role: "Head of Product Marketing · London, UK",
    location: "London",
    bio: "Over a decade of turning complex B2B SaaS products into category-defining stories. I don't just market products — I build the strategic narratives that shift how markets think about a problem, then architect the go-to-market engine to capture it.",
    tags: ["Product-Led Growth", "Category Creation", "Revenue Marketing"],
    stats: [
      { value: "10+", label: "Years Experience" },
      { value: "$4.2M", label: "Pipeline Influenced" },
      { value: "3x", label: "Product Adoption Growth" },
      { value: "35%", label: "Shorter Sales Cycles" },
    ],
    accentColor: "#002bfe",
  },
  finance: {
    url: "mateo-tavares.showproof.app",
    demoPath: "/demo/finance",
    photo: "/demo-mateo.png",
    name: "Mateo Tavares",
    role: "Finance Business Partner · Sydney, AU",
    location: "Sydney",
    bio: "8+ years providing financial analysis and commercial insight to senior stakeholders across enterprise operations. I support decision-making through scenario modelling, variance analysis, and forecasting — ensuring capital allocation is grounded in data and aligned to strategic priorities.",
    tags: ["Commercial Finance", "Forecasting & Planning", "Stakeholder Advisory"],
    stats: [
      { value: "8+", label: "Years Experience" },
      { value: "$12M", label: "Annual Budget Managed" },
      { value: "15%", label: "Cost Reduction Delivered" },
    ],
    accentColor: "#111111",
  },
  engineering: {
    url: "james-whitfield.showproof.app",
    demoPath: "/demo/engineering",
    photo: "/demo-james.png",
    name: "James Whitfield",
    role: "VP of Engineering · Boston, US",
    location: "Boston",
    bio: "15+ years shipping reliable systems at scale and building the teams behind them. I've taken platform infrastructure from monolith to microservices, stood up SRE practices from scratch, and scaled engineering orgs from 5 to 80+ across fintech and health-tech.",
    tags: ["Platform Infrastructure", "Distributed Systems", "Engineering Operations"],
    stats: [
      { value: "15+", label: "Years Experience" },
      { value: "80+", label: "Engineers Managed" },
      { value: "73%", label: "Faster Deploy Cycles" },
    ],
    accentColor: "#00470d",
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
             <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-foreground"></span>
            </span>
            AI-Powered Career Profiles
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
            className="text-4xl md:text-6xl font-normal tracking-tight mb-8 leading-[1.1]"
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
            <a href="#how-it-works-video">
              <Button variant="outline" size="lg" className="rounded-full">
                <Play className="w-4 h-4" />
                See it in action
              </Button>
            </a>
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
            <button
              onClick={() => setActiveTab("engineering")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === "engineering"
                  ? "bg-foreground text-background shadow-lg shadow-black/10"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Engineering Leader
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
                    <div className="relative w-14 h-14 flex-shrink-0">
                      {/* Pulsing ring */}
                      <span
                        className="absolute inset-0 rounded-full border-2 border-foreground/30"
                        style={{ inset: '-4px', animation: 'photo-ring 3s ease-in-out infinite' }}
                      />
                      <span
                        className="absolute inset-0 rounded-full border border-foreground/20"
                        style={{ inset: '-4px', animation: 'photo-ring 3s ease-in-out infinite 1.5s' }}
                      />
                      <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-sm"
                      />
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

                      {/* Stats */}
                      {profile.stats && (
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
                          {profile.stats.map((stat, i) => (
                            <div key={i}>
                              <p className="text-lg font-bold text-foreground">{stat.value}</p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* View full profile link */}
          <div className="flex justify-center mt-6 mb-12">
            <Link
              to={profile.demoPath}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              View full {activeTab} profile →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};