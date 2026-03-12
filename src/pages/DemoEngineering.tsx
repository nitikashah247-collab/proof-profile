import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProofLogo } from "@/components/brand/ProofLogo";
import { VisitorCoachOrb } from "@/components/profile/VisitorCoachOrb";
import { VisitorCoachDrawer } from "@/components/profile/VisitorCoachDrawer";

const DemoEngineering = () => {
  const [isAdvocateOpen, setIsAdvocateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 border-b border-border backdrop-blur-xl">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Viewing: james-whitfield.showproof.app
            </span>
            <Button size="sm">Edit Profile</Button>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-foreground/90 to-foreground/70 mt-[52px]" />

      {/* Hero */}
      <div className="container mx-auto px-6 -mt-16 mb-12">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-28 h-28 rounded-2xl bg-foreground text-background flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-background mb-6"
          >
            JW
          </motion.div>

          <h1 className="text-4xl font-bold mb-2">James Whitfield</h1>
          <p className="text-lg text-muted-foreground mb-4">
            VP of Engineering | Platform Architecture | Team Scaling
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Melbourne, AU
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" /> Health-Tech / Fintech
            </span>
          </div>

          <p className="text-foreground/80 max-w-2xl leading-relaxed mb-8">
            Engineering leader who builds the teams that build the product. 12+ years scaling engineering organisations from 5 to 80+, with a track record of shipping platforms that handle millions of daily transactions. Passionate about developer experience, platform reliability, and growing senior engineers into leaders.
          </p>

          <div className="flex gap-3 mb-10">
            <Button className="rounded-full">
              <Mail className="w-4 h-4 mr-2" /> Get in touch
            </Button>
            <Button variant="outline" className="rounded-full">
              <Calendar className="w-4 h-4 mr-2" /> Schedule a call
            </Button>
          </div>

          <div className="flex gap-8">
            {[
              { value: "12+", label: "Years Experience" },
              { value: "80+", label: "Engineers Managed" },
              { value: "99.97%", label: "Platform Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl font-bold block">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Impact Metrics</h2>
            <p className="text-2xl font-bold mb-8">Data-driven results that speak for themselves</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "4x", label: "Team Growth in 18 Months" },
                { value: "73%", label: "Reduction in Deploy Time" },
                { value: "$2.1M", label: "Infrastructure Savings" },
                { value: "99.97%", label: "Platform Uptime" },
              ].map((m) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 border border-border text-center"
                >
                  <span className="text-3xl font-bold block mb-1">{m.value}</span>
                  <span className="text-sm text-muted-foreground">{m.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Case Studies</h2>
            <p className="text-2xl font-bold mb-8">Impact Stories</p>

            <div className="bg-card rounded-xl border border-border p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold">73%</span>
                <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-muted">Platform Engineering</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Rebuilding the Deployment Pipeline at Scale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Led a complete overhaul of the CI/CD pipeline serving 12 product teams, reducing average deploy time from 45 minutes to 12 minutes while improving reliability from 94% to 99.8% success rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Expertise</h2>
            <p className="text-2xl font-bold mb-8">Skills & Expertise</p>
            <div className="flex flex-wrap gap-3">
              {["Engineering Leadership", "Platform Architecture", "Kubernetes", "AWS", "Terraform", "CI/CD", "Team Scaling", "System Design", "Python", "Go", "PostgreSQL", "Observability"].map(skill => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-card border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Advocate */}
      <VisitorCoachOrb
        primaryColor="#111111"
        currentInsight={null}
        onDismissInsight={() => {}}
        onOpenDrawer={() => setIsAdvocateOpen(true)}
        profileName="Priya Patel"
      />
      <VisitorCoachDrawer
        isOpen={isAdvocateOpen}
        onClose={() => setIsAdvocateOpen(false)}
        profileData={{
          full_name: "Priya Patel",
          headline: "VP of Engineering · Melbourne, AU",
          industry: "Health-Tech / Fintech",
          bio: "Engineering leader who builds the teams that build the product. 12+ years scaling engineering organisations from 5 to 80+.",
        }}
        sections={[]}
        primaryColor="#111111"
      />

      {/* Proof Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
        >
          <ProofLogo size="sm" showWordmark={false} />
          <span className="text-sm font-medium">Made with Proof</span>
        </Link>
      </div>
    </div>
  );
};

export default DemoEngineering;
