// Role-specific interview questions that surface stories, not generic answers

export type RoleCategory = "marketing" | "finance" | "technical" | "sales" | "operations" | "general";

export interface InterviewQuestion {
  question: string;
  followUpTriggers?: Array<{
    keywords: string[];
    followUp: string;
  }>;
}

const marketingQuestions: InterviewQuestion[] = [
  {
    question: "Tell me about a campaign or launch you led that you're genuinely proud of. What made it work?",
    followUpTriggers: [
      { keywords: ["team", "led", "managed"], followUp: "How did you rally the team around the creative vision? Any pushback you had to navigate?" },
      { keywords: ["metric", "growth", "revenue", "%", "increase"], followUp: "Walk me through how you measured that impact. What was the before and after?" },
    ],
  },
  {
    question: "What do colleagues come to you for help with? What's your reputation in the marketing world?",
    followUpTriggers: [
      { keywords: ["brand", "positioning", "messaging"], followUp: "Can you give me an example of a positioning challenge you cracked that others couldn't?" },
      { keywords: ["data", "analytics", "performance"], followUp: "How do you balance creative instinct with data? Give me an example." },
    ],
  },
  {
    question: "Tell me about a time you had an idea that others doubted, but you pushed through anyway. What happened?",
    followUpTriggers: [
      { keywords: ["stakeholder", "executive", "leadership"], followUp: "How did you convince the sceptics? What was your approach?" },
    ],
  },
  {
    question: "What's the most creative go-to-market strategy you've developed? What made it different?",
  },
  {
    question: "If I asked your last manager to describe your superpower in one sentence, what would they say?",
  },
];

const financeQuestions: InterviewQuestion[] = [
  {
    question: "Tell me about a deal or financial initiative you led that you're most proud of. What was the outcome?",
    followUpTriggers: [
      { keywords: ["raise", "funding", "series", "capital"], followUp: "Walk me through the fundraising process. How did you structure the pitch to investors?" },
      { keywords: ["cost", "savings", "reduction", "efficiency"], followUp: "How did you identify those savings without impacting operations? What was your approach?" },
    ],
  },
  {
    question: "What do people come to you for? When there's a tough financial decision, why do they call you?",
    followUpTriggers: [
      { keywords: ["model", "forecast", "analysis"], followUp: "Can you walk me through a model you built that changed how leadership thought about the business?" },
    ],
  },
  {
    question: "Describe a time you had to deliver difficult financial news to the board or leadership. How did you handle it?",
  },
  {
    question: "What's the most complex financial problem you've solved? What made your approach unique?",
    followUpTriggers: [
      { keywords: ["team", "built", "hire"], followUp: "How did you build trust with your team? What's your leadership philosophy?" },
    ],
  },
  {
    question: "If I asked your CEO to describe the value you bring in one sentence, what would they say?",
  },
];

const technicalQuestions: InterviewQuestion[] = [
  {
    question: "Tell me about a system or product you built that you're genuinely proud of. What problem did it solve?",
    followUpTriggers: [
      { keywords: ["scale", "performance", "users", "traffic"], followUp: "Walk me through the architecture decisions. What trade-offs did you make and why?" },
      { keywords: ["team", "led", "managed", "mentored"], followUp: "How did you help your team grow technically? Any specific mentoring moments that stand out?" },
    ],
  },
  {
    question: "What do colleagues come to you for help with? What's your technical reputation?",
    followUpTriggers: [
      { keywords: ["debug", "problem", "solve", "fix"], followUp: "Give me an example of a gnarly bug or outage you diagnosed that stumped others." },
    ],
  },
  {
    question: "Tell me about a time you proposed a technical approach that was controversial but turned out to be right.",
  },
  {
    question: "What's the most elegant solution you've designed? What made it elegant rather than just functional?",
  },
  {
    question: "If I asked your tech lead or CTO to describe your superpower in one sentence, what would they say?",
  },
];

