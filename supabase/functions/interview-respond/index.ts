import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { question, answer, userName } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: `You are an AI career interviewer having a warm, professional conversation with ${userName || "a professional"}. They were just asked: "${question}" and they answered: "${answer}"

Write a brief, insightful 1-sentence response (max 20 words) that:
- Specifically references something they said (a detail, a company name, a skill, a result)
- Feels warm and encouraging but not over-the-top
- Does NOT repeat the question back to them
- Does NOT use generic phrases like "Great insight" or "That's interesting" or "Thanks for sharing"
- Sounds like a real interviewer who is genuinely listening

Examples of GOOD responses:
- "Building that customer research function from scratch at Datacom — that's a serious undertaking."
- "62% year-on-year — that kind of consistency is rare in SaaS."
- "So the design eye came before the marketing — that explains a lot about your approach."

Examples of BAD responses (never say these):
- "Great insight — that really helps paint the picture."
- "Thanks for sharing that."
- "That's really interesting."
- "Good stuff — noted!"

Return ONLY the response sentence, nothing else. No quotes, no preamble.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", response.status, errText);
      return new Response(
        JSON.stringify({ success: false, response: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text?.trim() || null;

    return new Response(
      JSON.stringify({ success: true, response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("interview-respond error:", error);
    return new Response(
      JSON.stringify({ success: false, response: null }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
