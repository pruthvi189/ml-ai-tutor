# Plan: Multi-User Auth + Interactive Learning

## Context
The ML AI Tutor is currently single-user with no auth. Learning is passive (read markdown → take quiz). Need to add:
1. Simple auth so friends can sign up and use it
2. Interactive learning beyond just reading text

## Auth Design
**Approach**: Lightweight JWT-in-cookie auth. No heavy libraries (no NextAuth/Clerk).
- **bcryptjs** for password hashing (pure JS, no native deps)
- **jose** for JWT (edge-compatible, works on Vercel)
- Cookie-based sessions via `Set-Cookie` header
- Middleware protects all `(dashboard)` routes

**Why not NextAuth?** Overkill for email/password. Adds 5+ deps, OAuth provider config, adapter complexity. A 50-line auth lib does the same thing.

## Interactive Learning Design
Replace "read markdown then quiz" with 4 engagement modes:

### 1. Flashcards (spaced repetition)
- AI generates flashcards alongside lessons
- Flip-card UI with known/unknown toggle
- Tracks which cards need review (simple box system: new → learning → review)

### 2. Code Sandbox (fill-in-the-blank)  
- AI generates code exercises with blanks (`___BLANK_1___`)
- User fills in blanks, clicks "Check"
- Instant feedback: which blanks are right/wrong, expected vs actual

### 3. AI Tutor Chat
- Per-lesson chat widget
- User asks questions about the lesson content
- AI responds in context of that specific lesson
- Conversation history stored per-user

### 4. Warm-Up Quiz (5 quick questions before lesson)
- 5 rapid-fire MCQ questions before starting a lesson
- Tests prior knowledge, identifies gaps
- Shorter than full quiz, instant feedback per question

---

## Files to Create/Modify

### Auth System
| File | Action | Purpose |
|------|--------|---------|
| `src/lib/auth.ts` | CREATE | JWT helpers, session get/set, password hash/verify |
| `src/middleware.ts` | CREATE | Route protection — redirect unauthenticated users to /login |
| `src/app/(auth)/layout.tsx` | CREATE | Auth layout (no sidebar, centered) |
| `src/app/(auth)/login/page.tsx` | CREATE | Login form |
| `src/app/(auth)/signup/page.tsx` | CREATE | Signup form |
| `src/app/api/auth/signup/route.ts` | CREATE | POST — create user, set cookie |
| `src/app/api/auth/login/route.ts` | CREATE | POST — verify creds, set cookie |
| `src/app/api/auth/logout/route.ts` | CREATE | POST — clear cookie |
| `src/app/api/auth/me/route.ts` | CREATE | GET — return current user from cookie |

### Schema Changes
| File | Action | Purpose |
|------|--------|---------|
| `src/lib/schema.ts` | MODIFY | Add `users` table, `userLessons` table, add `userId` FK to `userProgress` and `quizAttempts` |
| `src/lib/db.ts` | NO CHANGE | Already exports db with schema |

### Interactive Learning
| File | Action | Purpose |
|------|--------|---------|
| `src/lib/prompts.ts` | MODIFY | Add flashcard, code exercise, warmup, and chat prompts |
| `src/components/flashcard.tsx` | CREATE | Flip-card component with known/unknown |
| `src/components/code-sandbox.tsx` | CREATE | Fill-in-the-blank code editor |
| `src/components/chat-widget.tsx` | CREATE | AI tutor chat per lesson |
| `src/components/warmup-quiz.tsx` | CREATE | 5 rapid MCQ before lesson |
| `src/app/(dashboard)/courses/[id]/lessons/[lessonId]/page.tsx` | MODIFY | Add warmup quiz, chat widget, flashcards |
| `src/app/api/courses/[id]/lessons/[lessonId]/chat/route.ts` | CREATE | POST — AI tutor chat with lesson context |
| `src/app/api/courses/[id]/lessons/[lessonId]/flashcards/route.ts` | CREATE | GET — generate/retrieve flashcards |
| `src/app/api/courses/[id]/lessons/[lessonId]/warmup/route.ts` | CREATE | GET — generate warmup quiz |

### Dashboard Updates
| File | Action | Purpose |
|------|--------|---------|
| `src/components/app-sidebar.tsx` | MODIFY | Add user avatar + logout in footer |
| `src/components/dashboard-shell.tsx` | MODIFY | Pass user info to header |
| `src/app/page.tsx` | MODIFY | Dashboard shows per-user stats |

---

## Implementation Order

### Step 1: Auth system (schema + lib + API + middleware + pages)
### Step 2: Wire auth into existing pages (sidebar, dashboard, API routes)
### Step 3: Interactive features (flashcards, code sandbox, warmup, chat)
### Step 4: Wire interactive features into lesson pages
### Step 5: Build + test + deploy

## Dependencies to Add
```bash
npm install bcryptjs jose
npm install -D @types/bcryptjs
```

## Verification
- `npm run build` must pass
- Test signup/login/logout flow locally
- Test lesson page shows warmup → lesson → flashcards → quiz flow
- Test AI chat widget responds to questions
- Test code sandbox validates fill-in-the-blank answers
- Deploy to Vercel, test multi-user access
