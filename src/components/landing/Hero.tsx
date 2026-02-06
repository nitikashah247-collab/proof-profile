import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-[0.02]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(262,83%,58%)]/20 rounded-full blur-[128px] animate-pulse-slow" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-powered career profiles</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Show them who you are,{" "}
            <span className="text-gradient">not just what you've done.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Create dynamic career profiles that adapt to every opportunity. 
            One profile, infinite tailored versions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Create your Proof
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="hero-outline" size="xl">
                See a demo profile
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by professionals at
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 opacity-50">
              {["Google", "Meta", "Stripe", "Linear", "Notion"].map((company) => (
                <span key={company} className="text-lg font-semibold text-muted-foreground">
                  {company}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Profile Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card p-1 shadow-2xl shadow-primary/5 glow">
            <div className="rounded-xl bg-background/50 backdrop-blur-sm overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-proof-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-proof-success/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-muted text-xs text-muted-foreground font-mono">
                    sarah.getproof.app
                  </div>
                </div>
              </div>
              
              {/* Profile Content Preview */}
              <div className="p-8 min-h-[300px] bg-gradient-to-b from-transparent to-muted/20">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-proof flex items-center justify-center text-2xl font-bold text-white">
                    SC
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Sarah Chen</h3>
                    <p className="text-muted-foreground mb-4">Head of Product Marketing · San Francisco</p>
                    <p className="text-foreground/80 max-w-xl">
                      I turn complex products into stories that resonate. 8+ years driving growth for B2B SaaS companies through positioning, messaging, and go-to-market strategy.
                    </p>
                    <div className="flex gap-3 mt-6">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        Product Marketing
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        GTM Strategy
                      </span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        B2B SaaS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
