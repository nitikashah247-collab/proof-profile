import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceMemo } from "@/components/onboarding/VoiceMemo";
import {
  Sparkles,
  Send,
  SkipForward,
  ArrowRight,
  Loader2,
  MessageSquare,
  CheckCircle2,
  Bot,
  User,
} from "lucide-react";
import { ResumeData } from "@/components/onboarding/ResumeUpload";
import { toast } from "@/hooks/use-toast";

export interface InterviewQuestion {
  id: number;
  text: string;
  category: string;
}

export interface InterviewResponse {
  questionId: number;
  questionText: string;
  questionCategory: string;
  responseText: string;
  responseMethod: "voice" | "text";
  skipped: boolean;
}

interface AdaptiveInterviewProps {
  resumeData: ResumeData | null;
  roleCategory: string;
  onComplete: (responses: InterviewResponse[]) => void;
}

type ChatMessage =
  | { type: "question"; category: string; text: string }
  | { type: "answer"; text: string; method: "voice" | "text" }
  | { type: "ai_response"; text: string }
  | { type: "skipped" };

const MIN_ANSWERS = 5;

const categoryLabels: Record<string, string> = {
  opening: "Getting Started",
  career_deep_dive: "Career Deep-Dive",
  personality: "Personality & Fit",
  hidden_gems: "Hidden Gems",
  future: "Future-Focused",
  proof: "Proof & Artifacts",
};

const acknowledgments = [
  "Great insight — that really helps paint the picture.",
  "Love that example. Let's keep going.",
  "That's the kind of detail that makes a profile stand out.",
  "Really interesting — let's explore another angle.",
  "Thanks for sharing that. Here's the next one.",
  "Good stuff — noted!",
  "That adds great context. Moving on...",
  "Brilliant — this is what makes profiles come alive.",
];

