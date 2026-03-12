# PrepAA: Mock Interview Assistant

A full-stack web app that simulates real job interviews using AI voice conversation. Pick a role, optionally upload your resume, and get interviewed by an AI.

---

## Features

- **Live Voice Interviews** — AI speaks questions aloud using browser TTS; you answer with your microphone
- **Resume-Tailored Questions** — Upload a PDF or TXT resume and questions are generated based on your actual experience
- **4 Job Profiles** — Data Analyst, Data Engineer, Full Stack Engineer, AI Engineer
- **Instant AI Feedback** — Overall score, strengths, improvement areas, and per-question analysis
- **Full Interview Transcript** — Replay the entire conversation with inline feedback after each answer
- **Session History** — All past interviews saved to your account with scores and details
- **Authentication** — Sign up / sign in via Clerk
- **Persistent Storage** — Sessions and resume text stored in Supabase (PostgreSQL)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Routing | React Router v7 |
| Styling | Tailwind CSS 4, inline styles (dark theme) |
| Auth | Clerk v6 (`@clerk/react`) |
| Database | Supabase (PostgreSQL) |
| AI (LLM) | Groq API |
| Speech (TTS) | Browser Web Speech API — `SpeechSynthesis` |
| Speech (STT) | Browser Web Speech API — `SpeechRecognition` |
| PDF Parsing | `pdfjs-dist` (client-side, no backend) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd ai-interview-preparation-assistant
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_GROQ_API_KEY=gsk_...
```

#### Where to get these:
- **Clerk** → [clerk.com](https://clerk.com) → Create app → API Keys
- **Supabase** → [supabase.com](https://supabase.com) → New project → Project Settings → API
- **Groq** → [console.groq.com](https://console.groq.com) → API Keys → Create API Key (free)

### 3. Set up Supabase database

Go to your Supabase project → **SQL Editor** and run:

```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  role text not null,
  company text,
  job_description text not null,
  resume_name text not null,
  resume_text text,
  status text not null default 'pending',
  question_count int4 not null default 0,
  created_at timestamptz not null default now(),
  questions jsonb,
  answers jsonb,
  feedback jsonb
);
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)


---

## How It Works

1. **Sign up** and land on the Dashboard
2. **Pick a job role** (e.g. Data Analyst) to see the role details
3. **Upload your resume** (optional PDF or TXT) questions will reference your background
4. **Click Start Interview** Groq generates a personalised question 
5. **AI Alex speaks** the greeting via browser TTS; you respond with your microphone
6. **Answer 5 questions** by speaking; click "Next Question" to proceed
7. **Interview closes** with a natural goodbye

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_GROQ_API_KEY` | Groq API key (starts with `gsk_`) |

---

## Browser Support

Voice features (TTS + STT) require a modern browser. Best experience on:
- Google Chrome (recommended)
- Microsoft Edge

Firefox and Safari have limited `SpeechRecognition` support.

---

## Deployment

The project is pre-configured for **Vercel**. Push the repo to GitHub, connect it in Vercel, and set the four environment variables in the project settings. The `vercel.json` rewrite rule handles SPA client-side routing automatically.

```bash
vercel deploy
```



