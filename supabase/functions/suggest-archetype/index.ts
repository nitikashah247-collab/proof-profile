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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { resumeData, roleCategory } = await req.json();

    const prompt = `You are a career branding expert. Based on the following professional background, suggest the single best profile archetype from these options:

- executive: Dark, data-driven, authoritative. Best for C-suite, VPs, directors, finance leaders, consultants.
- creative: Bold, visual, personality-forward. Best for marketers, designers, content creators, brand managers.
- technical: Structured, systems-thinking. Best for engineers, developers, data scientists, architects.
- sales: Results-focused, high energy. Best for sales leaders, BDMs, account executives, revenue roles.
- operations: Precise, process-oriented. Best for operations managers, project managers, supply chain, HR leaders.

Professional background:
- Name: ${resumeData?.full_name || "Unknown"}
- Headline: ${resumeData?.headline || "Not provided"}
- Industry: ${resumeData?.industry || roleCategory || "General"}
- Bio: ${resumeData?.bio || "Not provided"}
- Recent roles: ${resumeData?.roles?.slice(0, 3).map((r: any) => `${r.title} at ${r.company}`).join(", ") || "Not provided"}
- Skills: ${resumeData?.skills?.slice(0, 8).map((s: any) => s.name).join(", ") || "Not provided"}
- Detected role category: ${roleCategory || "general"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a career branding expert. Return ONLY a JSON object, no markdown." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_archetype",
              description: "Return the suggested archetype and a brief explanation.",
              parameters: {
                type: "object",
                properties: {
                  archetype: {
                    type: "string",
                    enum: ["executive", "creative", "technical", "sales", "operations"],
                    description: "The recommended archetype ID",
                  },
                  reason: {
                    type: "string",
                    description: "A single sentence explaining why this archetype was chosen, referencing the person's background. Example: 'Based on your finance background and leadership roles, we've selected Exec Ready.'",
                  },
                },
                required: ["archetype", "reason"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_archetype" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI suggestion failed");
    }

    const data = await response.json();
    
    // Extract from tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try parsing the content directly
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ultimate fallback
    return new Response(
      JSON.stringify({ archetype: "executive", reason: "Selected as a versatile default for your professional background." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("suggest-archetype error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
