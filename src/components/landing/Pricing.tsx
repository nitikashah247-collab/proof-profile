import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const freeFeatures = [
  "1 base profile (live forever)",
  "1 job-specific version (expires after 3 months)",
  "Made with Proof badge",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Unlimited job-specific versions (no expiry)",
  "Remove \"Made with Proof\" badge",
  "Advanced analytics (views, engagement, insights)",
  "Profile stays live forever (even after you cancel)",
];

const faqItems = [
  {
    question: "What happens if I cancel Pro?",
    answer: "Your profile stays live forever. Existing versions remain active. You just can't create new versions until you re-subscribe.",
  },
  {
    question: "What about the free job-specific version?",
    answer: "Free users get one job-specific version that stays live for 3 months. Upgrade to Pro for unlimited versions with no expiry.",
  },
  {
    question: "Can I upgrade from Free to Pro later?",
    answer: "Yes. Start free, upgrade to Pro anytime. Choose monthly ($18/mo) or annual ($180/year) billing.",
  },
];

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-28 relative bg-muted/30">
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
            Simple, transparent <span className="text-primary">pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start free. Upgrade when you're ready. Your profile stays live no matter what.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
          {/* Free Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border-2 border-border p-8 bg-card"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground text-sm">always free</span>
              </div>
              <p className="text-muted-foreground mt-3 text-sm">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full icon-gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/signup" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Get started free
              </Button>
            </Link>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl border-2 border-primary shadow-xl shadow-primary/10 p-8 bg-card md:scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full icon-gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/25">
                Most Popular
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>

              {/* Billing Toggle */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${isAnnual ? "bg-primary" : "bg-input"}`}
                  role="switch"
                  aria-checked={isAnnual}
                >
                  <span
                    className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${isAnnual ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
                >
                  Annual
                </button>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  {isAnnual ? "$180 NZD" : "$18 NZD"}
                </span>
                <span className="text-muted-foreground text-sm">
                  {isAnnual ? "/year" : "/month"}
                </span>
              </div>

              {isAnnual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold"
                >
                  Save $36/year
                </motion.span>
              )}

              <p className="text-muted-foreground mt-3 text-sm">Everything you need to land your dream role</p>
            </div>

            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full icon-gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground/80 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/signup" className="block">
              <Button className="w-full shadow-lg shadow-primary/25" size="lg">
                Start Pro
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Cancel anytime note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-muted-foreground mb-16"
        >
          Cancel anytime. Your profile stays live even after you cancel.
        </motion.p>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Common questions</h3>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-lg border border-border p-6">
                <h4 className="font-semibold text-foreground mb-3">{item.question}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
