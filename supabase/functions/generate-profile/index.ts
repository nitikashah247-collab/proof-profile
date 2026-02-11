import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GENERATION_PROMPT = `You are an expert profile writer and data visualization specialist. Based on the resume data and interview responses below, generate a comprehensive, visually rich professional profile.

Return ONLY a valid JSON object (no markdown fences) with these fields:

{
  "bio": "string - A compelling 2-3 sentence professional bio using storytelling from interview responses",
  "headline": "string - A punchy professional headline (under 80 chars)",
  "positioning_statement": "string - A 1-2 sentence statement of what makes this person uniquely valuable",
  "hero_stats": {
    "years_experience": "number",
    "projects_led": "number - estimate from resume roles/achievements",
    "people_managed": "number - estimate from resume",
    "key_metric": {
      "value": "number - the most impressive single metric",
      "label": "string - what it measures",
      "suffix": "string - e.g. '%', 'x', 'M', 'K+'"
    }
  },
  "visualizations": [
    {
      "type": "line_chart | bar_chart | pie_chart",
      "title": "string - chart title",
      "headline_value": "string - e.g. '38%' or '$85M'",
      "headline_label": "string - e.g. 'YoY Growth'",
      "data": [
        {"label": "string", "value": "number"}
      ],
      "format": "currency | percentage | number"
    }
  ],
  "case_studies": [
    {
      "title": "string - Compelling title for this achievement story",
      "company": "string - Company where this happened",
      "key_metric": "string - The headline number e.g. '38%' or '$85M'",
      "summary": "string - One sentence summary",
      "challenge": "string - 2-3 sentences describing the challenge",
      "approach": "string - 2-3 sentences about the strategy taken",
      "results": "string - 2-3 sentences about measurable outcomes",
      "skills_used": ["string - skill names relevant to this case study"],
      "metrics": [
        { "label": "string", "value": "string" }
      ]
    }
  ],
  "skills_with_proof": [
    {
      "name": "string - skill name (UNIQUE - never repeat a skill name)",
      "category": "string - MUST be exactly one of: 'Core Competency' or 'Technical Proficiency'",
      "level": "number 1-5 proficiency",
      "years": "number - estimated years of experience",
      "proof_point": "string - brief evidence from experience"
    }
  ],
  "impact_metrics": [
    {
      "label": "string - what was measured",
      "value": "string - the number or percentage",
      "context": "string - brief context"
    }
  ],
  "languages": [
    {
      "name": "string - language name",
      "proficiency": "string - Native, Fluent, Professional, Conversational, or Basic"
    }
  ],
  "publications": [
    {
      "title": "string - article/publication title",
      "outlet": "string - where it was published",
      "year": "string - year published",
      "url": "string - link if available, empty string if not"
    }
  ],
  "work_style": {
    "dimensions": [
      {
        "label": "string - e.g. 'Collaboration Style'",
        "left_label": "string - e.g. 'Independent'",
        "right_label": "string - e.g. 'Collaborative'",
        "value": "number 0-100, 50 is center"
      }
    ],
    "traits": ["string - 6 work style traits"]
  },
  "career_timeline": [
    {
      "company": "string",
      "role": "string",
      "start_year": "string",
      "end_year": "string - or 'Present'",
      "achievements": ["string - 3-4 key achievements at this role"]
    }
  ]
}

CRITICAL RULES FOR SKILLS:
- Each skill name MUST be unique — NEVER include duplicates
- Classify each skill into exactly one of two categories:
  * "Core Competency" — soft skills like Leadership, Communication, Strategic Planning, Problem Solving, Cross-functional Collaboration
  * "Technical Proficiency" — tools, platforms, hard skills like Salesforce, Python, Excel, Financial Modeling, Data Analysis
- Merge semantically similar skills (e.g., "Strategic Planning" and "Strategy" → keep "Strategic Planning")
- Limit to 8-12 total skills, balanced between the two categories

CRITICAL RULES FOR VISUALIZATIONS:
- Scan ALL achievements for ANY quantifiable data: percentages, dollar amounts, team sizes, time periods, ratios, fractions, scores
- For EVERY percentage increase/decrease, create a line_chart showing trajectory (generate 6-12 plausible data points)
- For EVERY before/after comparison, create a bar_chart
- For portfolio/segment breakdowns, create a pie_chart
- "1 out of 5" → bar_chart showing the proportion
- "$2M budget" → metric in impact_metrics
- "NPS improved by 20 points" → line_chart or bar_chart
- Generate at least 3 visualizations, up to 6
- Use relative scales if exact data unavailable (e.g. base=100, after=138 for 38% growth)
- THE GOLDEN RULE: If it's a number, visualize it. Don't just write it as text.

CRITICAL RULES FOR CASE STUDIES:
- Generate 3-5 detailed case studies from BOTH resume AND interview answers
- Each MUST have a company name, key_metric, all three sections (challenge/approach/results), and skills_used
- Make them specific and story-driven, not generic

CRITICAL RULES — NO TESTIMONIALS:
- DO NOT generate any testimonials. Return an empty array for testimonials: []
- Testimonials must only come from real people — never fabricate quotes
- The platform will prompt users to add real testimonials later

CRITICAL RULES FOR LANGUAGES & PUBLICATIONS:
- If the resume mentions languages spoken, extract them into the "languages" array
- If the resume mentions publications, articles, papers, or writing, extract them into "publications"
- If neither is present, return empty arrays

CRITICAL RULES FOR HERO STATS:
- Extract or estimate: years of experience, projects/initiatives led, people managed, and one headline metric
- The key_metric should be the single most impressive quantifiable achievement

CRITICAL RULES FOR WORK STYLE:
- Infer 4 work style dimensions from interview responses (collaboration, decision-making, problem-solving, communication)
- Extract 6 traits/values from how they describe their work

CRITICAL RULES FOR CAREER TIMELINE:
- Each role at a company is ONE entry with start_year and end_year
- Do NOT create multiple entries for the same role
- Include 3-4 key achievements per role (not just responsibilities)
- Format as compelling one-liners

Use specific details from BOTH the resume AND interview responses. Don't be generic.`;

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

      // Include any additional resume sections (languages, publications, etc.)
      if (resumeData.languages?.length > 0) {
        context += `\n### Languages\n`;
        for (const lang of resumeData.languages) {
          context += `- ${lang.name}: ${lang.proficiency || "Unknown"}\n`;
        }
      }

      if (resumeData.publications?.length > 0) {
        context += `\n### Publications / Articles\n`;
        for (const pub of resumeData.publications) {
          context += `- ${pub.title}${pub.outlet ? ` (${pub.outlet})` : ""}${pub.year ? `, ${pub.year}` : ""}\n`;
        }
      }

      // Pass through any raw_text for full extraction
      if (resumeData.raw_text) {
        context += `\n### Full Resume Text\n${resumeData.raw_text}\n`;
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
        max_tokens: 8192,
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

    // Parse JSON from Claude's response
    let generatedProfile;
    try {
      let cleanText = aiText.trim();
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        generatedProfile = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseErr) {
      console.error("Failed to parse Claude response:", aiText.substring(0, 500));
      generatedProfile = {
        bio: resumeData?.bio || "",
        headline: resumeData?.headline || "",
        positioning_statement: "",
        hero_stats: {
          years_experience: resumeData?.years_experience || 5,
          projects_led: 20,
          people_managed: 10,
          key_metric: { value: 0, label: "Projects", suffix: "+" },
        },
        visualizations: [],
        case_studies: [],
        skills_with_proof: (resumeData?.skills || []).map((s: any) => ({
          name: s.name,
          category: s.category || "General",
          level: 4,
          years: 3,
          proof_point: "",
        })),
        impact_metrics: [],
        testimonials: [],
        languages: [],
        publications: [],
        work_style: { dimensions: [], traits: [] },
        career_timeline: [],
      };
    }

    // Post-process: force testimonials to empty (never hallucinate)
    generatedProfile.testimonials = [];

    // Post-process: deduplicate skills
    if (generatedProfile.skills_with_proof?.length > 0) {
      const seen = new Map<string, any>();
      for (const skill of generatedProfile.skills_with_proof) {
        const key = skill.name.toLowerCase().trim();
        if (seen.has(key)) {
          // Keep the one with higher level
          const existing = seen.get(key);
          if ((skill.level || 0) > (existing.level || 0)) {
            seen.set(key, skill);
          }
        } else {
          seen.set(key, skill);
        }
      }
      generatedProfile.skills_with_proof = Array.from(seen.values());
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
