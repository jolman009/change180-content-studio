# Production Hardening Checklist

## Phase 1: Security Foundation
_Must-have before any real users. Auth gates everything else._

- [x] **1. Authentication (Supabase Auth)**
  - [x] Enable Supabase Auth (email/password or magic link)
  - [x] Create login/signup pages
  - [x] Add auth context provider wrapping the app
  - [x] Protect all routes with auth guard (redirect to login if unauthenticated)
  - [x] Pass user JWT to Supabase client and Edge Function calls
  - [x] Add logout button to Sidebar/Topbar
  - [x] Test: unauthenticated user cannot access app routes
  - [x] Test: authenticated user can access all features

- [x] **3. Row-Level Security (RLS)**
  - [x] Enable RLS on `brand_profiles` table
  - [x] Enable RLS on `content_posts` table
  - [x] Enable RLS on `performance_logs` table
  - [x] Write policies: users can only read/write their own rows
  - [x] Re-enable JWT verification on Edge Function
  - [x] Test: user A cannot see user B's data
  - [x] Test: unauthenticated requests are rejected (401)

## Phase 2: Data Integrity
_Lock down the schema and validate what flows through the system._

- [ ] **2. Supabase Schema in Repo**
  - [ ] Run `supabase db diff` to capture current schema
  - [x] Save migration files to `supabase/migrations/`
  - [ ] Add seed file (`supabase/seed.sql`) for demo data
  - [ ] Document migration workflow in README
  - [ ] Verify migrations run clean on a fresh Supabase project

- [ ] **5. Data Validation**
  - [ ] Add response validation to Edge Function output (verify hook, caption, cta, hashtags, visual fields exist)
  - [ ] Add input validation on ContentForm before sending to API
  - [ ] Add validation on brand profile save (required fields: brand_name, mission, target_audience)
  - [ ] Add error boundaries that show user-friendly messages on malformed data
  - [ ] Test: malformed API response shows error state, not crash

## Phase 3: Testing & Reliability
_Confidence that things work and you'll know when they don't._

- [ ] **4. E2E Tests**
  - [ ] Set up Playwright or Cypress
  - [ ] E2E: Brand profile create and save flow
  - [ ] E2E: Content creation with AI generation (mock Edge Function response)
  - [ ] E2E: Save draft, edit draft, approve draft
  - [ ] E2E: Calendar view shows scheduled posts
  - [ ] E2E: Status transitions (draft → approved → scheduled → posted)
  - [ ] E2E: Mobile viewport navigation
  - [ ] Add E2E tests to CI pipeline

- [ ] **7. Error Monitoring**
  - [ ] Set up Sentry (or similar) account
  - [ ] Install Sentry SDK and initialize in `main.jsx`
  - [ ] Add error boundary integration with Sentry reporting
  - [ ] Tag errors with runtime mode (mock/partial/integration)
  - [ ] Add Edge Function error logging (Supabase logs or external)
  - [ ] Verify errors appear in dashboard with stack traces

## Phase 4: Production Safeguards
_Protect the system from abuse and data loss._

- [ ] **8. Rate Limiting**
  - [ ] Add rate limiting to Edge Function (e.g., 10 requests/min per user)
  - [ ] Return 429 status with retry-after header when limit hit
  - [ ] Show user-friendly "slow down" message in UI on 429
  - [ ] Add OpenAI spend alert/budget cap in OpenAI dashboard
  - [ ] Test: rapid-fire requests get throttled

- [ ] **6. Backup & Export**
  - [ ] Enable Supabase Point-in-Time Recovery (or daily backups)
  - [ ] Add "Export All Content" button (JSON or CSV download)
  - [ ] Add individual post export/copy-to-clipboard
  - [ ] Document recovery procedure in case of data loss
  - [ ] Test: exported data can be re-imported

## Phase 5: Polish
_Nice to have for a professional feel. Lower priority for internal tool._

- [ ] **9. SEO / Meta Tags**
  - [ ] Add page titles per route (document.title or react-helmet)
  - [ ] Add favicon and Open Graph meta tags
  - [ ] Add manifest.json for PWA-like install
  - [ ] Skip if this remains an internal/private tool

---

## Phase Summary

| Phase | Focus | Items | Priority |
|-------|-------|-------|----------|
| 1 | Security Foundation | Auth + RLS | Done |
| 2 | Data Integrity | Schema migrations + Validation | High |
| 3 | Testing & Reliability | E2E tests + Error monitoring | High |
| 4 | Production Safeguards | Rate limiting + Backups | Medium |
| 5 | Polish | SEO / Meta tags | Low |
