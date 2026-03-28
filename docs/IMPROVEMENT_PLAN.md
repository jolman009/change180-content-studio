# Change180 Content Studio — Improvement Plan

> Generated 2026-03-28 based on full codebase analysis

## Gap Analysis Summary

| # | Area | Current State | Impact |
|---|------|--------------|--------|
| 1 | Testing | 1 smoke test file, zero service/component/E2E tests | **Critical** — no safety net for changes |
| 2 | Toast/Notifications | Inline status divs per page, errors lost on navigation | **High** — poor UX feedback loop |
| 3 | Performance | All routes eagerly loaded, no code splitting | **High** — slow initial load |
| 4 | Data Validation | Client-side only, no server-side sanitization | **High** — security risk |
| 5 | Token Refresh | Tokens checked but never refreshed; manual reconnect | **Medium** — broken publishing after expiry |
| 6 | Scheduled Posting | `scheduledFor` is metadata only, no automation | **Medium** — core feature gap |
| 7 | Instagram Publishing | Tunneled through Facebook Graph API only | **Medium** — limited Instagram support |
| 8 | Media/Image Support | Text-only posts, no file uploads | **Medium** — content quality gap |
| 9 | Platform Analytics | Manual notes only, no real engagement data | **Low** — nice-to-have for MVP |
| 10 | Content Templates | Not implemented | **Low** — convenience feature |

---

## Phase 1 — Foundation & Reliability (Week 1-2)

Stabilize the app before adding features. Focus on testing, validation, UX feedback, and performance.

### 1.1 Toast/Notification System ✅ COMPLETED
- [x] Install `sonner` toast library
- [x] Add `<Toaster>` to app root (`main.jsx`)
- [x] Replace inline status divs in `CalendarPage.jsx` with toast calls
- [x] Replace inline status divs in `CreateContentPage.jsx` with toast calls
- [x] Replace inline status divs in `AnalyticsNotesPage.jsx` with toast calls
- [x] Replace inline status divs in `BrandProfilePage.jsx` with toast calls
- [x] Replace inline status divs in `ConnectedAccountsPage.jsx` with toast calls
- [x] Remove `status` prop from `BrandProfileForm` and `aiStatus`/`saveStatus` from `GeneratedOutput`
- [x] Add success/error/info toasts for all user actions
- [x] Toasts persist across navigation (bottom-right, rich colors, close button)

### 1.2 Route-Based Code Splitting ✅ COMPLETED
- [x] Convert all 12 route imports in `router.jsx` to `React.lazy()` with dynamic `import()`
- [x] Add `<Suspense>` fallback with `LoadingState` via `SuspenseWrapper` component
- [x] Verified each route loads its own chunk (main bundle: 603KB → 512KB, 18 route chunks)
- [x] All 5 smoke tests pass — no navigation regressions

### 1.3 Server-Side Input Validation ✅ COMPLETED
- [x] Created shared `_shared/validation.ts` with helpers: `isNonEmptyString`, `isUUID`, `isValidUrl`, `stripHtml`, `sanitizeHashtags`, `enforceCharLimit`, `validateGenerateContentBody`, `validateOAuthBody`
- [x] `generate-content`: validates mode, all required input fields with length limits, rewrite requires currentOutput
- [x] `linkedin-publish`: UUID validation for postId, HTML stripping, hashtag sanitization, 3000 char limit
- [x] `facebook-publish`: UUID validation for postId, HTML stripping, hashtag sanitization, 63206 char limit
- [x] `linkedin-oauth`: validates authorization code (max 2000 chars) and redirectUri (valid URL)
- [x] `meta-oauth`: validates authorization code (max 2000 chars) and redirectUri (valid URL)

