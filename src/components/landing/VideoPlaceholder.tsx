import { motion } from "framer-motion";
import { Play, Upload, MessageSquare, Sparkles, Send } from "lucide-react";

export const VideoPlaceholder = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See how it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From resume upload to published profile in under 5 minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Video container with play button overlay */}
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/5 aspect-video group cursor-pointer">
            {/* Gradient background placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
            
            {/* Step indicators */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-6 md:gap-10">
                {[
                  { icon: Upload, label: "Upload resume" },
                  { icon: MessageSquare, label: "AI interview" },
                  { icon: Sparkles, label: "Profile generated" },
                  { icon: Send, label: "Share & tailor" },
                ].map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <step.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground font-medium whitespace-nowrap">
                      {step.label}
                    </span>
                    {i < 3 && (
                      <div className="absolute hidden md:block" style={{ left: `calc(${(i + 1) * 25}% - 12px)`, top: "50%" }}>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </motion.div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Video coming soon — watch the full walkthrough
          </p>
        </motion.div>
      </div>
    </section>
  );
};
