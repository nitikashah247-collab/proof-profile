import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const QUESTION_GENERATION_PROMPT = `You are generating personalized interview questions for a professional creating their career profile on Proof — a platform that showcases career stories beyond what a resume shows.

Your goal: Generate 15-17 interview questions that feel like a conversation with a smart recruiter who has READ their resume carefully.

RESUME ANALYSIS:
{RESUME_CONTEXT}

DETECTED ROLE CATEGORY: {ROLE_CATEGORY}
SENIORITY: {SENIORITY}

YOUR TASK:
Generate questions following this exact structure. Reference SPECIFIC details from their resume (projects, metrics, companies, job titles).

QUESTION CATEGORIES (follow this order):

1. OPENING (exactly 2 questions):
   - "In one sentence, how would you describe yourself professionally?"
   - "What kind of role are you looking for next?"

2. CAREER DEEP-DIVE (5-7 questions, ADAPTIVE to resume):
   - If resume mentions a specific project/achievement: "I see you [specific achievement]. What was the hardest part of making that happen?"
   - If resume has quantifiable metrics: "You achieved [specific metric] — walk me through your approach."
   - If 5+ years experience: "What's the biggest challenge you've faced in your career so far? How did it change you?"
   - If <3 years experience: "What's something you want to get better at in your next role?"
   - ALWAYS include: "Tell me about a time you failed or made a mistake. What did you learn?"
   - ALWAYS include: "What's a project or achievement you're proud of that ISN'T on your resume?"

3. PERSONALITY (3-4 questions, same for everyone):
   - "How would your teammates describe working with you?"
   - "What kind of work energizes you? What drains you?"
   - "What does 'good company culture' mean to you?"

4. HIDDEN GEMS (2-3 questions):
   - "What's a skill you have that most people don't know about from reading your resume?"
   - "Tell me about work you've done outside your day job — side projects, volunteering, passion projects."

5. FUTURE-FOCUSED (2 questions):
   - "Where do you want to be in 3 years?"
   - "What's the dream role you're building toward?"

6. PROOF/ARTIFACTS (1-2 questions):
   - "Do you have any artifacts you could share? Dashboards, presentations, emails from colleagues praising your work, awards, screenshots of results?"
   - "What's the best piece of feedback you've ever received?"

RULES:
- If resume mentions specific achievement, ask about it directly by name
- If resume has metrics, ask HOW they achieved them
- If resume shows leadership, ask about management philosophy
- If resume is junior, ask about learning goals instead of leadership
- Make questions feel conversational, not robotic
- Reference company names, project names, specific numbers from the resume
- Total: 15-17 questions

Return ONLY a valid JSON array (no markdown fences):
[
  {
    "id": 1,
    "text": "Question text here",
    "category": "opening" | "career_deep_dive" | "personality" | "hidden_gems" | "future" | "proof"
  }
]`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { resumeData, roleCategory } = await req.json();

    // Build resume context for analysis
    let resumeContext = "";
    let seniority = "mid-level";

    if (resumeData) {
      resumeContext += `Name: ${resumeData.full_name || "Unknown"}\n`;
      resumeContext += `Headline: ${resumeData.headline || ""}\n`;
      resumeContext += `Industry: ${resumeData.industry || ""}\n`;
      resumeContext += `Years of experience: ${resumeData.years_experience || "Unknown"}\n`;
      resumeContext += `Location: ${resumeData.location || ""}\n`;

      // Determine seniority
      const years = resumeData.years_experience || 0;
      if (years < 3) seniority = "junior";
      else if (years < 7) seniority = "mid-level";
      else if (years < 12) seniority = "senior";
      else seniority = "executive";

      // Check titles for seniority indicators
      const allTitles = (resumeData.roles || []).map((r: any) => r.title).join(" ").toLowerCase();
      if (/\b(vp|vice president|director|chief|cxo|cto|cfo|cmo|coo|svp|evp|head of)\b/.test(allTitles)) {
        seniority = "executive";
      } else if (/\b(senior|lead|principal|staff)\b/.test(allTitles)) {
        seniority = "senior";
      }

      if (resumeData.roles?.length > 0) {
        resumeContext += `\nWork Experience:\n`;
        for (const role of resumeData.roles) {
          resumeContext += `- ${role.title} at ${role.company} (${role.start_date} - ${role.end_date || "Present"})\n`;
          if (role.description) resumeContext += `  Description: ${role.description}\n`;
          if (role.key_achievement) resumeContext += `  Key Achievement: ${role.key_achievement}\n`;
        }
      }

      if (resumeData.key_achievements?.length > 0) {
        resumeContext += `\nKey Achievements:\n`;
        for (const ach of resumeData.key_achievements) {
          resumeContext += `- ${ach}\n`;
        }
      }

      if (resumeData.skills?.length > 0) {
        resumeContext += `\nSkills: ${resumeData.skills.map((s: any) => s.name).join(", ")}\n`;
      }

      if (resumeData.education?.length > 0) {
        resumeContext += `\nEducation:\n`;
        for (const edu of resumeData.education) {
          resumeContext += `- ${edu.degree} from ${edu.institution}\n`;
        }
      }
    } else {
      resumeContext = "No resume provided. Generate general professional interview questions.";
    }

    const prompt = QUESTION_GENERATION_PROMPT
      .replace("{RESUME_CONTEXT}", resumeContext)
      .replace("{ROLE_CATEGORY}", roleCategory || "general")
      .replace("{SENIORITY}", seniority);

    console.log("Generating interview questions for role:", roleCategory, "seniority:", seniority);

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
            content: prompt,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errText);
      throw new Error("Failed to generate questions");
    }

    const claudeData = await claudeResponse.json();
    const aiText = claudeData.content?.[0]?.text || "";

    let questions;
    try {
      let cleanText = aiText.trim();
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found");
      }
    } catch (parseErr) {
      console.error("Failed to parse questions:", aiText.substring(0, 500));
      // Fallback to generic questions
      questions = getFallbackQuestions(roleCategory || "general", seniority);
    }

    // Ensure IDs are sequential
    questions = questions.map((q: any, i: number) => ({ ...q, id: i + 1 }));

    return new Response(
      JSON.stringify({ success: true, questions, seniority }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-interview-questions error:", error);

    // Return fallback questions so the interview can still proceed
    const fallback = getFallbackQuestions("general", "mid-level");
    return new Response(
      JSON.stringify({ success: true, questions: fallback, seniority: "mid-level", fallback: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getFallbackQuestions(role: string, seniority: string) {
  const questions = [
    { id: 1, text: "In one sentence, how would you describe yourself professionally?", category: "opening" },
    { id: 2, text: "What kind of role are you looking for next?", category: "opening" },
    { id: 3, text: "Tell me about a project you're most proud of. What was your specific contribution?", category: "career_deep_dive" },
    { id: 4, text: "What's the most impressive result or metric you've achieved in your career?", category: "career_deep_dive" },
    { id: 5, text: seniority === "junior" || seniority === "mid-level"
      ? "What's something you want to get better at in your next role?"
      : "What's the biggest challenge you've faced in your career so far? How did it change you?", category: "career_deep_dive" },
    { id: 6, text: "Tell me about a time you failed or made a mistake. What did you learn?", category: "career_deep_dive" },
    { id: 7, text: "What's a project or achievement you're proud of that ISN'T on your resume?", category: "career_deep_dive" },
    { id: 8, text: "How would your teammates describe working with you?", category: "personality" },
    { id: 9, text: "What kind of work energizes you? What drains you?", category: "personality" },
    { id: 10, text: "What does 'good company culture' mean to you?", category: "personality" },
    { id: 11, text: "What's a skill you have that most people don't know about from reading your resume?", category: "hidden_gems" },
    { id: 12, text: "Tell me about work you've done outside your day job — side projects, volunteering, passion projects.", category: "hidden_gems" },
    { id: 13, text: "Where do you want to be in 3 years?", category: "future" },
    { id: 14, text: "What's the dream role you're building toward?", category: "future" },
    { id: 15, text: "What's the best piece of feedback you've ever received?", category: "proof" },
  ];
  return questions;
}