### 1.4 Unit & Integration Tests ✅ COMPLETED (86 tests, 7 test files)
- [x] `lib/__tests__/contentDraft.test.js` — 23 tests (normalize, validate, map, round-trip, platform defaults)
- [x] `lib/__tests__/brandProfile.test.js` — 7 tests (normalize, validate, round-trip)
- [x] `lib/__tests__/contentPipeline.test.js` — 18 tests (filters, stats, calendar groups, recent drafts, suggestions)
- [x] `lib/__tests__/aiGeneration.test.js` — 15 tests (request builders, response normalization, all tone actions)
- [x] `lib/__tests__/oAuth.test.js` — 9 tests (state validation, platform storage, cleanup)
- [x] `services/__tests__/contentService.test.js` — 9 tests (CRUD with localStorage fallback, mocked runtime)
- [ ] Add service tests for `brandService.js` *(deferred — same pattern as contentService)*
- [ ] Add service tests for `publishService.js` *(deferred — requires mock API)*
- [ ] Add component tests for `ContentForm.jsx`, `GeneratedOutput.jsx`, `CalendarBoard.jsx`, `ProtectedRoute.jsx` *(deferred to Phase 4)*

---

## Phase 2 — Core Feature Gaps (Week 3-4)

Address missing functionality that users expect from a content studio.

### 2.1 OAuth Token Refresh ✅ COMPLETED
- [x] Store `refresh_token` in LinkedIn OAuth (was discarded, now saved)
- [x] Implement `refreshLinkedInToken()` in `linkedin-publish` — attempts silent refresh before rejecting expired tokens
- [x] Store long-lived user access token as `refresh_token` in Meta OAuth for both Facebook and Instagram
- [x] Add "Token expiring soon" / "Token expired" warnings in `PlatformConnectionList` (<=7 days = amber, expired = red)
- [x] Add "Refresh" button that re-initiates OAuth flow for platforms with expiring tokens

