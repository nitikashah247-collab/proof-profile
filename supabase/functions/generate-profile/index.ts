import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GENERATION_PROMPT = `You are an expert profile writer. Based on the resume data and interview responses below, generate a comprehensive professional profile.

Return ONLY a valid JSON object (no markdown fences) with these fields:

{
  "bio": "string - A compelling 2-3 sentence professional bio that captures the person's unique value proposition, using storytelling from their interview responses",
  "headline": "string - A punchy professional headline (under 80 chars)",
  "case_studies": [
    {
      "title": "string - Compelling title for this achievement story",
      "challenge": "string - 2-3 sentences describing the challenge or situation",
      "approach": "string - 2-3 sentences about the strategy and approach taken",
      "results": "string - 2-3 sentences about measurable outcomes and impact",
      "metrics": [
        { "label": "string - metric name", "value": "string - metric value e.g. 38%" }
      ]
    }
  ],
  "skills_with_proof": [
    {
      "name": "string - skill name",
      "category": "string - Technical, Leadership, Domain, or Strategic",
      "proof_point": "string - brief evidence from their experience"
    }
  ],
  "impact_metrics": [
    {
      "label": "string - what was measured",
      "value": "string - the number or percentage",
      "context": "string - brief context"
    }
  ],
  "positioning_statement": "string - A 1-2 sentence statement of what makes this person uniquely valuable"
}

Generate:
- 3-5 detailed case studies drawn from their roles AND interview answers. Each should have real metrics where possible.
- 8-12 skills with proof points from their actual experience.
- 4-6 impact metrics pulled from achievements and stories.
- A compelling bio that weaves together their career narrative.

IMPORTANT: Use specific details from BOTH the resume AND interview responses. Don't be generic.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { resumeData, interviewMessages, roleCategory, archetype } = await req.json();

    // Build the context for Claude
    let context = "";

    if (resumeData) {
      context += `\n## RESUME DATA\n`;
      context += `Name: ${resumeData.full_name || "Unknown"}\n`;
      context += `Headline: ${resumeData.headline || ""}\n`;
      context += `Industry: ${resumeData.industry || ""}\n`;
      context += `Years of experience: ${resumeData.years_experience || "Unknown"}\n`;
      context += `Location: ${resumeData.location || ""}\n`;
      context += `Bio from resume: ${resumeData.bio || ""}\n`;

      if (resumeData.roles?.length > 0) {
        context += `\n### Work Experience\n`;
        for (const role of resumeData.roles) {
          context += `- ${role.title} at ${role.company} (${role.start_date} - ${role.end_date || "Present"})\n`;
          if (role.description) context += `  Description: ${role.description}\n`;
          if (role.key_achievement) context += `  Key Achievement: ${role.key_achievement}\n`;
        }
      }

      if (resumeData.key_achievements?.length > 0) {
        context += `\n### Key Achievements\n`;
        for (const ach of resumeData.key_achievements) {
          context += `- ${ach}\n`;
        }
      }

      if (resumeData.skills?.length > 0) {
        context += `\n### Skills\n`;
        for (const skill of resumeData.skills) {
          context += `- ${skill.name} (${skill.category || "General"})\n`;
        }
      }

      if (resumeData.education?.length > 0) {
        context += `\n### Education\n`;
        for (const edu of resumeData.education) {
          context += `- ${edu.degree} from ${edu.institution}${edu.year ? ` (${edu.year})` : ""}\n`;
        }
      }
    }

    if (interviewMessages?.length > 0) {
      context += `\n## AI INTERVIEW RESPONSES\n`;
      context += `(The user answered these questions during a career interview)\n\n`;
      for (const msg of interviewMessages) {
        const prefix = msg.role === "ai" ? "Interviewer" : "User";
        context += `${prefix}: ${msg.content}\n\n`;
      }
    }

    if (roleCategory) {
      context += `\nRole category: ${roleCategory}\n`;
    }
    if (archetype) {
      context += `Selected profile archetype/style: ${archetype}\n`;
    }

    console.log("Generating profile with context length:", context.length);

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `${GENERATION_PROMPT}\n\n---\n\n${context}`,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to generate profile with AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeData = await claudeResponse.json();
    const aiText = claudeData.content?.[0]?.text || "";

    console.log("Claude response length:", aiText.length);

    // Parse JSON from Claude's response - strip markdown fences if present
    let generatedProfile;
    try {
      let cleanText = aiText.trim();
      // Remove markdown code fences
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedProfile = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseErr) {
      console.error("Failed to parse Claude response:", aiText.substring(0, 500));
      // Return a minimal fallback
      generatedProfile = {
        bio: resumeData?.bio || "",
        headline: resumeData?.headline || "",
        case_studies: [],
        skills_with_proof: (resumeData?.skills || []).map((s: any) => ({
          name: s.name,
          category: s.category || "General",
          proof_point: "",
        })),
        impact_metrics: [],
        positioning_statement: "",
      };
    }

    return new Response(
      JSON.stringify({ success: true, generated: generatedProfile }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-profile error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
