import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Please log in to use the AI Coach." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.error("Auth error:", claimsError?.message || "No claims");
      return new Response(JSON.stringify({ error: "Session expired. Please log in again." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { messages, profileData, sections, conversationId } = await req.json();

    // Build context about the user's profile
    let profileContext = "";
    if (profileData) {
      profileContext += `\n\nUser Profile:\n`;
      profileContext += `- Name: ${profileData.full_name || "Not set"}\n`;
      profileContext += `- Headline: ${profileData.headline || "Not set"}\n`;
      profileContext += `- Industry: ${profileData.industry || "Not set"}\n`;
      profileContext += `- Years of experience: ${profileData.years_experience || "Unknown"}\n`;
      profileContext += `- Location: ${profileData.location || "Not set"}\n`;
      profileContext += `- Bio: ${profileData.bio || "Not set"}\n`;
    }

    if (sections && sections.length > 0) {
      profileContext += `\nCurrent profile sections (in order):\n`;
      for (const s of sections) {
        profileContext += `- ${s.section_type} (visible: ${s.is_visible}, has data: ${Object.keys(s.section_data || {}).length > 0})\n`;
      }
    }

    const systemPrompt = `You are an expert AI career coach embedded in a professional profile-building platform called Proof. Your job is to help users optimize their profile to stand out for their target roles.

You have deep knowledge of:
- What hiring managers, recruiters, and investors look for in professional profiles
- How to structure and present career achievements with maximum impact
- Section-level advice: which sections to add, emphasize, hide, or reorder
- Industry-specific best practices for Marketing, Finance, Tech, Sales, Operations, etc.
- Storytelling frameworks for professional accomplishments (STAR, CAR, etc.)

Available section types the user can add: hero, career_timeline, skills_matrix, case_studies, testimonials, impact_charts, work_style, credentials, visual_portfolio, brand_logos, speaking_writing, personal_projects, lifestyle_gallery, deal_experience, advisory_roles, process_frameworks, finance_impact_charts

${profileContext}

Guidelines:
- Keep responses concise (2-4 paragraphs max) and actionable
- When suggesting section additions, mention the exact section type name so the system can auto-add it
- Format section suggestions as: [ADD_SECTION:section_type] (e.g., [ADD_SECTION:testimonials])
- Be encouraging but specific — "add testimonials" is better than "consider social proof"
- Reference the user's actual profile data when giving advice
- If they ask about a job description, analyze it and map their strengths to the requirements
- Suggest what to emphasize AND what to de-emphasize for specific roles`;

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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
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

    // Save/update conversation in DB (fire and forget)
    const allMessages = [...messages];
    if (conversationId) {
      supabase
        .from("coach_conversations")
        .update({ messages: allMessages })
        .eq("id", conversationId)
        .then(() => {});
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("career-coach error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
