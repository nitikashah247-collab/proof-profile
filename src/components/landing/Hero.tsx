import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-muted-foreground text-sm font-medium mb-8"
          >
            <span>AI-powered career profiles</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground"
          >
            Show them who you are,{" "}
            <span className="text-primary">not just what you've done.</span>
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
              <Button size="lg" className="group">
                Create your Proof
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg">
                See a demo profile
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by professionals at
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 opacity-60">
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
          <div className="relative rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="rounded-xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background border border-border text-xs text-muted-foreground font-mono">
                    sarah.getproof.app
                  </div>
                </div>
              </div>
              
              {/* Profile Content Preview */}
              <div className="p-8 min-h-[300px] bg-background">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    SC
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1 text-foreground">Sarah Chen</h3>
                    <p className="text-muted-foreground mb-4">Head of Product Marketing · San Francisco</p>
                    <p className="text-foreground/80 max-w-xl">
                      I turn complex products into stories that resonate. 8+ years driving growth for B2B SaaS companies through positioning, messaging, and go-to-market strategy.
                    </p>
                    <div className="flex gap-3 mt-6">
                      <span className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-sm font-medium">
                        Product Marketing
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-sm font-medium">
                        GTM Strategy
                      </span>
                      <span className="px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-sm font-medium">
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