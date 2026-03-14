# Change180 Content Studio Sprint Board

## Planning Horizon

This sprint board assumes a 6-week MVP timeline and is tied to the current codebase structure in `src/`.

## Current Baseline

- Routing exists for dashboard, brand, content creation, and calendar
- Shared layout and UI primitives exist
- Feature pages currently use local component state
- Supabase and API service files exist but are not wired into the live UI
- Local development, lint, and build are already working

## Week 1: Foundation and Cleanup

### Goal

Stabilize architecture boundaries and remove ambiguity before adding persistence or AI integration.

### In Scope

- [x] Audit placeholder logic in route-level pages
- [x] Remove or document dead starter files and unused patterns
- [x] Standardize status constants and shared option lists
- [x] Define feature ownership between `features`, `components`, `services`, and `lib`
- [x] Add shared empty, loading, and error states
- [x] Document data contracts for brand profile and content draft objects
- [x] Confirm env requirements and local setup docs

### Code Areas

- [main.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/main.jsx)
- [router.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/app/router.jsx)
- [constants.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/constants.js)
- [AppShell.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/layout/AppShell.jsx)
- [README.md](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/README.md)
- [mockData.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/mockData.js)
- [Technical_Architecture.md](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/docs/Technical_Architecture.md)

### Exit Criteria

- Shared app vocabulary is defined
- Route and module ownership are clear
- No unresolved local-dev setup questions remain

### Week 1 Status

Completed:

- Dashboard route ownership moved into `src/features/dashboard/`
- Shared mock contracts centralized in `src/lib/mockData.js`
- Shared empty, loading, and error states added under `src/components/ui/`
- Env and service guards now fail gracefully in local mock mode
- Technical architecture and setup docs updated to reflect current boundaries

Notes:

- Legacy starter asset files in `src/assets/` are no longer used by the app and can be removed in a follow-up cleanup commit if desired

## Week 2: Brand Settings and Persistence

### Goal

Make Brand Settings a real data workflow instead of a local-only form.

### In Scope

- [ ] Define the `brand_profiles` frontend shape
- [ ] Replace local-only save behavior with service-backed persistence
- [ ] Add load-on-page-entry behavior for saved brand data
- [ ] Add validation for required voice fields
- [ ] Add save success and error states
- [ ] Add fallback mock mode if backend is unavailable

### Code Areas

- [BrandProfilePage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/brand/BrandProfilePage.jsx)
- [BrandProfileForm.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/brand/BrandProfileForm.jsx)
- [brandService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/brandService.js)
- [supabaseClient.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/supabaseClient.js)

### Exit Criteria

- Brand profile can be loaded and saved
- Errors are visible and recoverable
- Form state structure matches the intended DB contract

## Week 3: Content Creation Core

### Goal

Turn the content creation screen into a structured draft workflow with reusable data models.

### In Scope

- [ ] Define `content_posts` frontend payload shape
- [ ] Split generated output into structured sections that match persisted fields
- [ ] Add save-draft capability from the content creation screen
- [ ] Add form validation and disabled states
- [ ] Add content type and platform switching rules
- [ ] Move static generation stub behind a clear adapter layer

### Code Areas

- [CreateContentPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/content/CreateContentPage.jsx)
- [ContentForm.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/content/ContentForm.jsx)
- [GeneratedOutput.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/content/GeneratedOutput.jsx)
- [contentService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/contentService.js)
- [constants.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/constants.js)

### Exit Criteria

- User can create a structured draft
- Draft data is saveable
- Content form and output panel share a stable contract

## Week 4: Dashboard and Calendar Workflow

### Goal

Connect draft content to a visible planning workflow.

### In Scope

- [ ] Replace mock dashboard numbers with computed or fetched data
- [ ] Replace mock calendar cards with real post records
- [ ] Add post status transitions
- [ ] Add filtering by platform, pillar, and status
- [ ] Add weekly planning view or grouped calendar section
- [ ] Add empty states for no-content scenarios

### Code Areas

- [DashboardPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/dashboard/DashboardPage.jsx)
- [CalendarPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/calendar/CalendarPage.jsx)
- [CalendarBoard.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/calendar/CalendarBoard.jsx)
- [Topbar.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/components/layout/Topbar.jsx)
- [contentService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/contentService.js)

### Exit Criteria

- Content appears in dashboard and calendar views
- Status progression is visible
- Filtering supports practical weekly planning

## Week 5: AI Generation Integration

### Goal

Replace the local generation stub with a real generation path that respects brand voice.

### In Scope

- [ ] Define request/response contract for generation
- [ ] Create backend endpoint contract for `/generate-content`
- [ ] Wire `generateContent()` into the content flow
- [ ] Inject brand profile context into generation requests
- [ ] Add loading, retry, and failure handling
- [ ] Add rewrite/tone actions on generated content

### Code Areas

- [CreateContentPage.jsx](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/features/content/CreateContentPage.jsx)
- [aiService.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/services/aiService.js)
- [api.js](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/src/lib/api.js)
- backend endpoint not yet present in this repo

### Exit Criteria

- Live generation works against a real endpoint
- Generated fields map cleanly into persisted drafts
- Failure states do not break the editor flow

## Week 6: Polish, QA, and Launch Readiness

### Goal

Make the MVP coherent, testable, and usable for weekly content operations.

### In Scope

- [ ] Add analytics notes page or section
- [ ] Add responsive QA across primary routes
- [ ] Add onboarding copy and helper text
- [ ] Add smoke tests for routing and core flows
- [ ] Add seed/demo content for first-run experience
- [ ] Finalize docs for local dev, architecture, and workflow

### Code Areas

- [Flow_Plan.md](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/docs/Flow_Plan.md)
- [README.md](/Users/joelguzman/Vibe-Code/change180-content-studio/change180-content-studio/README.md)
- future test files
- current route-level features in `src/features`

### Exit Criteria

- New user can navigate the product without explanation
- Core flows behave predictably on desktop and mobile
- Docs and environment setup are complete enough for handoff

## Backlog After Week 6

- [ ] Team approvals
- [ ] Direct publishing integrations
- [ ] Performance-based AI recommendations
- [ ] Asset library uploads
- [ ] Canva/export workflow
- [ ] Advanced analytics dashboards

## Suggested Cadence

- Monday: plan and scope lock
- Tuesday to Thursday: implementation
- Friday: QA, docs, cleanup, and demo

## Weekly Artifacts

- Sprint notes
- Updated checklist status
- Demo-ready branch or pushed commits
- Known risks and carryover items
