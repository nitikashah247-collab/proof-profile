import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
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
            Show them who you are,{" "}
            <span className="text-primary">not just what you've done.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
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
              <Button size="lg" className="group shadow-lg shadow-primary/25">
                Create your Proof
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/demo">
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
              Trusted by professionals at leading companies
            </p>
            <div className="flex items-center justify-center gap-10 md:gap-16">
              {["Google", "Meta", "Stripe", "Linear", "Notion"].map((company) => (
                <span key={company} className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
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
                  <div className="px-4 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground font-mono">
                    sarah.getproof.app
                  </div>
                </div>
              </div>
              
              {/* Profile Content Preview */}
              <div className="p-8 md:p-10 min-h-[320px] bg-background">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl icon-gradient-bg flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/25">
                    SC
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">Sarah Chen</h3>
                    <p className="text-muted-foreground mb-4">Head of Product Marketing · San Francisco</p>
                    <p className="text-foreground/80 max-w-xl leading-relaxed">
                      I turn complex products into stories that resonate. 8+ years driving growth for B2B SaaS companies through positioning, messaging, and go-to-market strategy.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {["Product Marketing", "GTM Strategy", "B2B SaaS"].map((skill) => (
                        <span key={skill} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {skill}
                        </span>
                      ))}
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
