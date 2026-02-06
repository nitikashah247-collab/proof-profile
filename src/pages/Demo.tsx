import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Mail,
  Linkedin,
  Calendar,
  MapPin,
  Building2,
  TrendingUp,
  Users,
  Target,
  Quote,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

// Demo profile data for Executive archetype
const profileData = {
  name: "Sarah Chen",
  title: "Head of Product Marketing",
  location: "San Francisco, CA",
  tagline: "I turn complex products into stories that resonate. 8+ years driving growth for B2B SaaS companies through positioning, messaging, and go-to-market strategy.",
  skills: ["Product Marketing", "GTM Strategy", "B2B SaaS", "Positioning", "Team Leadership"],
  stats: [
    { label: "Revenue Influenced", value: "$47M+", icon: TrendingUp },
    { label: "Team Size", value: "12", icon: Users },
    { label: "Product Launches", value: "28", icon: Target },
  ],
  stories: [
    {
      title: "Repositioned enterprise product, driving 38% YoY growth",
      company: "Acme Corp",
      challenge: "Our flagship product was losing market share to newer competitors who positioned as 'modern' alternatives.",
      approach: "Led a complete repositioning effort: customer research, competitive analysis, new messaging framework, and sales enablement rollout.",
      outcome: "38% YoY revenue growth, 45% increase in qualified pipeline, and NPS jumped from 32 to 58.",
    },
    {
      title: "Launched AI feature to 10,000+ customers in 6 weeks",
      company: "Acme Corp",
      challenge: "Needed to bring our AI capabilities to market quickly as competitors were announcing similar features.",
      approach: "Built a cross-functional war room, created tiered launch strategy (beta → waitlist → GA), and developed 'AI for humans' narrative.",
      outcome: "Fastest product adoption in company history. Featured in TechCrunch, Forbes, and WSJ.",
    },
    {
      title: "Built and scaled PMM team from 2 to 12",
      company: "Previous Startup",
      challenge: "Joining as the second PMM, needed to build function while executing on aggressive growth targets.",
      approach: "Developed hiring rubric, created career ladders, and established PMM operating rhythm and rituals.",
      outcome: "Grew team 6x in 2 years. All original hires promoted. Zero regrettable attrition.",
    },
  ],
  testimonials: [
    {
      quote: "Sarah has an exceptional ability to take complex technical products and distill them into narratives that resonate with buyers. She's one of the best PMM leaders I've worked with.",
      author: "Alex Rivera",
      role: "CEO, Acme Corp",
    },
    {
      quote: "Working with Sarah transformed how we think about positioning. She doesn't just write messaging—she builds conviction across the entire org.",
      author: "Jordan Kim",
      role: "VP Sales, Acme Corp",
    },
  ],
  workStyle: [
    "Cross-functional partnership is my default mode",
    "Data-informed, not data-paralyzed",
    "I write to think and share to learn",
    "Strong opinions, loosely held",
  ],
  experience: [
    { company: "Acme Corp", role: "Head of Product Marketing", years: "2022 - Present" },
    { company: "Previous Startup", role: "Director, Product Marketing", years: "2019 - 2022" },
    { company: "Tech Giant", role: "Sr. Product Marketing Manager", years: "2016 - 2019" },
  ],
};

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back to Dashboard Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Viewing: sarah.getproof.app
            </span>
            <Button variant="hero" size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-[0.02]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start gap-8"
            >
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-proof flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-primary/20 flex-shrink-0">
                SC
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-2">{profileData.name}</h1>
                <p className="text-2xl text-muted-foreground mb-4">
                  {profileData.title}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {profileData.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    Acme Corp
                  </span>
                </div>
                <p className="text-lg text-foreground/80 mb-8 max-w-2xl">
                  {profileData.tagline}
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3">
                  <Button variant="hero" size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Get in touch
                  </Button>
                  <Button variant="outline" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule a call
                  </Button>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {profileData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-3 gap-4 mt-12"
            >
              {profileData.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl border border-border bg-card"
                >
                  <stat.icon className="w-6 h-6 text-primary mb-3" />
                  <p className="text-3xl font-bold mb-1 font-mono">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="text-3xl font-bold mb-8">Impact Stories</h2>

            <div className="space-y-6">
              {profileData.stories.map((story, index) => (
                <motion.div
                  key={story.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl border border-border bg-card"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">{story.company}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                        Challenge
                      </p>
                      <p className="text-sm text-muted-foreground">{story.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                        Approach
                      </p>
                      <p className="text-sm text-muted-foreground">{story.approach}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-proof-success uppercase tracking-wide mb-2">
                        Outcome
                      </p>
                      <p className="text-sm text-foreground font-medium">{story.outcome}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <h2 className="text-3xl font-bold mb-8">What People Say</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {profileData.testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl border border-border bg-card relative"
                >
                  <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                  <p className="text-foreground/80 mb-6 relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {testimonial.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Work Style & Experience */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl grid md:grid-cols-2 gap-12">
            {/* Work Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">How I Work</h2>
              <ul className="space-y-3">
                {profileData.workStyle.map((style, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground/80">{style}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold mb-6">Experience</h2>
              <div className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                      {exp.company.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{exp.role}</p>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mt-1">{exp.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Let's connect</h2>
            <p className="text-muted-foreground mb-8">
              Interested in working together? I'd love to hear from you.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="hero" size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Get in touch
              </Button>
              <Button variant="outline" size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-5 h-5 rounded bg-gradient-proof flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">P</span>
          </div>
          <span className="text-sm font-medium">Made with Proof</span>
        </Link>
      </div>
    </div>
  );
};

export default Demo;
