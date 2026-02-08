import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Users, Zap, Brain, MessageSquare } from "lucide-react";

// Profile Components
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ImpactCharts } from "@/components/profile/ImpactCharts";
import { CaseStudyCard } from "@/components/profile/CaseStudyCard";
import { CareerTimeline } from "@/components/profile/CareerTimeline";
import { SkillsMatrix } from "@/components/profile/SkillsMatrix";
import { TestimonialsCarousel } from "@/components/profile/TestimonialsCarousel";
import { WorkStyleVisual, defaultWorkStyleDimensions } from "@/components/profile/WorkStyleVisual";
import { PortfolioGallery } from "@/components/profile/PortfolioGallery";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { AnalyticsPreview } from "@/components/profile/AnalyticsPreview";

// Demo profile data
const profileData = {
  name: "Sarah Chen",
  title: "Head of Product Marketing",
  location: "San Francisco, CA",
  company: "Acme Corp",
  tagline: "I turn complex products into stories that resonate. 8+ years driving growth for B2B SaaS companies through positioning, messaging, and go-to-market strategy.",
  photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  skills: ["Product Marketing", "GTM Strategy", "B2B SaaS", "Positioning", "Team Leadership", "Competitive Analysis", "Sales Enablement"],
  stats: {
    yearsExperience: 8,
    projectsLed: 28,
    teamsManaged: 45,
    keyMetric: { value: 38, label: "YoY Growth", suffix: "%" },
  },
  caseStudies: [
    {
      title: "Repositioned enterprise product, driving 38% YoY growth",
      company: "Acme Corp",
      keyMetric: "38%",
      summary: "Led complete repositioning of flagship enterprise product to compete with modern alternatives.",
      challenge: "Our flagship product was losing market share to newer competitors who positioned as 'modern' alternatives. Win rates dropped 15% in 6 months.",
      approach: "Led a complete repositioning effort: 42 customer interviews, competitive analysis of 8 players, new messaging framework, and a 3-month sales enablement rollout across 200+ reps.",
      outcome: "38% YoY revenue growth, 45% increase in qualified pipeline, and NPS jumped from 32 to 58. Featured as case study at SaaStr Annual.",
      skills: ["Positioning", "GTM Strategy", "Competitive Analysis", "Sales Enablement"],
      testimonial: {
        quote: "Sarah's repositioning work was transformational. She didn't just change our messaging—she changed how we think about our market.",
        author: "Alex Rivera",
        role: "CEO, Acme Corp",
      },
    },
    {
      title: "Launched AI feature to 10,000+ customers in 6 weeks",
      company: "Acme Corp",
      keyMetric: "10K+",
      summary: "Brought AI capabilities to market with record-breaking adoption through strategic launch planning.",
      challenge: "Needed to bring our AI capabilities to market quickly as competitors were announcing similar features. Leadership wanted launch in 8 weeks.",
      approach: "Built a cross-functional war room (eng, design, legal, support), created tiered launch strategy (beta → waitlist → GA), and developed 'AI for humans' narrative that differentiated from technical competitors.",
      outcome: "Fastest product adoption in company history. 10,000+ users in first month. Featured in TechCrunch, Forbes, and WSJ. Zero critical incidents.",
      skills: ["Product Marketing", "GTM Strategy", "B2B SaaS"],
      images: ["1", "2", "3"],
    },
    {
      title: "Built and scaled PMM team from 2 to 12",
      company: "Previous Startup",
      keyMetric: "6x",
      summary: "Grew product marketing function while maintaining execution velocity on growth targets.",
      challenge: "Joining as the second PMM, needed to build function while executing on aggressive growth targets. Company growing 3x annually.",
      approach: "Developed hiring rubric focused on 'athletes' over specialists, created career ladders with clear competencies, and established PMM operating rhythm (weekly syncs, monthly reviews, quarterly planning).",
      outcome: "Grew team 6x in 2 years. All 4 original hires promoted at least once. Zero regrettable attrition. Team NPS of 92.",
      skills: ["Team Leadership", "B2B SaaS"],
    },
    {
      title: "Created sales enablement program adopted by 500+ reps",
      company: "Tech Giant",
      keyMetric: "$2.3M",
      summary: "Designed and launched comprehensive enablement program that directly impacted revenue.",
      challenge: "Sales team struggling with new product messaging. Ramp time for new hires was 6+ months. Win rates inconsistent across regions.",
      approach: "Built modular enablement curriculum, created competitive battlecards, launched monthly 'customer story' series, and partnered with sales ops on tracking adoption.",
      outcome: "Ramp time reduced to 3 months. Win rates improved 23% globally. $2.3M in influenced pipeline from enablement materials alone.",
      skills: ["Sales Enablement", "Competitive Analysis", "B2B SaaS"],
    },
  ],
  timeline: [
    {
      company: "Acme Corp",
      role: "Head of Product Marketing",
      startYear: "2022",
      endYear: "Present",
      achievements: [
        "Repositioned enterprise product driving 38% YoY growth",
        "Launched AI feature to 10,000+ customers in 6 weeks",
        "Built PMM analytics practice from scratch",
        "Promoted to leadership team in 18 months",
      ],
    },
    {
      company: "Previous Startup",
      role: "Director, Product Marketing",
      startYear: "2019",
      endYear: "2022",
      achievements: [
        "Scaled team from 2 to 12 PMMs",
        "Led Series C messaging and positioning",
        "Created first competitive intelligence function",
        "Achieved team NPS of 92",
      ],
    },
    {
      company: "Tech Giant",
      role: "Sr. Product Marketing Manager",
      startYear: "2016",
      endYear: "2019",
      achievements: [
        "Created sales enablement program for 500+ reps",
        "Launched 3 major product lines",
        "Influenced $2.3M in pipeline through enablement",
        "Promoted twice in 3 years",
      ],
    },
  ],
  skillsData: [
    { name: "Product Marketing", level: 5, yearsOfExperience: 8, relatedCaseStudies: [0, 1] },
    { name: "GTM Strategy", level: 5, yearsOfExperience: 7, relatedCaseStudies: [0, 1] },
    { name: "B2B SaaS", level: 5, yearsOfExperience: 8, relatedCaseStudies: [0, 1, 2, 3] },
    { name: "Positioning", level: 5, yearsOfExperience: 6, relatedCaseStudies: [0] },
    { name: "Team Leadership", level: 4, yearsOfExperience: 5, relatedCaseStudies: [2] },
    { name: "Competitive Analysis", level: 4, yearsOfExperience: 6, relatedCaseStudies: [0, 3] },
    { name: "Sales Enablement", level: 4, yearsOfExperience: 5, relatedCaseStudies: [0, 3] },
    { name: "Customer Research", level: 4, yearsOfExperience: 7, relatedCaseStudies: [] },
  ],
  testimonials: [
    {
      quote: "Sarah has an exceptional ability to take complex technical products and distill them into narratives that resonate with buyers. She's one of the best PMM leaders I've worked with in 20 years.",
      author: "Alex Rivera",
      role: "CEO",
      company: "Acme Corp",
    },
    {
      quote: "Working with Sarah transformed how we think about positioning. She doesn't just write messaging—she builds conviction across the entire org. Our sales team went from confused to confident.",
      author: "Jordan Kim",
      role: "VP Sales",
      company: "Acme Corp",
    },
    {
      quote: "Sarah built our PMM function from the ground up. Her leadership style creates high-performing teams that actually enjoy coming to work. Everyone she hired is still thriving.",
      author: "Morgan Lee",
      role: "COO",
      company: "Previous Startup",
    },
  ],
  workStyleTraits: [
    "Data-informed decisions",
    "Cross-functional collaboration",
    "Strong opinions, loosely held",
    "Write to think, share to learn",
    "Customer obsessed",
    "Bias for action",
  ],
  portfolio: [
    { id: "1", title: "Product Launch Deck", description: "AI feature launch presentation for executive team", type: "screenshot" as const },
    { id: "2", title: "Competitive Analysis", description: "Quarterly competitive landscape report", type: "pdf" as const },
    { id: "3", title: "Messaging Framework", description: "Enterprise repositioning messaging guide", type: "screenshot" as const },
    { id: "4", title: "Case Study Video", description: "Customer success story for enterprise segment", type: "link" as const },
    { id: "5", title: "Sales Battlecard", description: "Competitive positioning for sales team", type: "pdf" as const },
    { id: "6", title: "Launch Blog Post", description: "Product announcement blog on company site", type: "link" as const },
  ],
  analytics: {
    totalViews: 1247,
    avgTimeOnPage: "3m 42s",
    topSection: "Case Studies",
    viewsThisWeek: 89,
  },
};

