import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { VoiceMemo } from "@/components/onboarding/VoiceMemo";
import {
  Sparkles,
  Send,
  SkipForward,
  ArrowRight,
  Loader2,
  MessageSquare,
  CheckCircle2,
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

const MIN_ANSWERS = 5;

const categoryLabels: Record<string, string> = {
  opening: "Getting Started",
  career_deep_dive: "Career Deep-Dive",
  personality: "Personality & Fit",
  hidden_gems: "Hidden Gems",
  future: "Future-Focused",
  proof: "Proof & Artifacts",
};

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const answeredCount = responses.filter((r) => !r.skipped).length;
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex) / totalQuestions) * 100 : 0;
  const canFinish = answeredCount >= MIN_ANSWERS;
  const isLastQuestion = currentIndex >= totalQuestions - 1;
  const currentQuestion = questions[currentIndex];

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
        // Will retry or use fallback from the edge function
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [resumeData, roleCategory]);

  const submitAnswer = useCallback(
    (text: string, method: "voice" | "text" = "text") => {
      if (!currentQuestion) return;

      const response: InterviewResponse = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        questionCategory: currentQuestion.category,
        responseText: text,
        responseMethod: method,
        skipped: false,
      };

      setResponses((prev) => [...prev, response]);
      setCurrentInput("");

      if (isLastQuestion) {
        onComplete([...responses, response]);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentQuestion, isLastQuestion, onComplete, responses]
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

    setResponses((prev) => [...prev, response]);

    if (isLastQuestion) {
      const allResponses = [...responses, response];
      const answered = allResponses.filter((r) => !r.skipped).length;
      if (answered >= MIN_ANSWERS) {
        onComplete(allResponses);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentQuestion, isLastQuestion, onComplete, responses]);

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
    if (!isLoading && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [currentIndex, isLoading]);

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
          <h2 className="text-xl font-bold mb-2">
            Preparing your interview...
          </h2>
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
        <p className="text-destructive mb-4">
          Failed to load interview questions.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI Interview
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Let's surface your best stories
        </h1>
        <p className="text-muted-foreground">
          {resumeData
            ? `We've tailored ${totalQuestions} questions for your ${roleCategory === "general" ? "professional" : roleCategory} background`
            : `Answer at least ${MIN_ANSWERS} questions to continue`}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-muted-foreground">
            {answeredCount} answered
            {answeredCount < MIN_ANSWERS && (
              <span className="text-xs ml-1">
                (min {MIN_ANSWERS} required)
              </span>
            )}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          {/* Category badge + question */}
          <div className="p-6 pb-4">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-4">
              {categoryLabels[currentQuestion.category] || currentQuestion.category}
            </span>
            <p className="text-lg font-medium leading-relaxed">
              {currentQuestion.text}
            </p>
          </div>

          {/* Input area */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
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
                className="flex-1 resize-none bg-muted/50 border-0 focus-visible:ring-1 min-h-[100px]"
                rows={4}
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
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-6">
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
    </motion.div>
  );
};
