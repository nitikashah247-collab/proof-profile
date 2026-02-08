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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith(".pdf");
    const isDocx = fileName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      return new Response(
        JSON.stringify({ error: "Only PDF and DOCX files are supported" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fileBytes = new Uint8Array(await file.arrayBuffer());
    let extractedText = "";

    if (isPdf) {
      extractedText = extractTextFromPdfSimple(fileBytes);
    } else if (isDocx) {
      extractedText = await extractTextFromDocx(fileBytes);
    }

    // If native extraction yields minimal text, use Claude Vision as fallback
    const useVision = extractedText.trim().length < 50;

    let claudeResponse;

    if (useVision && isPdf) {
      // Use Claude Vision for scanned PDFs
      const base64File = arrayBufferToBase64(fileBytes.buffer);
      claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: base64File,
                  },
                },
                {
                  type: "text",
                  text: EXTRACTION_PROMPT,
                },
              ],
            },
          ],
        }),
      });
    } else {
      // Use extracted text with Claude
      const textToAnalyze = extractedText.trim().length > 50 ? extractedText : "Unable to extract text from document. Please provide basic structure.";

      claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: `Here is the resume text:\n\n${textToAnalyze}\n\n${EXTRACTION_PROMPT}`,
            },
          ],
        }),
      });
    }

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "Failed to analyse resume with AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const claudeData = await claudeResponse.json();
    const aiText = claudeData.content?.[0]?.text || "";

    // Parse the JSON from Claude's response
    let parsedInfo;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      console.error("Failed to parse Claude response:", aiText);
      parsedInfo = {
        full_name: "",
        headline: "",
        bio: "",
        industry: "",
        years_experience: null,
        roles: [],
        key_achievements: [],
        skills: [],
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        extracted: parsedInfo,
        raw_text_length: extractedText.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("parse-resume error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

const EXTRACTION_PROMPT = `Extract the following information from this resume and return it as a JSON object. Be thorough and extract as much as possible.

Return ONLY a JSON object with these fields:
{
  "full_name": "string - the person's full name",
  "headline": "string - a professional headline (e.g., 'Senior Product Manager | SaaS & Fintech')",
  "bio": "string - a 2-3 sentence professional summary",
  "industry": "string - primary industry",
  "years_experience": number or null,
  "location": "string or null",
  "roles": [
    {
      "title": "string - job title",
      "company": "string - company name",
      "start_date": "string - approximate start (e.g., '2020-01')",
      "end_date": "string or null - approximate end, null if current",
      "description": "string - brief role description",
      "key_achievement": "string - most notable achievement in this role"
    }
  ],
  "key_achievements": ["string - top 3-5 career achievements with metrics where possible"],
  "skills": [
    {
      "name": "string",
      "category": "string - e.g., 'Technical', 'Leadership', 'Domain'"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string or null"
    }
  ]
}`;

// Simple PDF text extraction - reads text objects from PDF
function extractTextFromPdfSimple(bytes: Uint8Array): string {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const textParts: string[] = [];

  // Extract text between BT and ET markers (text objects)
  const btEtRegex = /BT\s([\s\S]*?)ET/g;
  let match;
  while ((match = btEtRegex.exec(text)) !== null) {
    const block = match[1];
    // Extract text from Tj and TJ operators
    const tjRegex = /\(([^)]*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textParts.push(tjMatch[1]);
    }
    // TJ arrays
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g;
    let tjArrMatch;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      const innerRegex = /\(([^)]*)\)/g;
      let innerMatch;
      while ((innerMatch = innerRegex.exec(tjArrMatch[1])) !== null) {
        textParts.push(innerMatch[1]);
      }
    }
  }

  return textParts.join(" ").replace(/\\n/g, "\n").replace(/\s+/g, " ").trim();
}

// DOCX text extraction - reads from document.xml inside the zip
async function extractTextFromDocx(bytes: Uint8Array): Promise<string> {
  // DOCX files are ZIP archives. We look for the PK signature and find document.xml
  const textDecoder = new TextDecoder("utf-8", { fatal: false });
  const fullText = textDecoder.decode(bytes);

  // Try to find XML text content between <w:t> tags
  const textParts: string[] = [];
  const wtRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  let match;
  while ((match = wtRegex.exec(fullText)) !== null) {
    textParts.push(match[1]);
  }

  if (textParts.length > 0) {
    return textParts.join(" ").replace(/\s+/g, " ").trim();
  }

  // Fallback: extract any readable text
  return fullText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 5000);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  return btoa(binary);
}
