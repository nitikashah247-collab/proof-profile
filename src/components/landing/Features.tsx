import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  BarChart3, 
  Share2,
  MessageSquare,
  Eye
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Storytelling",
    description: "Upload your resume, then have a short AI conversation. Proof draws out your best stories, metrics, and impact — turning your career into a compelling narrative.",
  },
  {
    icon: Layers,
    title: "Tailored for Every Role",
    description: "One profile, infinite versions. Drop in a job description and your profile reshapes itself — surfacing the experience that matters most.",
  },
  {
    icon: MessageSquare,
    title: "An AI Advocate in Your Corner",
    description: "Every Proof profile comes with an AI that knows your career inside out. It guides visitors, answers questions, and makes your case — even when you're not in the room.",
  },
  {
    icon: BarChart3,
    title: "Impact That Speaks for Itself",
    description: "Your achievements rendered as visual evidence — charts, metrics, and case studies with real artifacts. Not bullet points. Proof.",
  },
  {
    icon: Eye,
    title: "See Who's Looking",
    description: "Know when someone views your profile, which sections they engage with, and how long they stay. Real-time analytics for your career.",
  },
  {
    icon: Share2,
    title: "One Link, Whole Story",
    description: "Your profile lives at a clean custom URL. Share it with recruiters, drop it in applications, add it to your email signature.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const GradientIcon = ({ icon: Icon }: { icon: typeof Sparkles }) => (
  <div className="w-12 h-12 rounded-xl icon-gradient-bg flex items-center justify-center shadow-lg shadow-black/8">
    <Icon className="w-6 h-6 text-white" />
  </div>
);

export const Features = () => {
  return (
    <section id="features" className="py-28 relative bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Everything you need to{" "}
            <span className="italic">stand out</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop rewriting resumes. Start building a living profile that works as hard as you do.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
            >
              <div className="relative">
                <GradientIcon icon={feature.icon} />
                <h3 className="text-xl font-semibold mt-6 mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
