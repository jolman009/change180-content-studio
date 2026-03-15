# Change180 Content Studio

## Project Overview
A React-based content operating system for the Change180 coaching brand. Users define brand voice, generate AI-powered social media content, organize drafts on a calendar, and track performance notes.

## Tech Stack
- **Frontend:** React 19 + Vite 7 + React Router 7 + Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **AI:** OpenAI API via Supabase Edge Function (`/generate-content`)
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel (frontend), Supabase (backend)

## Commands
```bash
npm run dev       # Vite dev server on localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint
npm run test      # Vitest smoke tests
```

## Project Structure
```
src/
  app/           # Router setup, smoke tests
  features/      # Route-level page containers (DashboardPage, CreateContentPage, etc.)
  components/    # Reusable UI components (no service imports)
  lib/           # Utilities, constants, data mappers, mock data
  services/      # Backend integration (Supabase, AI, localStorage fallback)
supabase/
  functions/     # Edge functions (generate-content)
  config.toml    # Local Supabase config
docs/            # Technical docs, sprint board, API contracts
```

## Architecture Conventions
- **Data flow:** Feature page → service function → Supabase/localStorage → normalize → render
- **Components:** PascalCase files. Route pages in `features/`, reusable UI in `components/`
- **Utilities:** camelCase files in `lib/` (framework-agnostic)
- **Services:** All async/backend calls isolated in `services/`. Dual-mode: Supabase when available, localStorage fallback
- **Data mapping:** `lib/contentDraft.js`, `lib/brandProfile.js` convert between DB records and UI models
- **No global state manager** — local useState + shared hooks (e.g., `useContentPosts`)
- **JavaScript only** — no TypeScript

## Runtime Modes
App auto-detects environment and runs in one of three modes:
- **mock** — no env vars, uses localStorage + mock/demo data
- **partial** — some env vars set
- **integration ready** — both Supabase and API configured

## Environment Variables
```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_API_BASE_URL=http://127.0.0.1:54321/functions/v1
```

## Key Data Models
- **BrandProfile:** brand_name, mission, target_audience, tone_rules, preferred_ctas, banned_phrases
- **ContentPost:** platform, contentType, pillar, goal, tone, topic, status (draft→approved→scheduled→posted), hook, body, cta, hashtags, visualDirection

## Edge Function: generate-content
- Modes: `generate` (new content) and `rewrite` (tone adjustments)
- Injects brand profile context into OpenAI prompts
- Tone actions: softer, stronger, clearer, shorter, more_direct
- JWT verification disabled

## Testing
- Smoke tests in `src/app/app.smoke.test.jsx` cover main route navigation
- No E2E or browser-level tests yet

## Important Notes
- No authentication/authorization implemented yet (single-user MVP)
- No direct social media publishing (post-MVP feature)
- Supabase schema/migrations are managed outside this repo
- When Supabase is unavailable, all services gracefully fall back to localStorage