const Demo = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  // Filter case studies based on active skill
  const filteredCaseStudies = activeSkill
    ? profileData.caseStudies.filter((study) =>
        study.skills.includes(activeSkill)
      )
    : profileData.caseStudies;

  return (
    <div className="min-h-screen bg-background">
      {/* Back to Dashboard Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 border-b border-border backdrop-blur-xl">
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
              Viewing: sarah-chen.showproof.app
            </span>
            <Button size="sm">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <ProfileHero
        name={profileData.name}
        title={profileData.title}
        location={profileData.location}
        company={profileData.company}
        tagline={profileData.tagline}
        photoUrl={profileData.photoUrl}
        skills={profileData.skills}
        activeSkill={activeSkill}
        onSkillClick={setActiveSkill}
        stats={profileData.stats}
      />

      {/* Impact Charts */}
      <ImpactCharts />

      {/* Case Studies Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Impact Stories</h2>
                <p className="text-muted-foreground">
                  {activeSkill
                    ? `Showing ${filteredCaseStudies.length} stories related to "${activeSkill}"`
                    : "Click a skill above to filter by expertise"}
                </p>
              </div>
              {activeSkill && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSkill(null)}
                >
                  Clear filter ×
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {filteredCaseStudies.map((study, index) => (
                <CaseStudyCard
                  key={study.title}
                  study={study}
                  index={index}
                  isHighlighted={
                    activeSkill ? study.skills.includes(activeSkill) : true
                  }
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Matrix */}
      <SkillsMatrix
        skills={profileData.skillsData}
        activeSkill={activeSkill}
        onSkillClick={setActiveSkill}
      />

      {/* Career Timeline */}
      <CareerTimeline entries={profileData.timeline} />

      {/* Testimonials Carousel */}
      <TestimonialsCarousel testimonials={profileData.testimonials} />

      {/* Work Style */}
      <WorkStyleVisual
        dimensions={defaultWorkStyleDimensions}
        traits={profileData.workStyleTraits}
      />

      {/* Portfolio Gallery */}
      <PortfolioGallery items={profileData.portfolio} />

      {/* Profile Actions (CTA + Downloads) */}
      <ProfileActions
        profileUrl="sarah-chen.showproof.app"
        name={profileData.name}
      />

      {/* Analytics Preview (Owner Only) */}
      <AnalyticsPreview data={profileData.analytics} isOwner={true} />

      {/* Proof Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="w-5 h-5 rounded icon-gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">P</span>
          </div>
          <span className="text-sm font-medium">Made with Proof</span>
        </Link>
      </div>
    </div>
  );
};

export default Demo;
