import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

const freeFeatures = [
  "1 living career profile",
  "AI-powered profile generation",
  "AI ambassador on your profile",
  "1 job-tailored version",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Unlimited job-tailored versions",
  "Remove Proof branding",
  "Advanced analytics (views, engagement, insights)",
  "Priority AI generation",
];

const faqItems = [
  {
    question: "What happens if I cancel Pro?",
    answer: "Your base profile stays live. Existing tailored versions remain active. You just can't create new versions until you re-subscribe.",
  },
  {
    question: "How does the AI ambassador work?",
    answer: "Every Proof profile includes an AI ambassador that knows your career story. When someone visits your profile, they can ask it questions about your experience — it's like having a personal representative available 24/7.",
  },
  {
    question: "Can I upgrade from Free to Pro later?",
    answer: "Absolutely. Start free, upgrade anytime. Your profile and all your data carries over seamlessly.",
  },
  {
    question: "How is this different from LinkedIn?",
    answer: "LinkedIn is a social feed. Proof is a living career profile built from evidence. Your Proof profile has impact visualisations, case studies with real artifacts, and an AI advocate that actively makes your case to visitors. LinkedIn shows what you've done. Proof shows what you're capable of.",
  },
  {
    question: "What if my resume is outdated or incomplete?",
    answer: "That's exactly what the AI interview is for. It draws out stories, context, and achievements that your resume misses. Many of our best profiles come from people who thought their resume didn't do them justice.",
  },
  {
    question: "Can I customise how my profile looks?",
    answer: "Yes. You can choose your own accent colour, upload a banner image, reorder sections, add or remove sections, and edit any content the AI generates. It's your profile — the AI gives you a head start, you make it yours.",
  },
  {
    question: "Who can see my profile?",
    answer: "Your profile lives at a unique URL that you control. You choose who to share it with — send it to recruiters, include it in job applications, add it to your email signature, or keep it private until you're ready.",
  },
  {
    question: "How does the job-tailoring work?",
    answer: "Drop in a job description and Proof creates a tailored version of your profile that surfaces the experience most relevant to that specific role. Same career, different emphasis — so every application feels personal.",
  },
  {
    question: "Is my data safe?",
    answer: "Yes. Your resume data and profile content are stored securely. We don't share your information with third parties or use it to train AI models. You can delete your account and all associated data at any time.",
  },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-foreground">{question}</span>
        <span
          className={`ml-4 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed pr-10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 relative bg-muted">
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
            Simple, transparent pricing
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
              <Button variant="outline" className="w-full rounded-full" size="lg">
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
            className="relative rounded-2xl border-2 border-foreground shadow-xl shadow-black/10 p-8 bg-card md:scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium shadow-lg shadow-black/10">
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
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${isAnnual ? "bg-foreground" : "bg-input"}`}
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
                  className="inline-block mt-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold"
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
              <Button className="w-full rounded-full shadow-lg shadow-black/10" size="lg">
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
          Cancel anytime. Your base profile stays live even after you cancel.
        </motion.p>

        {/* FAQ Section — Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Frequently asked questions</h3>
          <div>
            {faqItems.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
