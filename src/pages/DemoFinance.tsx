import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Users, Zap, Brain, MessageSquare } from "lucide-react";

// Profile Components
import { ProfileHero } from "@/components/profile/ProfileHero";
import { FinanceImpactCharts } from "@/components/profile/FinanceImpactCharts";
import { CaseStudyCard } from "@/components/profile/CaseStudyCard";
import { CareerTimeline } from "@/components/profile/CareerTimeline";
import { SkillsMatrix } from "@/components/profile/SkillsMatrix";
import { TestimonialsCarousel } from "@/components/profile/TestimonialsCarousel";
import { WorkStyleVisual } from "@/components/profile/WorkStyleVisual";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { AnalyticsPreview } from "@/components/profile/AnalyticsPreview";
import { CredentialsSection } from "@/components/profile/CredentialsSection";
import { DealExperience } from "@/components/profile/DealExperience";
import { AdvisoryRoles } from "@/components/profile/AdvisoryRoles";
import { ProcessFrameworks } from "@/components/profile/ProcessFrameworks";

// Michael Zhang - CFO Profile Data
const profileData = {
  name: "Michael Zhang",
  title: "Chief Financial Officer",
  location: "Auckland, New Zealand",
  company: "TechVentures",
  tagline:
    "15 years driving financial strategy and operational excellence in high-growth tech. I turn ambitious growth plans into sustainable, fundable business models.",
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  skills: [
    "Financial Modeling",
    "FP&A",
    "Capital Raising",
    "M&A",
    "ERP Systems",
    "Team Leadership",
  ],
  stats: {
    yearsExperience: 15,
    projectsLed: 85,
    teamsManaged: 12,
    keyMetric: { value: 22, label: "Cost Reduction", suffix: "%" },
  },
  caseStudies: [
    {
      title: "Series B & C Fundraising Strategy — $85M Raised",
      company: "TechVentures",
      keyMetric: "$85M",
      summary:
        "Led back-to-back fundraising rounds in a challenging market, securing $85M in total capital.",
      challenge:
        "The macro environment had shifted: VC deployment slowed 40%, valuations compressed, and our Series B lead walked away 3 weeks before closing. We needed to raise quickly to maintain momentum.",
      approach:
        "Rebuilt the financial model from first principles, refined our unit economics narrative (LTV:CAC from 2.1x to 4.8x), engaged 42 investors, and ran a competitive process that created urgency despite the down market.",
      outcome:
        "Closed $35M Series B at 12x ARR multiple, followed by $50M Series C 14 months later. Maintained 12-month runway throughout. Zero dilution surprises for existing shareholders.",
      skills: ["Capital Raising", "Financial Modeling", "FP&A"],
      testimonial: {
        quote:
          "Michael's financial leadership was instrumental in our growth from $5M to $45M ARR. He doesn't just manage numbers — he builds conviction with investors.",
        author: "David Park",
        role: "CEO, TechVentures",
      },
    },
    {
      title: "Operational Excellence Initiative — 22% Cost Reduction",
      company: "TechVentures",
      keyMetric: "22%",
      summary:
        "Reduced operational costs by 22% while the company scaled 3x, without impacting team morale.",
      challenge:
        "Scaling costs were outpacing revenue growth. Burn multiple hit 2.4x, and the board flagged path-to-profitability concerns ahead of the Series C raise.",
      approach:
        "Implemented zero-based budgeting across all departments, renegotiated 14 vendor contracts (avg. 30% savings), consolidated tooling from 47 to 28 platforms, and created monthly unit economics reviews with each department head.",
      outcome:
        "22% reduction in operational costs. Burn multiple dropped to 1.1x. Maintained employee satisfaction scores above 8.2/10. Initiative directly supported Series C narrative.",
      skills: ["FP&A", "Team Leadership"],
    },
    {
      title: "Finance Team Build & Systems Implementation",
      company: "TechVentures",
      keyMetric: "35%",
      summary:
        "Built finance function from scratch and implemented enterprise-grade FP&A systems.",
      challenge:
        "Joined as employee #15. Finance was a single bookkeeper using spreadsheets. Monthly close took 15 business days. Forecasting accuracy was ±40%. Board reporting was inconsistent.",
      approach:
        "Hired 11 finance professionals across accounting, FP&A, and strategic finance. Implemented NetSuite as core ERP, Adaptive Planning for FP&A, and built automated board reporting. Created career ladders and a finance operating rhythm.",
      outcome:
        "Forecasting accuracy improved from ±40% to ±5%. Monthly close reduced from 15 to 5 days. Built a team of 12 with zero regrettable attrition. Finance function rated 'best-in-class' by board advisor.",
      skills: ["ERP Systems", "Team Leadership", "FP&A"],
    },
    {
      title: "Strategic Acquisition Integration — $120M Exit",
      company: "ScaleUp Inc.",
      keyMetric: "$120M",
      summary:
        "Led financial due diligence and integration planning for a successful $120M acquisition.",
      challenge:
        "Three potential acquirers were evaluating ScaleUp simultaneously. Each had different valuation methodologies and data room requirements. Timeline was compressed to 8 weeks.",
      approach:
        "Built comprehensive data room with 400+ documents, created acquirer-specific financial models showing synergy potential, negotiated earn-out structures, and managed communication with existing investors throughout the process.",
      outcome:
        "Closed at $120M — 18x revenue multiple, exceeding board expectations by 35%. All employee equity holders received full payouts. Integration completed in 60 days with zero revenue disruption.",
      skills: ["M&A", "Financial Modeling", "Capital Raising"],
    },
  ],
  deals: [
    { type: "Series C", company: "TechVentures", size: "$50M", year: "2024", role: "CFO — Lead", outcome: "Closed at 14x ARR" },
    { type: "Series B", company: "TechVentures", size: "$35M", year: "2023", role: "CFO — Lead", outcome: "Closed at 12x ARR" },
    { type: "Acquisition", company: "ScaleUp Inc.", size: "$120M", year: "2020", role: "VP Finance — Lead", outcome: "18x revenue multiple" },
    { type: "Series A", company: "ScaleUp Inc.", size: "$15M", year: "2017", role: "VP Finance — Support", outcome: "Fully subscribed in 3 weeks" },
    { type: "Debt Facility", company: "TechVentures", size: "$10M", year: "2024", role: "CFO — Lead", outcome: "SVB venture debt, minimal covenants" },
    { type: "M&A (Buy-side)", company: "TechVentures", size: "$8M", year: "2025", role: "CFO — Lead", outcome: "Acqui-hire, 12 engineers integrated" },
  ],
  advisoryRoles: [
    {
      company: "FinLedger",
      stage: "Seed",
      focus: "Financial Infrastructure",
      description: "Advising on financial modelling, fundraising strategy, and building their first FP&A function. Helped refine their investor pitch deck and unit economics narrative.",
    },
    {
      company: "CarbonTrack",
      stage: "Series A",
      focus: "Climate Tech",
      description: "Board observer role. Providing guidance on scaling finance operations, vendor management, and preparing for institutional fundraising rounds.",
    },
    {
      company: "MedBridge",
      stage: "Pre-Seed",
      focus: "HealthTech",
      description: "Mentoring the founding team on financial planning, burn rate management, and building investor-ready financial models from day one.",
    },
    {
      company: "NZ Tech Association",
      stage: "Non-profit",
      focus: "Industry Body",
      description: "Finance committee member. Contributing to governance, annual audit oversight, and financial strategy for the national technology industry association.",
    },
  ],
  processFrameworks: [
    {
      title: "The Finance Operating Rhythm",
      subtitle: "A repeatable cadence for scaling finance teams from startup to growth stage",
      steps: [
        { label: "Weekly Flash", description: "Cash, burn, key metrics" },
        { label: "Monthly Close", description: "5-day close, variance analysis" },
        { label: "Dept Reviews", description: "Unit economics by team" },
        { label: "Board Pack", description: "Automated, narrative-driven" },
        { label: "Quarterly Plan", description: "Rolling forecast + reforecast" },
      ],
    },
    {
      title: "Fundraising Process Framework",
      subtitle: "Structured approach to running a competitive fundraise in any market",
      steps: [
        { label: "Model Prep", description: "Bottom-up, scenario-driven" },
        { label: "Investor Map", description: "Tier 1/2/3, warm intros" },
        { label: "Data Room", description: "400+ documents, indexed" },
        { label: "Process Mgmt", description: "Weekly tracking, FOMO" },
        { label: "Term Negotiation", description: "Protect dilution, alignment" },
        { label: "Close & Comms", description: "Legal, investor updates" },
      ],
    },
  ],
  timeline: [
    {
      company: "TechVentures",
      role: "Chief Financial Officer",
      startYear: "2020",
      endYear: "Present",
      achievements: [
        "Led Series B ($35M) and Series C ($50M) fundraising",
        "Scaled revenue from $5M to $45M ARR",
        "Built finance team from 2 to 12 professionals",
        "Achieved path-to-profitability milestone",
      ],
    },
    {
      company: "ScaleUp Inc.",
      role: "VP Finance",
      startYear: "2016",
      endYear: "2020",
      achievements: [
        "Led Series A fundraising ($15M)",
        "Implemented first FP&A function",
        "Managed successful exit (acquired for $120M)",
        "Built board reporting framework",
      ],
    },
    {
      company: "Global Consulting Group",
      role: "Senior Manager, Strategy",
      startYear: "2013",
      endYear: "2016",
      achievements: [
        "Led 12+ engagements for tech sector clients",
        "Developed financial transformation methodology",
        "Promoted to senior manager in 2 years",
        "Built Southeast Asia practice",
      ],
    },
    {
      company: "Big Four Accounting",
      role: "Manager, Audit & Advisory",
      startYear: "2009",
      endYear: "2013",
      achievements: [
        "Managed audit engagements for tech clients",
        "Earned CPA qualification",
        "Led team of 8 audit professionals",
        "Received 'Top Performer' award 3 consecutive years",
      ],
    },
  ],
  skillsData: [
    { name: "Financial Modeling", level: 5, yearsOfExperience: 15, relatedCaseStudies: [0, 3] },
    { name: "FP&A", level: 5, yearsOfExperience: 12, relatedCaseStudies: [0, 1, 2] },
    { name: "Capital Raising", level: 5, yearsOfExperience: 8, relatedCaseStudies: [0, 3] },
    { name: "M&A", level: 4, yearsOfExperience: 6, relatedCaseStudies: [3] },
    { name: "ERP Systems", level: 4, yearsOfExperience: 7, relatedCaseStudies: [2] },
    { name: "Team Leadership", level: 5, yearsOfExperience: 10, relatedCaseStudies: [1, 2] },
  ],
  credentials: [
    {
      icon: "certification" as const,
      title: "Certified Public Accountant (CPA)",
      subtitle: "New Zealand Institute of Chartered Accountants — Active since 2011",
    },
    {
      icon: "education" as const,
      title: "MBA, Finance & Strategy",
      subtitle: "University of Auckland Business School — Dean's List, Valedictorian",
    },
    {
      icon: "certification" as const,
      title: "Chartered Financial Analyst (CFA) Level II",
      subtitle: "CFA Institute — Passed 2014",
    },
    {
      icon: "advisory" as const,
      title: "Board Advisor — 3 Early-Stage Startups",
      subtitle: "FinLedger (Seed), CarbonTrack (Series A), MedBridge (Pre-Seed)",
    },
    {
      icon: "speaking" as const,
      title: "Guest Lecturer — Startup Finance",
      subtitle: "University of Auckland, Annual SaaS Finance Summit, NZ CFO Forum",
    },
    {
      icon: "certification" as const,
      title: "GAICD — Governance Institute",
      subtitle: "Graduate, Australian Institute of Company Directors — Board-ready certification",
    },
  ],
  testimonials: [
    {
      quote:
        "Michael's financial leadership was instrumental in our growth from $5M to $45M ARR. He doesn't just manage numbers — he builds conviction with investors and creates financial infrastructure that scales.",
      author: "David Park",
      role: "CEO",
      company: "TechVentures",
    },
    {
      quote:
        "Strategic thinker who balances growth ambition with fiscal responsibility. Michael brought rigour and credibility to our financial story that was critical during our fundraise.",
      author: "Jennifer Wu",
      role: "Board Member",
      company: "TechVentures",
    },
    {
      quote:
        "Michael built a finance team that operates like a well-oiled machine. His systems thinking and people leadership created a function that's genuinely best-in-class for a company our size.",
      author: "Sarah Mitchell",
      role: "COO",
      company: "TechVentures",
    },
    {
      quote:
        "Working under Michael accelerated my career by years. He gives you real responsibility, coaches without micromanaging, and creates an environment where you can do your best work. I went from analyst to senior manager in 3 years.",
      author: "Rachel Torres",
      role: "Sr. Finance Manager",
      company: "TechVentures",
    },
    {
      quote:
        "In the acquisition process, Michael was the most prepared CFO I've encountered. His data room was flawless, his models were bulletproof, and he navigated a complex multi-party negotiation with remarkable composure.",
      author: "James Chen",
      role: "Managing Director",
      company: "Meridian Capital",
    },
  ],
  workStyleDimensions: [
    {
      label: "Collaboration Style",
      leftLabel: "Independent",
      rightLabel: "Collaborative",
      value: 60,
      icon: Users,
    },
    {
      label: "Decision Making",
      leftLabel: "Deliberate",
      rightLabel: "Fast-Moving",
      value: 35,
      icon: Zap,
    },
    {
      label: "Problem Solving",
      leftLabel: "Analytical",
      rightLabel: "Intuitive",
      value: 25,
      icon: Brain,
    },
    {
      label: "Communication",
      leftLabel: "Written",
      rightLabel: "Verbal",
      value: 45,
      icon: MessageSquare,
    },
  ],
  workStyleTraits: [
    "Data-driven decision making",
    "Long-term strategic thinking",
    "Transparent communication",
    "Process-oriented execution",
    "Stakeholder alignment",
    "Risk-aware optimism",
  ],
  analytics: {
    totalViews: 842,
    avgTimeOnPage: "4m 18s",
    topSection: "Financial Impact",
    viewsThisWeek: 63,
  },
};

