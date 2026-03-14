# Change180 Content Studio Technical Architecture

## Purpose

This document describes the current frontend architecture, the intended integration boundaries, and the next structural changes needed to turn the prototype into a working MVP.

## Current Stack

- React 19
- Vite 8
- React Router 7
- Tailwind CSS v4
- Supabase client library

## Current Runtime Shape

The app is currently a client-rendered React application with route-level feature pages and mostly local state.

High-level request flow today:

1. `index.html` mounts the React app
2. [main.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/main.jsx) bootstraps `RouterProvider`
3. [router.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/app/router.jsx) defines route entry points
4. [App.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/App.jsx) wraps routed content in the shared shell
5. [AppShell.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/layout/AppShell.jsx) renders the layout frame
6. Feature pages manage local interactions and render presentation components

## Directory Roles

### `src/app`

App-level composition and routing.

Current file:

- [router.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/app/router.jsx)

Recommendation:

- Keep route definitions here
- Add route-level loaders only if data fetching becomes router-driven

### `src/features`

Route-level containers and feature orchestration.

Current files:

- [DashboardPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/dashboard/DashboardPage.jsx)
- [BrandProfilePage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/brand/BrandProfilePage.jsx)
- [CreateContentPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/content/CreateContentPage.jsx)
- [CalendarPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/calendar/CalendarPage.jsx)

Current behavior:

- Holds local `useState` form state
- Uses static seed values
- Does not yet load or persist real data through the service layer

Recommendation:

- Keep business flow wiring here
- Move API and persistence calls here or into co-located hooks
- Avoid burying async orchestration in presentational components

### `src/components`

Reusable UI building blocks and feature-specific presentation components.

Subareas:

- `layout/`: app shell, sidebar, top bar
- `ui/`: low-level primitives like buttons, inputs, cards
- `brand/`, `content/`, `calendar/`, `dashboard/`: feature-oriented presentational pieces

Current behavior:

- Mostly presentational
- Receives props from feature pages
- Minimal side effects

Recommendation:

- Keep components prop-driven
- Limit them to rendering, local UI interaction, and small formatting behavior
- Avoid direct service imports in presentational layers

### `src/lib`

Low-level shared utilities and configuration.

Current files:

- [api.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/api.js)
- [constants.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/constants.js)
- [supabaseClient.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/supabaseClient.js)

Current responsibility:

- HTTP request helper
- Shared option lists and statuses
- Supabase client creation

Recommendation:

- Keep `lib` framework-agnostic where possible
- Add input/output mappers or validators here only if reused broadly

### `src/services`

Backend-facing integration layer.

Current files:

- [aiService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/aiService.js)
- [brandService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/brandService.js)
- [contentService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/contentService.js)

Current behavior:

- Service functions exist for Supabase persistence and AI generation
- These functions are largely not used by the live routes yet

Recommendation:

- Treat `services` as the only place that knows about transport details
- Keep UI layers unaware of Supabase query syntax or raw endpoint paths

## Existing Route Architecture

### Dashboard Route

Entry point:

- index route in [router.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/app/router.jsx)

Rendered screen:

- [DashboardPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/dashboard/DashboardPage.jsx)

Current state:

- Metrics, suggestions, and recent drafts are derived from saved content post records
- Filtering is driven by URL search params shared with the top bar

Gap:

- It has no data source boundary yet

Recommendation:

- Fetch aggregated content and status data through a dedicated feature-level container
- Keep aggregation and filtering logic outside the presentational stat cards

### Brand Route

Entry point:

- `/brand`

Current container:

- [BrandProfilePage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/brand/BrandProfilePage.jsx)

Presentation:

- [BrandProfileForm.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/brand/BrandProfileForm.jsx)

Current state:

- Uses a normalized frontend `BrandProfile` shape
- Loads on page entry and saves through the service layer
- Falls back to local storage when Supabase is unavailable

Integration target:

- Load and save via [brandService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/brandService.js)
- Keep DB-row mapping isolated from the form contract through `src/lib/brandProfile.js`

### Content Creation Route

Entry point:

- `/create`

Current container:

- [CreateContentPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/content/CreateContentPage.jsx)

Presentation:

- [ContentForm.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/content/ContentForm.jsx)
- [GeneratedOutput.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/content/GeneratedOutput.jsx)

Current state:

- Uses a normalized `ContentDraftInput` contract for planning inputs
- Routes generation and rewrite actions through `aiService.js` with mock fallback when the API is unavailable
- Supports editable structured output and save-draft flow through `contentService.js`

Integration target:

- Generate via [aiService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/aiService.js)
- Persist drafts via [contentService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/contentService.js)
- Respect the request/response contract documented in [Generate_Content_API_Contract.md](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/docs/Generate_Content_API_Contract.md)

### Calendar Route

Entry point:

- `/calendar`

Current container:

- [CalendarPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/calendar/CalendarPage.jsx)