### 2.2 Scheduled Auto-Publishing ✅ COMPLETED
- [x] Created `scheduled-publish/index.ts` edge function — queries due posts, publishes to LinkedIn/Facebook, updates status
- [x] Edge function handles per-post errors gracefully (sets `publish_error`, doesn't stop batch)
- [x] Added "Schedule for Auto-Publish" button in CalendarBoard for approved posts with a date
- [x] Scheduled posts shown with sky-blue styling, clock icon, and countdown ("Tomorrow", "In X days", "Due now")
- [x] `"scheduled"` already existed in `POST_STATUSES` — status filter works out of the box
- [x] Handles missing credentials per-post (sets error, continues batch)
- [x] Set up Supabase cron job to invoke the function periodically *(configured in Supabase dashboard)*

### 2.3 Media/Image Upload Support ✅ COMPLETED
- [x] Created `mediaService.js` with `uploadMedia()` and `validateMediaFile()` — Supabase Storage with localStorage fallback
- [x] Added image upload input to `ContentForm.jsx` (accept jpg/png/gif/webp, max 5MB, preview + remove)
- [x] Added `media_url` and `media_type` fields to data model (`contentDraft.js` mappers, `contentService.js` SELECT)
- [x] Media persists across regeneration and draft save/load
- [x] `PostPreview.jsx` shows uploaded image instead of gradient placeholder
- [x] `linkedin-publish` attaches image via `content.article.source` field
- [x] `facebook-publish` uses `/photos` endpoint with `url` param when image attached
- [x] `CalendarBoard` shows 16x16 image thumbnail on post cards
- [x] Create Supabase Storage bucket `post-media` *(configured in Supabase dashboard)*

---

## Phase 3 — Enhanced Features (Week 5-6)

Polish and expand capabilities for a more complete product.

### 3.1 Instagram Direct Publishing ✅ COMPLETED
- [x] Created `instagram-publish/index.ts` — two-step Graph API flow (create container → publish)
- [x] Updated `publishService.js` with platform endpoint routing map (LinkedIn, Facebook, Instagram, X)
- [x] Enforces image requirement for Instagram feed posts (returns 400 if no media_url)
- [x] Instagram caption enforced at 2200 chars via shared `enforceCharLimit`
- [x] Updated `scheduled-publish` with dedicated `publishToInstagram` function

### 3.2 Platform Analytics Integration ✅ COMPLETED
- [x] Created `fetch-analytics/index.ts` — fetches metrics from LinkedIn, Facebook, and Instagram APIs
- [x] Metrics: impressions, reach, likes, comments, shares, clicks, engagement
- [x] Upserts results into `post_analytics` table
- [x] Added `fetchPostMetrics()` to `analyticsService.js` with mock fallback
- [x] AnalyticsNotesPage now shows "Post Metrics" dashboard for published posts with per-post refresh
- [x] Metric cards with icons: Eye, Users, Heart, MessageCircle, Share2, MousePointerClick
- [ ] Create `post_analytics` table in Supabase *(requires dashboard config)*

### 3.3 Content Templates ✅ COMPLETED
- [x] Created `templateService.js` with `getTemplates`, `saveTemplate`, `deleteTemplate` (Supabase + localStorage)
- [x] Added "Save as Template" button in `GeneratedOutput.jsx` (BookmarkPlus icon)
- [x] Added template picker dropdown in `ContentForm.jsx` that pre-fills form fields
- [x] Templates stored with: name, platform, contentType, pillar, tone, promptTemplate, hookTemplate, ctaTemplate
- [ ] Create `content_templates` table in Supabase *(requires dashboard config)*
- [ ] Template management page with edit/delete *(deferred — CRUD works, UI management can be added later)*

### 3.4 X (Twitter) Integration ✅ COMPLETED
- [x] Created `x-oauth/index.ts` — OAuth 2.0 PKCE flow with token exchange and user info
- [x] Created `x-publish/index.ts` — posts tweets via X API v2 with 280 char enforcement
- [x] Created `xOAuth.js` — frontend OAuth URL builder with PKCE code challenge generation
- [x] Updated `ConnectedAccountsPage` to handle X connect via `buildXAuthUrl`
- [x] Updated `OAuthCallbackPage` to detect and handle X OAuth callbacks with code verifier
- [x] X added to `publishService.js` endpoint routing

---

## Phase 4 — Quality & Polish (Ongoing)

### 4.1 E2E Testing
- [ ] Set up Playwright or Cypress
- [ ] E2E: Login flow (sign in, sign up, redirect to dashboard)
- [ ] E2E: Content creation flow (fill form → generate → edit → save draft)
- [ ] E2E: Calendar flow (view posts → change date → publish)
- [ ] E2E: Brand profile flow (fill → save → verify persistence)
- [ ] E2E: OAuth connection flow (mock OAuth redirect)

### 4.2 Accessibility & SEO
- [ ] Add meta tags to `index.html` (description, og:title, og:description)
- [ ] Add `aria-label` attributes to icon-only buttons throughout the app
- [ ] Ensure keyboard navigation works for calendar drag-and-drop
- [ ] Add `<title>` per route using React Helmet or route-level document.title
- [ ] Run Lighthouse audit and fix any a11y issues

### 4.3 Error Monitoring & Logging
- [ ] Integrate an error tracking service (e.g., Sentry) for production
- [ ] Add structured logging to edge functions
- [ ] Create an error recovery flow for failed publishes (retry queue)

---

## Priority Order (Recommended)

```
1. Toast System (1.1)          — Quick win, immediate UX improvement
2. Code Splitting (1.2)        — Quick win, immediate performance gain
3. Server Validation (1.3)     — Security, should ship before more users
4. Unit Tests (1.4)            — Safety net before adding features
5. Token Refresh (2.1)         — Prevents broken publishing
6. Scheduled Publishing (2.2)  — Core expected feature
7. Media Upload (2.3)          — Unlocks richer content
8. Instagram Publishing (3.1)  — Expand platform reach
9. Analytics (3.2)             — Data-driven content decisions
10. Templates (3.3)            — Power user convenience
11. X Integration (3.4)        — Platform expansion
12. E2E Tests (4.1)            — Long-term reliability
13. A11y & SEO (4.2)           — Polish
14. Error Monitoring (4.3)     — Production readiness
```
