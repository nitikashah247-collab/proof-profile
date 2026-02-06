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
    description: "Paste any job description. AI automatically reweights your profile to match.",
  },
  {
    icon: Share2,
    title: "Custom URLs",
    description: "Your profile lives at username.getproof.app. Share one link that tells your whole story.",
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

export const Features = () => {
  return (
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="text-gradient">stand out</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
              className="group relative p-6 rounded-2xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:border-primary/30"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
