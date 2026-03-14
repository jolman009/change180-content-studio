# Change180 Content Studio

React + Vite frontend for planning brand content, generating draft copy, and organizing a simple publishing calendar for Change180.

## Requirements

- Node.js 20+
- npm 10+

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env
```

3. Update `.env` with real values if you want to connect Supabase or an API backend:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://127.0.0.1:54321/functions/v1
```

4. Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Supabase Edge Function

The frontend expects a `POST /generate-content` endpoint. This repo now includes a Supabase Edge Function at [supabase/functions/generate-content/index.ts](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/supabase/functions/generate-content/index.ts) that matches the contract in [docs/Generate_Content_API_Contract.md](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/docs/Generate_Content_API_Contract.md).

Local setup:

```bash
supabase start
supabase secrets set OPENAI_API_KEY=your_openai_api_key OPENAI_MODEL=gpt-5-mini
supabase functions serve generate-content --no-verify-jwt
```

Then point `VITE_API_BASE_URL` to `http://127.0.0.1:54321/functions/v1`.

Deploy:

```bash
supabase functions deploy generate-content --no-verify-jwt
supabase secrets set OPENAI_API_KEY=your_openai_api_key OPENAI_MODEL=gpt-5-mini
```

Use your deployed function base URL for `VITE_API_BASE_URL`.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Current Integration Status

- The UI shell, routing, and page flows work locally without a backend.
- Week 1 uses centralized mock data and shared empty/loading/error states while persistence is still being wired.
- Supabase and API client modules are present, but the current pages still use local/demo state.
- You can leave placeholder env values in place for frontend-only development.
- The top bar shows whether the app is running in local mock mode or partial integration mode.

## Week 1 Foundation Decisions

- Route-level orchestration lives in `src/features/`.
- Reusable presentational UI lives in `src/components/`.
- Canonical options and mock records live in `src/lib/`.
- Missing Supabase or API env values should fail gracefully instead of crashing the app at startup.

## Project Structure

```text
src/
  app/          Router setup
  components/   Shared UI and page-specific components
  features/     Route-level page components
  lib/          Shared API and client helpers
  services/     Backend-facing service modules
  styles/       Global styles
```