export const AdaptiveInterview = ({
  resumeData,
  roleCategory,
  onComplete,
}: AdaptiveInterviewProps) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showAck, setShowAck] = useState(false);
  const [currentAck, setCurrentAck] = useState("");
  const [isAckLoading, setIsAckLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const lastAckRef = useRef(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const answeredCount = responses.filter((r) => !r.skipped).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;
  const canFinish = answeredCount >= MIN_ANSWERS;
  const isLastQuestion = currentIndex >= totalQuestions - 1;
  const currentQuestion = questions[currentIndex];

  // Auto-scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, showAck, scrollToBottom]);

  const getRandomAck = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * acknowledgments.length);
    } while (idx === lastAckRef.current && acknowledgments.length > 1);
    lastAckRef.current = idx;
    return acknowledgments[idx];
  }, []);

  const fetchAiAcknowledgment = useCallback(
    async (question: string, answer: string): Promise<string> => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interview-respond`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question,
              answer,
              userName: resumeData?.full_name || "",
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.response) {
            return data.response;
          }
        }
      } catch (err) {
        console.error("AI acknowledgment failed:", err);
      }
      return getRandomAck();
    },
    [resumeData, getRandomAck]
  );

  // Fetch adaptive questions from edge function
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-interview-questions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resumeData, roleCategory }),
          }
        );

        if (!response.ok) throw new Error("Failed to generate questions");

        const data = await response.json();
        if (data.success && data.questions?.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error("No questions returned");
        }
      } catch (err) {
        console.error("Failed to load interview questions:", err);
        setLoadError(true);
        toast({
          title: "Couldn't generate personalised questions",
          description: "Using standard questions instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [resumeData, roleCategory]);

  // Push the first question to chat history when questions load
  useEffect(() => {
    if (questions.length > 0 && chatHistory.length === 0) {
      setChatHistory([
        { type: "question", category: questions[0].category, text: questions[0].text },
      ]);
    }
  }, [questions, chatHistory.length]);

  const advanceToNextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    if (nextIndex < questions.length) {
      setChatHistory((prev) => [
        ...prev,
        { type: "question", category: questions[nextIndex].category, text: questions[nextIndex].text },
      ]);
    }
  }, [currentIndex, questions]);

  const submitAnswer = useCallback(
    async (text: string, method: "voice" | "text" = "text") => {
      if (!currentQuestion) return;

      const response: InterviewResponse = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        questionCategory: currentQuestion.category,
        responseText: text,
        responseMethod: method,
        skipped: false,
      };

      const newResponses = [...responses, response];
      setResponses(newResponses);
      setCurrentInput("");

      // Add user answer to chat
      setChatHistory((prev) => [...prev, { type: "answer", text, method }]);

      if (isLastQuestion) {
        onComplete(newResponses);
        return;
      }

      // Show typing indicator while fetching AI response
      setIsAckLoading(true);
      setShowAck(true);

      const aiResponse = await fetchAiAcknowledgment(currentQuestion.text, text);
      setCurrentAck(aiResponse);
      setIsAckLoading(false);

      // Add AI response to chat history
      setChatHistory((prev) => [...prev, { type: "ai_response", text: aiResponse }]);

      // Show the AI response for 3 seconds, then advance
      setTimeout(() => {
        setShowAck(false);
        setTimeout(() => {
          advanceToNextQuestion();
        }, 300);
      }, 3000);
    },
    [currentQuestion, isLastQuestion, onComplete, responses, fetchAiAcknowledgment, advanceToNextQuestion]
  );

  const handleSkip = useCallback(() => {
    if (!currentQuestion) return;

    const response: InterviewResponse = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      questionCategory: currentQuestion.category,
      responseText: "",
      responseMethod: "text",
      skipped: true,
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Add skipped indicator to chat
    setChatHistory((prev) => [...prev, { type: "skipped" }]);

    if (isLastQuestion) {
      const answered = newResponses.filter((r) => !r.skipped).length;
      if (answered >= MIN_ANSWERS) {
        onComplete(newResponses);
      }
    } else {
      // Skip goes straight to next — no acknowledgment
      advanceToNextQuestion();
    }
  }, [currentQuestion, isLastQuestion, onComplete, responses, advanceToNextQuestion]);

  const handleSend = () => {
    if (!currentInput.trim()) return;
    submitAnswer(currentInput.trim(), "text");
  };

  const handleVoiceTranscript = (text: string) => {
    setCurrentInput(text);
  };

  const handleFinishEarly = () => {
    if (canFinish) {
      onComplete(responses);
    }
  };

  // Focus textarea on question change
  useEffect(() => {
    if (!isLoading && !showAck && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [currentIndex, isLoading, showAck]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="rounded-2xl border border-border bg-card p-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-2">Preparing your interview...</h2>
          <p className="text-muted-foreground">
            {resumeData
              ? `Analysing your resume to create personalised questions for your ${roleCategory} background`
              : "Generating interview questions"}
          </p>
        </div>
      </motion.div>
    );
  }

  if (loadError || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-destructive mb-4">Failed to load interview questions.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto flex flex-col"
      style={{ height: "calc(100vh - 120px)" }}
    >
      {/* Header */}
      <div className="text-center mb-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4" />
          AI Interview
        </div>
        <h1 className="text-3xl font-bold mb-1">Let's surface your best stories</h1>
        <p className="text-sm text-muted-foreground">
          {resumeData
            ? `${totalQuestions} tailored questions for your ${roleCategory === "general" ? "professional" : roleCategory} background`
            : `Answer at least ${MIN_ANSWERS} questions to continue`}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-muted-foreground">
            {answeredCount} answered
            {answeredCount < MIN_ANSWERS && (
              <span className="text-xs ml-1">(min {MIN_ANSWERS} required)</span>
            )}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Chat History */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-border bg-card mb-4 p-4 space-y-3">
        {chatHistory.map((msg, i) => {
          if (msg.type === "question") {
            return (
              <motion.div
                key={`chat-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1.5 max-w-[85%]">
                  <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {categoryLabels[msg.category] || msg.category}
                  </span>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-muted border border-border">
                    <p className="text-sm text-foreground leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          }

          if (msg.type === "answer") {
            return (
              <motion.div
                key={`chat-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 justify-end"
              >
                <div className="px-4 py-3 rounded-2xl rounded-tr-none bg-primary text-primary-foreground max-w-[85%]">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </motion.div>
            );
          }

          if (msg.type === "ai_response") {
            return (
              <motion.div
                key={`chat-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-muted/60 border border-border/50">
                  <p className="text-sm text-foreground italic">{msg.text}</p>
                </div>
              </motion.div>
            );
          }

          if (msg.type === "skipped") {
            return (
              <motion.div
                key={`chat-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <span className="text-xs text-muted-foreground italic">Skipped this question</span>
              </motion.div>
            );
          }

          return null;
        })}

        {/* Typing indicator while AI is generating response */}
        {showAck && isAckLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-muted border border-border">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area — fixed at bottom */}
      {!showAck && (
        <div className="shrink-0 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Type your answer or record a voice memo</span>
          </div>

          <div className="flex items-start gap-3">
            <Textarea
              ref={textareaRef}
              placeholder="Share your story here..."
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 resize-none bg-muted/50 border-border focus-visible:ring-1 min-h-[80px]"
              rows={3}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!currentInput.trim()}
              className="mt-1 shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          <VoiceMemo onTranscript={handleVoiceTranscript} />

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip this question
            </Button>

            {canFinish && !isLastQuestion && (
              <Button onClick={handleFinishEarly} className="gap-2 group">
                <CheckCircle2 className="w-4 h-4" />
                Continue with {answeredCount} answers
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            {!canFinish && (
              <span className="text-xs text-muted-foreground">
                Answer {MIN_ANSWERS - answeredCount} more to continue
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
