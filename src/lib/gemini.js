// Using Groq (free, fast) — https://console.groq.com
const API_KEY = import.meta.env.VITE_GROQ_API_KEY
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

async function callAI(prompt, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.75,
        max_tokens: 2048,
      }),
    })
    const data = await res.json()

    if (res.status === 429 && attempt < retries) {
      const wait = (attempt + 1) * 15000
      await new Promise(r => setTimeout(r, wait))
      continue
    }

    if (!res.ok) throw new Error(data.error?.message || 'AI API error')
    return data.choices[0].message.content
  }
  throw new Error('Rate limit reached. Please wait a moment and try again.')
}

function parseJSON(text) {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

export async function generateInterview({ role, company, jobDescription, candidateName, resumeText }) {
  const companyStr = company ? `at ${company} ` : ''
  const name = candidateName || 'the candidate'
  const resumeSection = resumeText
    ? `\n\nCandidate Resume:\n${resumeText.slice(0, 2500)}\n\nUse the resume to ask targeted questions about their specific projects, tools, and experience. Reference things from their background naturally.`
    : ''

  const prompt = `You are Alex, a warm and professional HR interviewer ${companyStr}hiring for a ${role} position.

Generate a complete interview conversation script for candidate named ${name}.
The tone must feel like a real human-to-human interview — natural, warm, and professional.

Return ONLY valid JSON with no markdown or extra text:

{
  "greeting": "Your warm opening greeting to ${name}. Introduce yourself as Alex, welcome them, mention the role, and ask how they are doing. 2-3 natural sentences.",
  "transition": "After ${name} responds to your greeting, transition naturally into the interview. 1-2 sentences acknowledging their response then moving to questions.",
  "questions": [
    "Full text of interview question 1",
    "Full text of interview question 2",
    "Full text of interview question 3",
    "Full text of interview question 4",
    "Full text of interview question 5"
  ],
  "question_intros": [
    "Natural 1-sentence intro/transition before question 2 (e.g. 'Great, thank you for sharing that.')",
    "Natural 1-sentence intro/transition before question 3",
    "Natural 1-sentence intro/transition before question 4",
    "Natural 1-sentence intro/transition before question 5"
  ],
  "closing": "A warm genuine closing after all questions. Thank ${name} by name, say it was a pleasure, mention next steps. 2-3 sentences."
}

Base the 5 questions on this job description (mix technical and behavioral):
${jobDescription}${resumeSection}

IMPORTANT: Return only raw JSON. No markdown code blocks. No extra text.`

  const text = await callAI(prompt)
  return parseJSON(text)
}

export async function generateFeedback({ role, company, questions, answers }) {
  const companyStr = company ? `at ${company}` : ''
  const qa = questions.map((q, i) =>
    `Q${i + 1}: ${q}\nAnswer: ${answers[i] || '(no answer provided)'}`
  ).join('\n\n')

  const prompt = `You are an expert interview coach. Evaluate this mock interview for a ${role} position ${companyStr}.

${qa}

Provide detailed, constructive feedback. Return ONLY valid JSON with no markdown:

{
  "overall_score": <integer 0-100>,
  "overall_summary": "2-3 sentence overall performance summary",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement area 1", "improvement area 2"],
  "questions": [
    { "score": <integer 0-100>, "feedback": "Specific 1-2 sentence feedback on this answer" },
    { "score": <integer 0-100>, "feedback": "..." },
    { "score": <integer 0-100>, "feedback": "..." },
    { "score": <integer 0-100>, "feedback": "..." },
    { "score": <integer 0-100>, "feedback": "..." }
  ]
}

IMPORTANT: Return only raw JSON. No markdown code blocks.`

  const text = await callAI(prompt)
  return parseJSON(text)
}
