import { motion } from "framer-motion";
import { User, Eye } from "lucide-react";

const coachMessages = [
  { role: "assistant", text: "I noticed your resume mentions leading a pricing transformation — that's a powerful story. Want me to create an impact story section around it?" },
  { role: "user", text: "Yes! It resulted in a 27% revenue uplift, and we had zero churn throughout." },
  { role: "assistant", text: "Perfect. I've added it with a visual metric card. I'd also suggest highlighting the zero churn separately — maintaining retention through a pricing change is remarkable and worth calling out." },
];

const ambassadorMessages = [
  { role: "visitor", text: "I'm hiring for a Head of Growth. What makes Sarah a fit?" },
  { role: "assistant", text: "Great question. Sarah grew digital acquisition by 31% at a Series B SaaS company while managing a seven-figure budget — that's exactly the scale you're operating at. She also built an entire product marketing function from the ground up." },
  { role: "visitor", text: "Does she have pricing strategy experience?" },
  { role: "assistant", text: "Absolutely. She led a pricing transformation that delivered 27% revenue uplift with zero customer churn. Want me to walk you through that case study?" },
];

const ChatBubble = ({ role, text, isRight }: { role: string; text: string; isRight: boolean }) => (
  <div className={`flex ${isRight ? "justify-end" : "justify-start"} mb-3`}>
    <div
      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isRight
          ? "bg-foreground text-background rounded-br-md"
          : "bg-card border border-border text-foreground rounded-bl-md"
      }`}
    >
      {text}
    </div>
  </div>
);

export const AIShowcase = () => {
  return (
    <section className="py-20 relative bg-muted">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Two AIs. One unfair advantage.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            An AI coach that helps you build the perfect profile. An AI ambassador that sells you when you're not in the room.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* AI Career Coach — for the user */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/50">
              <div className="w-8 h-8 rounded-full icon-gradient-bg flex items-center justify-center">
                <User className="w-4 h-4 text-background" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">AI Career Coach</p>
                <p className="text-xs text-muted-foreground">For you — the profile owner</p>
              </div>
            </div>

            <div className="p-6 min-h-[280px]">
              {coachMessages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} text={msg.text} isRight={msg.role === "user"} />
              ))}
            </div>

            <div className="px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Your personal career strategist. It reviews your profile, suggests improvements, and helps you tailor for specific roles.
              </p>
            </div>
          </motion.div>

          {/* AI Ambassador — for the visitor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/50">
              <div className="w-8 h-8 rounded-full icon-gradient-bg flex items-center justify-center">
                <Eye className="w-4 h-4 text-background" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">AI Career Advocate</p>
                <p className="text-xs text-muted-foreground">For visitors — recruiters & hiring managers</p>
              </div>
            </div>

            <div className="p-6 min-h-[280px]">
              {advocateMessages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} text={msg.text} isRight={msg.role === "visitor"} />
              ))}
            </div>

            <div className="px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Your voice when you're not in the room. It knows your career inside out and makes your case to anyone who visits.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
