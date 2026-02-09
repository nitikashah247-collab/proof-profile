import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  Trash2,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useCareerCoach, CoachMessage } from "@/hooks/useCareerCoach";
import { cn } from "@/lib/utils";

interface CareerCoachDrawerProps {
  profileData: Record<string, any> | null;
  sections: Array<{
    section_type: string;
    is_visible: boolean;
    section_data: Record<string, any>;
  }>;
  activeSectionTypes: string[];
  onAddSection: (sectionType: string) => void;
}

const quickPrompts = [
  "Review my profile and suggest improvements",
  "What sections should I emphasize for a leadership role?",
  "How can I make my profile stand out for startups?",
];

export const CareerCoachDrawer = ({
  profileData,
  sections,
  activeSectionTypes,
  onAddSection,
}: CareerCoachDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    cancelStream,
    clearConversation,
    initConversation,
    extractSectionSuggestions,
  } = useCareerCoach(profileData, sections);

  useEffect(() => {
    if (isOpen) {
      initConversation();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, initConversation]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddSectionFromChat = (sectionType: string) => {
    if (!activeSectionTypes.includes(sectionType)) {
      onAddSection(sectionType);
    }
  };

  const renderMessage = (msg: CoachMessage, idx: number) => {
    const isUser = msg.role === "user";
    const suggestedSections = !isUser ? extractSectionSuggestions(msg.content) : [];
    // Clean the display content by removing [ADD_SECTION:xxx] tags
    const displayContent = msg.content.replace(/\[ADD_SECTION:\w+\]/g, "").trim();

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("flex gap-2 mb-3", isUser ? "justify-end" : "justify-start")}
      >
        {!isUser && (
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
        )}
        <div className={cn("max-w-[85%] space-y-2")}>
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
              isUser
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            )}
          >
            {displayContent}
          </div>
          {suggestedSections.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {suggestedSections.map((st) => {
                const alreadyAdded = activeSectionTypes.includes(st);
                return (
                  <Button
                    key={st}
                    variant={alreadyAdded ? "outline" : "secondary"}
                    size="sm"
                    className="h-7 text-xs gap-1"
                    disabled={alreadyAdded}
                    onClick={() => handleAddSectionFromChat(st)}
                  >
                    {alreadyAdded ? (
                      <>✓ {st.replace(/_/g, " ")}</>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add {st.replace(/_/g, " ")}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full h-14 px-5 shadow-lg gap-2 bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Ask your AI coach</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50 sm:bg-transparent sm:pointer-events-none"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 z-50 w-full sm:w-[400px] h-[85vh] sm:h-[600px] sm:bottom-6 sm:right-6 sm:rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">AI Career Coach</h3>
                    <p className="text-xs text-muted-foreground">Personalised profile advice</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={clearConversation}
                    title="Clear conversation"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-3">
                {messages.map((msg, idx) => renderMessage(msg, idx))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 mb-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2.5 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </motion.div>
                )}
              </ScrollArea>

              {/* Quick prompts (show when few messages) */}
              {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                  {quickPrompts.map((prompt) => (
                    <Badge
                      key={prompt}
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent transition-colors text-xs py-1 px-2.5"
                      onClick={() => {
                        setInput(prompt);
                        sendMessage(prompt);
                      }}
                    >
                      {prompt}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="px-3 py-3 border-t border-border bg-card shrink-0">
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your profile..."
                    className="min-h-[40px] max-h-[100px] resize-none text-sm rounded-xl border-border"
                    rows={1}
                  />
                  <Button
                    onClick={isLoading ? cancelStream : handleSend}
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl"
                    disabled={!input.trim() && !isLoading}
                  >
                    {isLoading ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
