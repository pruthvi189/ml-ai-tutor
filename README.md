<div align="center">

# ML AI Tutor

**Turn any GitHub repo or topic into a structured, interactive course**

[![Live Demo](https://img.shields.io/badge/Live-https://web-opal-six-16.vercel.app/login-2ea44f?style=for-the-badge)](https://web-opal-six-16.vercel.app/login)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)

</div>

An AI-powered tutor that transforms **any GitHub repository or topic** into a personalized learning experience. Paste a repo URL or pick a topic, and it generates a full course — structured modules, lessons, quizzes, exercises, flashcards, and an interactive chat assistant — then tracks your progress as you learn.

## ✨ Features

- **Course generation from any source** — feed it a GitHub repo or a bare topic (e.g. `rag`, `langchain`)
- **Full curriculum pipeline** — 5-stage generation: source ingestion → course structure → lessons → quizzes → exercises
- **Interactive lessons** — AI chat, flashcards, and warm-up questions per lesson
- **Quiz generation with automated evaluation** — submit and get scored
- **GitHub repo analysis** — analyze a repo and learn it module by module
- **OAuth authentication** — Google / GitHub sign-in with per-user progress tracking
- **AI interview practice** — generated mock interviews with automated evaluation

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Python Pipeline                           │
│                                                                  │
│  Source ──▶ Ingest ──▶ Course ──▶ Lessons ──▶ Quizzes ──▶ Exercises │
│  repo/topic    (repomix)   (LLM)     (LLM)      (LLM)      (LLM) │
└──────────────────────────────────────────────────────────────────┘
                              │  JSON output
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Next.js Web App                            │
│                                                                  │
│  Auth (OAuth/JWT) · Courses · Lessons · Chat · Flashcards ·      │
│  Quizzes · Progress tracking (Drizzle ORM + PostgreSQL)          │
└──────────────────────────────────────────────────────────────────┘
```

- **`pipeline/`** — Python generation pipeline (source ingestion, LLM-backed course/lesson/quiz/exercise generation, retry + rate-limit handling)
- **`web/`** — Next.js 16 App Router frontend with Drizzle ORM, auth, and all interactive learning features

## 🛠️ Tech Stack

**Pipeline (Python):**
- `google-genai` (Gemini 2.5 Flash) with `groq/llama-3.3-70b` fallback
- `repomix` — packs any GitHub repo into a token-efficient bundle
- Pydantic settings + models for structured generation

**Web (TypeScript):**
- Next.js 16 + React 19, Tailwind CSS 4, shadcn/ui
- Drizzle ORM + PostgreSQL, JWT + OAuth (Google / GitHub)
- `@google/genai`, Framer Motion, react-markdown, react-syntax-highlighter

## 🚀 Getting Started

### 1. Pipeline (course generation)

```bash
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY

# Generate a course from a topic
python run_pipeline.py topic rag

# Or from a GitHub repo
python run_pipeline.py repo https://github.com/langchain-ai/langchain
```

Output is written to `output/` as structured JSON (course, lessons, quizzes, exercises).

### 2. Web app (learning platform)

```bash
cd web
npm install
cp .env.example .env   # configure DB + auth
npm run db:push        # push the Drizzle schema
npm run dev            # http://localhost:3000
```

### Environment variables

```
# Pipeline (.env)
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=optional_fallback_key

# Web (web/.env)
DATABASE_URL=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## 📦 Scripts

```bash
# Web
npm run dev          # development server
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint
npm run db:push      # apply Drizzle migrations
npm run db:generate  # generate Drizzle migrations
```

## 🗺️ Roadmap

- [x] Course generation from topics and repos
- [x] Lessons, quizzes, exercises, flashcards
- [x] OAuth (Google / GitHub) with progress tracking
- [x] Interactive AI chat per lesson
- [x] AI interview practice with evaluation
- [ ] Collaborative / shared courses
