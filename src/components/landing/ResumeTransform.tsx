import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const coachConversations = [
  {
    question: "What should I focus on in my profile?",
    answer: "Your resume mentions a pricing transformation that drove 62% revenue growth — that's a standout story. Let me build an impact section around it with visual metrics.",
  },
  {
    question: "I don't know how to describe what I do well.",
    answer: "Based on your experience, you're a GTM strategist who turns complex products into revenue engines. That's your headline — not 'Product Marketing Manager'.",
  },
  {
    question: "Is my profile strong enough?",
    answer: "You've got 4 solid impact stories but no evidence attached. Upload your board deck or campaign report and I'll create visual proof points from them.",
  },
];

const ambassadorConversations = [
  {
    question: "What makes Sarah a fit for our Head of Growth role?",
    answer: "Sarah drove $4.2M in pipeline and 3x product adoption. She doesn't just run campaigns — she builds GTM engines from scratch. That's exactly what your role needs.",
  },
  {
    question: "Does she have pricing experience?",
    answer: "Yes — she shortened sales cycles by 35% through repositioning and led a pricing transformation that drove 62% revenue growth. Zero churn throughout.",
  },
  {
    question: "Can I see evidence of her impact?",
    answer: "Absolutely. She has 4 verified case studies with attached artifacts — board presentations, campaign results, and revenue dashboards. Want me to pull those up?",
  },
];

const TypingDots = () => (
  <div className="flex justify-start">
    <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2 flex gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

interface ConversationPanelProps {
  conversations: typeof coachConversations;
  startDelay: number;
  accentColor: string;
}

const ConversationPanel = ({ conversations, startDelay, accentColor }: ConversationPanelProps) => {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true);
      setTimeout(() => setShowAnswer(true), 800);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    const cycleTimer = setInterval(() => {
      setShowAnswer(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % conversations.length);
        setTimeout(() => setShowAnswer(true), 700);
      }, 500);
    }, 6500);
    return () => clearInterval(cycleTimer);
  }, [started, conversations.length]);

  const convo = conversations[index];

  return (
    <div className="space-y-2.5 min-h-[140px]">
      <AnimatePresence mode="wait">
        {started && (
          <motion.div
            key={`q-${index}`}
            className="flex justify-end"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="max-w-[82%] rounded-2xl rounded-br-md px-3 py-2 text-[10px] leading-relaxed"
              style={{ backgroundColor: accentColor, color: "white" }}
            >
              {convo.question}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {started && !showAnswer && (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TypingDots />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showAnswer && (
          <motion.div
            key={`a-${index}`}
            className="flex justify-start"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-muted text-foreground px-3 py-2 text-[10px] leading-relaxed">
              {convo.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ResumeTransform = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 mb-8 px-6">
      <div className="grid md:grid-cols-2 gap-5">

        {/* ======================================= */}
        {/* LEFT: AI CAREER COACH — building view   */}
        {/* ======================================= */}
        <motion.div
          className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">showproof.app/coach</span>
            <div className="w-12" />
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="/proof-logo.png" alt="AI Career Coach" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">AI Career Coach</div>
                <div className="text-[9px] text-muted-foreground">Helping you build your best profile</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[9px] text-emerald-600 font-medium">Active</span>
              </div>
            </div>

            {/* Mini profile being built */}
            <div className="rounded-xl border border-border bg-muted/20 p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20" />
                <div>
                  <div className="h-2 w-20 bg-foreground/80 rounded" />
                  <div className="h-1.5 w-28 bg-muted-foreground/30 rounded mt-0.5" />
                </div>
              </div>
              <div className="flex gap-3 mb-2">
                <div className="text-center">
                  <div className="text-[9px] font-bold text-foreground">10+</div>
                  <div className="text-[7px] text-muted-foreground uppercase">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-foreground">$4.2M</div>
                  <div className="text-[7px] text-muted-foreground uppercase">Pipeline</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-foreground">3x</div>
                  <div className="text-[7px] text-muted-foreground uppercase">Growth</div>
                </div>
              </div>
              <motion.div
                className="h-1 rounded-full bg-muted overflow-hidden"
                initial={{ width: "30%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                <div className="h-full bg-foreground/60 rounded-full" style={{ width: "100%" }} />
              </motion.div>
              <div className="text-[8px] text-muted-foreground mt-1">Profile strength: building...</div>
            </div>

            {/* Live coach conversation */}
            <ConversationPanel
              conversations={coachConversations}
              startDelay={1500}
              accentColor="#111111"
            />
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* RIGHT: AI AMBASSADOR — visitor view       */}
        {/* ========================================= */}
        <motion.div
          className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.5 }}
        >
          {/* Window chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
            <span className="text-[9px] text-muted-foreground font-mono">sarah-chen.showproof.app</span>
            <div className="w-12" />
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="/proof-logo.png" alt="AI Ambassador" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">AI Ambassador</div>
                <div className="text-[9px] text-muted-foreground">Representing Sarah to visitors</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: "#002bfe" }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#002bfe" }} />
                </span>
                <span className="text-[9px] font-medium" style={{ color: "#002bfe" }}>Live</span>
              </div>
            </div>

            {/* Mini profile snapshot */}
            <div className="rounded-xl border border-border bg-muted/20 p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative">
                  <span className="absolute rounded-full" style={{ inset: "-2px", border: "1.5px solid #002bfe50", animation: "photo-ring 3s ease-in-out infinite" }} />
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-foreground">Sarah Chen</div>
                  <div className="text-[8px] text-muted-foreground">Head of Product Marketing · London</div>
                </div>
                <span className="ml-auto text-[8px] font-semibold tracking-wide" style={{ fontFamily: "'Outfit', sans-serif", color: "#002bfe" }}>proof</span>
              </div>
              <div className="flex gap-2">
                {["10+ yrs", "$4.2M pipeline", "3x growth", "35% faster"].map((s, i) => (
                  <span key={i} className="text-[7px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#002bfe10", color: "#002bfe" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Live ambassador conversation */}
            <ConversationPanel
              conversations={ambassadorConversations}
              startDelay={2500}
              accentColor="#002bfe"
            />
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="grid md:grid-cols-2 gap-5 mt-3">
        <motion.p
          className="text-center text-[11px] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          Your AI coach helps you build the perfect profile
        </motion.p>
        <motion.p
          className="text-center text-[11px] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          Your AI ambassador represents you to every visitor
        </motion.p>
      </div>
    </div>
  );
};
