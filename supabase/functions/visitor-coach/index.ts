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
    const { messages, profileData, sections } = await req.json();

    let profileContext = "";
    if (profileData) {
      profileContext += `\nProfile Owner: ${profileData.full_name || "Unknown"}\n`;
      profileContext += `Headline: ${profileData.headline || "Not set"}\n`;
      profileContext += `Industry: ${profileData.industry || "Not set"}\n`;
      profileContext += `Location: ${profileData.location || "Not set"}\n`;
      profileContext += `Bio: ${profileData.bio || "Not set"}\n`;
    }

    if (sections && sections.length > 0) {
      for (const s of sections) {
        if (!s.section_data || !s.is_visible) continue;
        profileContext += `\n--- ${s.section_type.toUpperCase()} ---\n`;
        profileContext += JSON.stringify(s.section_data, null, 2).slice(0, 2000);
        profileContext += "\n";
      }
    }

    const firstName = profileData?.full_name?.split(" ")[0] || "this person";

    const systemPrompt = `You are the AI Advocate for ${profileData?.full_name || "a professional"}. You exist on their Proof career profile to help visitors (recruiters, hiring managers, potential collaborators) understand why this person is exceptional.

YOUR ROLE:
- You are ${firstName}'s biggest professional advocate
- You know their entire career story, achievements, skills, and impact
- You speak with warm confidence — not salesy, not desperate, but genuinely knowledgeable and enthusiastic
- You make connections between different parts of their career that a visitor might miss
- You highlight what makes them UNIQUELY valuable, not just generically good

PROFILE DATA:
${profileContext}

RULES:
1. ONLY reference facts, achievements, and numbers that exist in the profile data above. NEVER invent or embellish.
2. When a visitor shares a job description, systematically map the requirements to the profile owner's experience. Be specific: "The role asks for pricing strategy experience — ${firstName} led the pricing transformation at [company] that resulted in [metric]."
3. If something in the job description doesn't match the profile, be honest: "I don't see direct [X] experience in their profile, but their [Y] work demonstrates similar skills."
4. Keep responses concise — 2-3 paragraphs max. Be punchy, not wordy.
5. Use the profile owner's first name naturally.
6. If asked something you genuinely can't answer from the profile data, say so and suggest the visitor reach out directly.
7. Never share personal contact details unless they're already public on the profile.
8. End responses with a question or suggestion that keeps the conversation going: "Want me to walk you through their impact stories?" or "Shall I compare their experience against a specific role?"`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("visitor-coach error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
