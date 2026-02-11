import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "always free",
    description: "Perfect for getting started",
    features: [
      "1 base profile (live forever)",
      "3 job-specific versions",
      "Basic analytics",
      "Made with Proof badge",
    ],
    cta: "Get started free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$39 NZD",
    period: "one-time unlock",
    description: "Everything you need to land your dream job",
    features: [
      "Everything in Free, plus:",
      "Unlimited job-specific versions",
      "Remove Made with Proof badge",
      "Profile stays live forever",
      "Priority support",
    ],
    cta: "Unlock Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Annual",
    price: "$99 NZD",
    period: "/year",
    description: "For serious job seekers who want everything",
    features: [
      "Everything in Pro, plus:",
      "Advanced analytics (views, engagement, insights)",
      "Custom domain (yourname.com)",
      "Early access to new features",
      "Priority support",
    ],
    cta: "Go Annual",
    variant: "outline" as const,
    popular: false,
  },
];

const faqItems = [
  {
    question: "What happens if I stop paying?",
    answer: "Your profile stays live forever. You just won't be able to create new versions or access paid features. No surprises.",
  },
  {
    question: "Can I upgrade from Free to Pro later?",
    answer: "Yes. Start free, upgrade to Pro anytime with a one-time $39 NZD payment. Or go straight to Annual for $99 NZD/year.",
  },
  {
    question: "What about the Analytics add-on?",
    answer: "Pro users can add advanced analytics for $12 NZD/month if they don't want the Annual subscription. Cancel anytime.",
  },
];


export const Pricing = () => {
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
            Choose your plan. Your profile stays live forever, no matter what.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl border-2 p-8 bg-card ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 md:scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full icon-gradient-bg text-white text-sm font-medium shadow-lg shadow-primary/25">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-3 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full icon-gradient-bg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.variant}
                  className={`w-full ${plan.popular ? "shadow-lg shadow-primary/25" : ""}`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Analytics Add-on Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto bg-card rounded-xl border border-border p-6 mb-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Optional:</span> Pro users can add Advanced Analytics for <span className="font-medium">$12 NZD/month</span>. Cancel anytime. Profile stays live regardless.
          </p>
        </motion.div>

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