Presentation:

- [CalendarBoard.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/calendar/CalendarBoard.jsx)

Current state:

- Reads saved content post records through a shared feature hook
- Groups posts by scheduled date with inline status and schedule updates

Integration target:

- Fetch posts via [contentService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/contentService.js)
- Group by date and status in the feature layer

## Current Data Boundaries

### Frontend State

Today, most app behavior is controlled by local `useState` in route-level components. This is good for prototyping, but it means:

- state is lost on refresh
- no cross-screen consistency exists
- UI contracts are implicit rather than enforced

Week 1 adjustment:

- Mock records are now centralized in [mockData.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/mockData.js)
- Shared option lists are centralized in [constants.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/constants.js)
- Reusable empty, loading, and error states live under `src/components/ui/`

### Supabase Boundary

[supabaseClient.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/supabaseClient.js) creates a client directly from Vite env variables.

Implications:

- frontend can talk directly to Supabase tables
- schema mismatches will surface at runtime
- missing env values can cause client initialization issues once service calls are used

Recommendation:

- keep direct Supabase access limited to service functions
- add lightweight runtime guards around required env variables
- centralize record mapping so UI does not depend on raw table shapes

### AI/API Boundary

[api.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/api.js) posts to `${VITE_API_BASE_URL}/generate-content`.

Implications:

- the frontend expects a separate backend or API service
- that backend is not present in this repo yet
- request mode can be `generate` or `rewrite`
- response shape is normalized by the service layer

Recommendation:

- define a stable request/response contract before wiring the UI
- validate response payloads before storing them in component state
- keep retry logic in the service layer so feature components stay focused on UI state

## Recommended Near-Term Architecture

### Data Flow Pattern

Use this flow consistently:

1. Feature page collects input
2. Feature page calls service function
3. Service function talks to Supabase or API
4. Service response is normalized
5. Feature page updates UI state
6. Presentational component renders props

This keeps async logic out of low-level components and avoids transport leakage.

### Suggested Feature Contracts

These contracts are the current frontend source of truth for Week 1 and should stay aligned with [mockData.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/mockData.js), [constants.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/constants.js), and the route-level feature components.

`BrandProfile`

- `brand_name`
- `mission`
- `target_audience`
- `tone_rules`
- `preferred_ctas`
- `banned_phrases`

`BrandProfileRecord`

- `id` optional on read
- `brand_name`
- `target_audience`
- `mission`
- `tone_rules`
- `preferred_ctas`
- `banned_phrases`
- `created_at` optional on read
- `updated_at` optional on read

`ContentDraftInput`

- `topic`
- `platform`
- `contentType`
- `pillar`
- `goal`
- `tone`
- `context`

`GeneratedContent`

- `hook`
- `caption`
- `cta`
- `hashtags`
- `visual`

`ContentPost`

- `platform`
- `contentType`
- `pillar`
- `goal`
- `tone`
- `topic`
- `context`
- `status`
- `hook`
- `body`
- `cta`
- `hashtags`
- `visualDirection`
- `id` optional on read
- `createdAt` optional on read
- `scheduled_for`

`ContentPostRecord`

- `id` optional on read
- `platform`
- `content_type`
- `pillar`
- `goal`
- `tone`
- `topic`
- `context`
- `status`
- `hook`
- `body`
- `cta`
- `hashtags`
- `visual_direction`
- `created_at` optional on read
- `scheduled_for` optional on read

## Missing Technical Pieces

- No backend endpoint implementation for AI generation
- No real data loading on route entry
- No centralized async state handling strategy
- No form validation layer
- No test suite yet
- No schema or migration files in this repo
- No explicit error boundary or route-level recovery pattern

## Risks

### Risk 1: Service Layer Drift

The repo already contains services that are not used by the UI. If UI state evolves separately, service contracts will drift and integration will become more expensive.

Mitigation:

- Wire real services into features early
- Define stable payload shapes before adding more screens

### Risk 2: Dashboard Placement

The dashboard is now in `features/`, but dashboard data is still mock-backed and could drift from future persisted content records.

Mitigation:

- Keep mock dashboard summaries derived from one shared data source until real fetching replaces them

### Risk 3: Backend Assumptions

The frontend assumes a `/generate-content` endpoint exists, but there is no server implementation here.

Mitigation:

- Decide whether AI generation lives in a separate backend repo, Supabase Edge Function, or a new local server in this repo

## Recommended Next Refactors

- Add `src/features/dashboard/` and move dashboard orchestration there
- Introduce feature-level hooks for brand, content, and calendar state
- Add data mappers between DB rows and UI models
- Replace mock data with a toggleable mock adapter or real service-backed loader

## Decision Log Starters

Open decisions that should be documented as implementation begins:

- Where AI generation will run
- Whether Supabase is the source of truth for all content records
- Whether route loaders or feature hooks will own data fetching
- Whether local mock mode should remain available after backend integration