const salesQuestions: InterviewQuestion[] = [
  {
    question: "Tell me about your biggest deal or client win. What was your strategy to close it?",
    followUpTriggers: [
      { keywords: ["relationship", "trust", "long-term"], followUp: "How do you build those deep client relationships? What's your secret?" },
      { keywords: ["number", "quota", "target", "revenue", "%"], followUp: "Walk me through how you consistently hit those numbers. What's your process?" },
    ],
  },
  {
    question: "What do clients say about working with you? What's your reputation?",
  },
  {
    question: "Tell me about a deal everyone thought was dead, but you found a way to save it. What happened?",
  },
  {
    question: "What's your approach when you're selling into a completely new market or product category?",
    followUpTriggers: [
      { keywords: ["team", "led", "managed", "built"], followUp: "How do you motivate a sales team? What's your coaching style?" },
    ],
  },
  {
    question: "If I asked your best client to describe why they chose you, what would they say?",
  },
];

const operationsQuestions: InterviewQuestion[] = [
  {
    question: "Tell me about a process or system you redesigned that made a real difference. What was broken, and how did you fix it?",
    followUpTriggers: [
      { keywords: ["scale", "growth", "efficiency"], followUp: "How did you measure the impact? What metrics improved?" },
      { keywords: ["team", "people", "culture"], followUp: "How did you get buy-in from the people affected by the change?" },
    ],
  },
  {
    question: "What do people come to you for? When there's operational chaos, why do they call you?",
  },
  {
    question: "Describe a time you had to make a tough call that prioritised long-term efficiency over short-term convenience.",
  },
  {
    question: "What's the most complex cross-functional project you've managed? What made it challenging?",
  },
  {
    question: "If I asked your team to describe your leadership style in one sentence, what would they say?",
  },
];

const generalQuestions: InterviewQuestion[] = [
  {
    question: "Tell me about a project you're most proud of and why. What was your specific contribution?",
    followUpTriggers: [
      { keywords: ["team", "led", "managed"], followUp: "How did you build trust with your team? What's your approach to leadership?" },
      { keywords: ["metric", "result", "outcome", "%", "increase", "decrease"], followUp: "Walk me through how you achieved that number. What was your process?" },
    ],
  },
  {
    question: "What do colleagues come to you for help with? What's your edge?",
  },
  {
    question: "Tell me about a time you had to influence without authority. How did you make it happen?",
  },
  {
    question: "What's the most creative solution you've come up with to a problem everyone else was stuck on?",
  },
  {
    question: "If I asked your last manager to describe your superpower in one sentence, what would they say?",
  },
];

const questionSets: Record<RoleCategory, InterviewQuestion[]> = {
  marketing: marketingQuestions,
  finance: financeQuestions,
  technical: technicalQuestions,
  sales: salesQuestions,
  operations: operationsQuestions,
  general: generalQuestions,
};

export function detectRoleCategory(resumeData: { industry?: string; roles?: Array<{ title: string }> } | null): RoleCategory {
  if (!resumeData) return "general";

  const allText = [
    resumeData.industry || "",
    ...(resumeData.roles?.map(r => r.title) || []),
  ].join(" ").toLowerCase();

  if (/market|brand|content|growth|gtm|product market|communications|pr\b|advertising/i.test(allText)) return "marketing";
  if (/financ|cfo|controller|accounting|treasury|fp&a|investment|banking/i.test(allText)) return "finance";
  if (/engineer|developer|architect|devops|software|data scien|machine learn|technical lead|cto\b/i.test(allText)) return "technical";
  if (/sales|account exec|business develop|revenue|partnerships|client success/i.test(allText)) return "sales";
  if (/operations|ops\b|supply chain|logistics|process|project manage|program manage|chief operating/i.test(allText)) return "operations";

  return "general";
}

export function getQuestionsForRole(role: RoleCategory): InterviewQuestion[] {
  return questionSets[role] || questionSets.general;
}

export function findFollowUp(question: InterviewQuestion, userResponse: string): string | null {
  if (!question.followUpTriggers) return null;
  
  const lowerResponse = userResponse.toLowerCase();
  for (const trigger of question.followUpTriggers) {
    if (trigger.keywords.some(kw => lowerResponse.includes(kw.toLowerCase()))) {
      return trigger.followUp;
    }
  }
  return null;
}
