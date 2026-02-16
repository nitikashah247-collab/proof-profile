import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildGenerationPrompt(themePrimaryColor: string, themeSecondaryColor: string) {
  return `You are an expert profile writer and data visualization specialist. Based on the resume data, interview responses, and uploaded artifacts below, generate a comprehensive, visually rich professional profile.

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
      "format": "currency | percentage | number",
      "color": "${themePrimaryColor}"
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
      ],
      "artifacts": [
        {
          "url": "string - URL of the matching artifact from ARTIFACTS section",
          "caption": "string - Brief description of what it shows",
          "type": "string - dashboard|presentation|email|certificate|screenshot"
        }
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
  ],
  "section_order": ["string - ordered list of section types based on user's strengths. Choose from: hero, impact_charts, case_studies, career_timeline, skills_matrix, work_style, languages, publications"]
}

CRITICAL RULES FOR SKILLS:
- Each skill name MUST be unique — NEVER include duplicates
- Classify each skill into exactly one of two categories:
  * "Core Competency" — soft skills like Leadership, Communication, Strategic Planning, Problem Solving, Cross-functional Collaboration
  * "Technical Proficiency" — tools, platforms, hard skills like Salesforce, Python, Excel, Financial Modeling, Data Analysis, HubSpot, Tableau, NetSuite, AWS, Docker, JIRA, SAP, Power BI, Google Analytics
- ACTIVELY SCAN the resume for tool/platform/system mentions
- Merge semantically similar skills
- Limit to 8-12 total skills, balanced between the two categories

CRITICAL RULES FOR VISUALIZATIONS:
- Scan ALL achievements for ANY quantifiable data: percentages, dollar amounts, team sizes, time periods, ratios
- For EVERY percentage increase/decrease, create a line_chart showing trajectory (generate 6-12 plausible data points)
- For EVERY before/after comparison, create a bar_chart
- For portfolio/segment breakdowns, create a pie_chart
- Generate at least 3 visualizations, up to 6
- Use theme colors: primary ${themePrimaryColor}, secondary ${themeSecondaryColor}
- THE GOLDEN RULE: If it's a number, visualize it
- NEVER return an empty visualizations array if any metrics exist

CRITICAL RULES FOR CASE STUDIES:
- Generate EXACTLY 3-5 case studies — NO MORE THAN 5
- Select the MOST impressive stories based on: quantifiable metrics, recency, seniority
- Each MUST have company name, key_metric, all three sections (challenge/approach/results), and skills_used
- Make them specific and story-driven using interview responses for context
- Quality over quantity — 3 excellent stories beats 12 mediocre ones

CRITICAL RULES FOR ARTIFACT EMBEDDING:
- Match uploaded artifacts to relevant case studies based on their descriptions
- Dashboard artifacts → Embed in the most relevant Impact Story about metrics/data
- Presentation artifacts → Embed in Impact Stories about launches/strategies
- Certificate artifacts → If uploaded, ensure there's a mention in the profile
- Email/praise artifacts → Reference as supporting evidence
- ONLY use artifact URLs provided in the ARTIFACTS section — NEVER invent artifact URLs
- If no artifacts match a case study, leave the artifacts array empty for that story

CRITICAL RULES FOR SECTION ORDERING:
- Analyze the user's strengths from resume and interview data
- If heavy on metrics/data → order: hero, impact_charts, case_studies, career_timeline, skills_matrix
- If creative/visual role → order: hero, case_studies, skills_matrix, career_timeline, work_style
- If leadership/senior → order: hero, case_studies, career_timeline, impact_charts, skills_matrix
- If technical → order: hero, skills_matrix, case_studies, career_timeline, work_style
- Use interview responses to gauge what they're proudest of and lead with that

CRITICAL RULES — NO TESTIMONIALS:
- DO NOT generate any testimonials — never fabricate quotes

CRITICAL RULES FOR CAREER TIMELINE:
- ONE entry per distinct ROLE — do NOT create separate entries per year
- Each entry = Company | Role Title | Start Year - End Year
- Maximum 6 entries — focus on most significant career moves
- Include 3-4 key achievements per role

CRITICAL RULES FOR WORK STYLE:
- Infer 4 work style dimensions from interview responses
- Extract 6 traits/values from how they describe their work

Use specific details from BOTH the resume AND interview responses. Don't be generic.`;
}

async function analyzeArtifacts(artifacts: any[], apiKey: string): Promise<any[]> {
  const descriptions: any[] = [];

  for (const artifact of artifacts || []) {
    if (artifact.type?.startsWith("image/")) {
      try {
        const response = await fetch(artifact.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch artifact: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const analysisResponse = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 512,
            messages: [{
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: artifact.type, data: base64 },
                },
                {
                  type: "text",
                  text: `Analyze this professional artifact briefly:
1. What type is it? (dashboard, presentation, email, certificate, project screenshot)
2. What achievement or result does it show?
3. Any visible metrics?
Return JSON: { "category": "type here", "description": "2-sentence description", "metrics": ["any numbers/percentages"] }`,
                },
              ],
            }],
          }),
        });

        if (analysisResponse.ok) {
          const data = await analysisResponse.json();
          const text = data.content?.[0]?.text || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            descriptions.push({ url: artifact.url, name: artifact.name, ...parsed });
            continue;
          }
        }
      } catch (error) {
        console.error("Artifact analysis failed:", error);
      }
      // Fallback for failed image analysis
      descriptions.push({
        url: artifact.url,
        name: artifact.name,
        category: "image",
        description: `Professional artifact: ${artifact.name}`,
        metrics: [],
      });
    } else {
      descriptions.push({
        url: artifact.url,
        name: artifact.name,
        category: "document",
        description: `Document: ${artifact.name}`,
        metrics: [],
      });
    }
  }

  return descriptions;
}

