import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  BarChart3, 
  Palette, 
  Zap, 
  Share2 
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Our AI interviews you and extracts your best stories, metrics, and proof points automatically.",
  },
  {
    icon: Layers,
    title: "Infinite Tailored Versions",
    description: "One base profile, unlimited job-specific versions. Each adapts to match what employers want.",
  },
  {
    icon: Palette,
    title: "5 Role Archetypes",
    description: "Executive, Creative, Technical, Sales, or Operations. Design that matches your professional identity.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "See who's viewing your profile, which sections engage, and how long they stay.",
  },
  {
    icon: Zap,
    title: "Instant JD Analysis",
    description: "Paste any job description. AI automatically re-weights your profile to match.",
  },
  {
    icon: Share2,
    title: "Custom URLs",
    description: "Your profile lives at name.showproof.app. Share one link that tells your whole story.",
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
  <div className="w-12 h-12 rounded-xl icon-gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
    <Icon className="w-6 h-6 text-white" />
  </div>
);

export const Features = () => {
  return (
    <section id="features" className="py-28 relative bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to{" "}
            <span className="text-primary">stand out</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stop rewriting resumes. Start building a living portfolio that adapts to every opportunity.
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
