import { motion } from "framer-motion";
import { Upload, MessageSquare, Sparkles, Share } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your resume",
    description: "Drop your PDF or paste your details. Our AI reads between the lines and extracts what matters.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Have a conversation",
    description: "A short AI interview draws out the stories, context, and impact that a resume can never fully capture.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Your profile generates",
    description: "Impact visualisations, evidence-backed case studies, and an AI advocate — all built from your real experience.",
  },
  {
    number: "04",
    icon: Share,
    title: "Share and tailor",
    description: "Get your custom URL. Paste any job description and your profile reshapes to match — instantly.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-muted">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            From resume to Proof in{" "}
            <span className="bg-accent px-3 py-1 rounded-lg font-semibold italic">10 minutes</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No design skills needed. No fuss. Just you.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative flex items-center gap-8 mb-12 last:mb-0"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-12 bg-border" />
              )}

              {/* Icon */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-background" />
                </div>
                <span className="absolute -top-2 -right-2 text-xs font-mono font-bold text-foreground bg-background px-1.5 py-0.5 rounded-md border border-border">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