function buildContext(
  resumeData: any,
  interviewMessages: any[],
  roleCategory: string,
  artifactDescriptions: any[],
  themeBase: string,
  themePrimaryColor: string,
  themeSecondaryColor: string
): string {
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

  if (artifactDescriptions.length > 0) {
    context += `\n## ARTIFACTS UPLOADED (Proof of Work)\n`;
    for (const a of artifactDescriptions) {
      context += `- ${a.category}: ${a.description}\n  URL: ${a.url}\n`;
      if (a.metrics?.length > 0) {
        context += `  Visible metrics: ${a.metrics.join(", ")}\n`;
      }
    }
  }

  if (roleCategory) {
    context += `\nRole category: ${roleCategory}\n`;
  }

  context += `\n## THEME SELECTED\n`;
  context += `- Base: ${themeBase || "light"}\n`;
  context += `- Primary Color: ${themePrimaryColor || "#3B82F6"}\n`;
  context += `- Secondary Color: ${themeSecondaryColor || "#8B5CF6"}\n`;

  return context;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const {
      resumeData,
      interviewMessages,
      roleCategory,
      artifacts,
      artifactUrls,
      themeSettings,
      archetype, // legacy
    } = await req.json();

    // Normalize artifacts: support both new format (objects) and legacy (URL strings)
    let normalizedArtifacts: any[] = [];
    if (artifacts?.length > 0) {
      normalizedArtifacts = artifacts;
    } else if (artifactUrls?.length > 0) {
      normalizedArtifacts = artifactUrls.map((url: string) => ({
        url,
        name: url.split("/").pop() || "artifact",
        type: "image/jpeg",
      }));
    }

    const themeBase = themeSettings?.themeBase || "light";
    const themePrimaryColor = themeSettings?.primaryColor || "#3B82F6";
    const themeSecondaryColor = themeSettings?.secondaryColor || "#8B5CF6";

    // Step 1: Analyze artifacts with Claude Vision
    console.log("Analyzing", normalizedArtifacts.length, "artifacts...");
    const artifactDescriptions = await analyzeArtifacts(normalizedArtifacts, ANTHROPIC_API_KEY);
    console.log("Artifact analysis complete:", artifactDescriptions.length, "analyzed");

    // Step 2: Build context and prompt
    const context = buildContext(
      resumeData,
      interviewMessages,
      roleCategory,
      artifactDescriptions,
      themeBase,
      themePrimaryColor,
      themeSecondaryColor
    );

    const prompt = buildGenerationPrompt(themePrimaryColor, themeSecondaryColor);

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
            content: `${prompt}\n\n---\n\n${context}`,
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
        languages: [],
        publications: [],
        work_style: { dimensions: [], traits: [] },
        career_timeline: [],
        section_order: ["hero", "impact_charts", "case_studies", "career_timeline", "skills_matrix"],
      };
    }

    // Post-process: force testimonials to empty (never hallucinate)
    generatedProfile.testimonials = [];

    // Post-process: limit case studies to 5 max
    if (generatedProfile.case_studies?.length > 5) {
      generatedProfile.case_studies = generatedProfile.case_studies.slice(0, 5);
    }

    // Post-process: validate artifact URLs in case studies (only keep real ones)
    const validArtifactUrls = new Set(normalizedArtifacts.map((a: any) => a.url));
    if (generatedProfile.case_studies?.length > 0) {
      for (const cs of generatedProfile.case_studies) {
        if (cs.artifacts?.length > 0) {
          cs.artifacts = cs.artifacts.filter((a: any) => validArtifactUrls.has(a.url));
        }
      }
    }

    // Post-process: limit career timeline to 6 max, deduplicate
    if (generatedProfile.career_timeline?.length > 0) {
      const seen = new Set<string>();
      generatedProfile.career_timeline = generatedProfile.career_timeline.filter((entry: any) => {
        const key = `${entry.company}|${entry.role}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 6);
    }

    // Post-process: deduplicate skills
    if (generatedProfile.skills_with_proof?.length > 0) {
      const seen = new Map<string, any>();
      for (const skill of generatedProfile.skills_with_proof) {
        const key = skill.name.toLowerCase().trim();
        if (seen.has(key)) {
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

    // Ensure section_order exists
    if (!generatedProfile.section_order) {
      generatedProfile.section_order = ["hero", "impact_charts", "case_studies", "career_timeline", "skills_matrix"];
    }

    // Include artifact descriptions for front-end use
    generatedProfile.artifact_descriptions = artifactDescriptions;

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
