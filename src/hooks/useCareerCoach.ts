import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

const COACH_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-coach`;

export const useCareerCoach = (
  profileData: Record<string, any> | null,
  sections: Array<{ section_type: string; is_visible: boolean; section_data: Record<string, any> }>,
) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const initConversation = useCallback(async () => {
    if (conversationId || !profileData?.id) return;
    // Try to load existing conversation
    const { data } = await supabase
      .from("coach_conversations")
      .select("*")
      .eq("profile_id", profileData.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setConversationId(data.id);
      const storedMessages = (data.messages as any[]) || [];
      if (storedMessages.length > 0) {
        setMessages(storedMessages as CoachMessage[]);
        return;
      }
    } else {
      // Create new conversation
      const { data: newConvo } = await supabase
        .from("coach_conversations")
        .insert({
          user_id: (await supabase.auth.getUser()).data.user!.id,
          profile_id: profileData.id,
          messages: [],
        })
        .select()
        .single();
      if (newConvo) setConversationId(newConvo.id);
    }

    // Set welcome message
    const name = profileData.full_name?.split(" ")[0] || "there";
    setMessages([
      {
        role: "assistant",
        content: `Hi ${name}! 👋 I'm your AI career coach. I can see your profile and help you optimise it for specific roles.\n\nTry asking me:\n- "What sections should I add for a VP Marketing role?"\n- "How can I make my profile stand out for startups?"\n- "Review my profile and suggest improvements"`,
      },
    ]);
  }, [conversationId, profileData]);

  const sendMessage = useCallback(
    async (input: string) => {
      if (!input.trim() || isLoading) return;

      const userMsg: CoachMessage = { role: "user", content: input };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      let assistantContent = "";

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("Please log in to use the AI Coach.");
        }

        const resp = await fetch(COACH_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: updatedMessages,
            profileData,
            sections,
            conversationId,
          }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || `Error ${resp.status}`);
        }

        if (!resp.body) throw new Error("No response body");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";

        const upsertAssistant = (chunk: string) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && prev.length > updatedMessages.length) {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
            }
            return [...prev.slice(0, updatedMessages.length), { role: "assistant", content: assistantContent }];
          });
        };

        let streamDone = false;
        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsertAssistant(content);
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Flush remaining buffer
        if (textBuffer.trim()) {
          for (let raw of textBuffer.split("\n")) {
            if (!raw) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            if (raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsertAssistant(content);
            } catch {
              /* ignore */
            }
          }
        }

        // Save conversation to DB
        if (conversationId && assistantContent) {
          const finalMessages = [
            ...updatedMessages,
            { role: "assistant" as const, content: assistantContent },
          ] as unknown as Record<string, unknown>[];
          await supabase
            .from("coach_conversations")
            .update({ messages: finalMessages as any })
            .eq("id", conversationId);
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Coach error:", err);
        toast({
          title: "Coach unavailable",
          description: err.message || "Something went wrong. Try again.",
          variant: "destructive",
        });
        // Remove the user message if we failed
        setMessages(messages);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading, profileData, sections, conversationId, toast],
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const clearConversation = useCallback(async () => {
    setMessages([]);
    if (conversationId) {
      await supabase.from("coach_conversations").update({ messages: [] as any }).eq("id", conversationId);
    }
    // Re-init welcome message
    const name = profileData?.full_name?.split(" ")[0] || "there";
    setMessages([
      {
        role: "assistant",
        content: `Fresh start! 🧹 How can I help you improve your profile, ${name}?`,
      },
    ]);
  }, [conversationId, profileData]);

  // Extract [ADD_SECTION:xxx] from assistant messages
  const extractSectionSuggestions = useCallback((content: string): string[] => {
    const regex = /\[ADD_SECTION:(\w+)\]/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    cancelStream,
    clearConversation,
    initConversation,
    extractSectionSuggestions,
  };
};