const DemoFinance = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const filteredCaseStudies = activeSkill
    ? profileData.caseStudies.filter((study) =>
        study.skills.includes(activeSkill)
      )
    : profileData.caseStudies;

  return (
    <div className="min-h-screen bg-background theme-executive">
      {/* Top Banner */}
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
              Viewing: michael-zhang.showproof.app
            </span>
            <Button size="sm">Edit Profile</Button>
          </div>
        </div>
      </div>

      {/* Hero */}
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

      {/* Financial Impact Charts */}
      <FinanceImpactCharts />

      {/* Case Studies */}
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

      {/* Deal Experience Table */}
      <DealExperience deals={profileData.deals} />

      {/* Credentials */}
      <CredentialsSection credentials={profileData.credentials} />

      {/* Advisory Roles */}
      <AdvisoryRoles roles={profileData.advisoryRoles} />

      {/* Process Frameworks */}
      <ProcessFrameworks frameworks={profileData.processFrameworks} />

      {/* Skills Matrix */}
      <SkillsMatrix
        skills={profileData.skillsData}
        activeSkill={activeSkill}
        onSkillClick={setActiveSkill}
      />

      {/* Career Timeline */}
      <CareerTimeline entries={profileData.timeline} />

      {/* Testimonials */}
      <TestimonialsCarousel testimonials={profileData.testimonials} />

      {/* Work Style */}
      <WorkStyleVisual
        dimensions={profileData.workStyleDimensions}
        traits={profileData.workStyleTraits}
      />

      {/* Actions CTA */}
      <ProfileActions
        profileUrl="michael-zhang.showproof.app"
        name={profileData.name}
      />

      {/* Analytics */}
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

export default DemoFinance;
