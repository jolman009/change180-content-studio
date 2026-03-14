# Change180 Content Studio

## Product Goal

Build a content operating system for Change180 that turns one coaching insight into multiple polished social assets, keeps messaging aligned with the brand voice, and gives the team a simple workflow to draft, review, organize, and schedule content.

## Core Outcome

One coaching insight in, multiple usable social assets out.

## Primary Users

- Primary: Change180 brand owner
- Secondary: future assistant, VA, editor, or marketing support

## Product Principles

- Keep the MVP narrow and useful
- Optimize for repeatable weekly content production
- Protect brand tone before adding automation depth
- Use AI to accelerate drafting, not replace editorial judgment
- Ship workflow value before complex integrations

## MVP Scope

### Must Have

- Brand profile and voice guardrails
- Content idea generation by pillar and platform
- Content editor with rewrite and variation tools
- Simple calendar and post status workflow
- Manual analytics notes

### Should Wait

- Native social publishing
- Full analytics ingestion
- Team approval workflow
- Canva/export pipeline
- AI learning from performance history

## Content Pillars

- Mindset shifts
- Personal growth
- Healing and clarity
- Coaching invitations
- Hope and transformation
- Practical action

These pillars should exist as structured tags throughout the app so generated content stays constrained and useful.

## Core Screens

### 1. Dashboard

Shows:

- Draft count
- Approved count
- Scheduled count
- Upcoming posts
- Suggested next posts
- Content gaps by pillar

### 2. Idea Lab

Used to:

- Generate post ideas
- Brainstorm hooks
- Create campaign concepts
- Generate pillar-based weekly content prompts

### 3. Content Editor

Used to:

- Draft content
- Rewrite for tone
- Switch platform format
- Regenerate hooks, CTA, and captions
- Produce content variants

### 4. Calendar

Used to:

- Assign dates
- View posts by week or month
- Track status
- Group content by campaign or pillar

### 5. Brand Settings

Stores:

- Brand name
- Mission
- Target audience
- Tone rules
- Banned phrases
- Preferred CTAs
- Platform rules
- Offer positioning notes

### 6. Analytics Notes

Used to:

- Log what was posted
- Record simple performance notes
- Track themes and hooks that worked

## Priority Workflows

### Workflow A: Create From Scratch

Input:

- Topic
- Platform
- Goal
- Tone
- Pillar

Output:

- Hook options
- Caption or body copy
- CTA
- Hashtags
- Visual direction

### Workflow B: Repurpose Source Material

Input:

- Long-form note
- Sermon note
- Voice transcript
- Reflection draft

Output:

- Caption
- Carousel outline
- Reel script
- Quote cards

### Workflow C: Weekly Planning

Input:

- Weekly theme
- Platform mix
- Pillar targets

Output:

- Seven-post draft plan
- Balanced pillar coverage
- Draft calendar view

### Workflow D: Brand Correction

Input:

- Raw or off-brand draft

Output:

- Rewritten draft in Change180 voice
- Stronger or softer tone version
- Clearer CTA
- Reduced generic language

## Recommended Build Direction

For this repo, the practical implementation path is:

- Frontend: React + Vite + React Router + Tailwind CSS v4
- Backend: Supabase + lightweight server/API layer when generation is wired up
- Storage: Supabase Storage for assets later
- AI: OpenAI API for generation, rewriting, summarization, and tone enforcement

## Suggested Data Model

### Core Tables

- `users`
- `brand_profiles`
- `content_ideas`
- `content_posts`
- `campaigns`
- `assets`
- `performance_logs`
- `prompts`

### Key Fields to Preserve

`brand_profiles`

- `brand_name`
- `mission`
- `tone_rules`
- `banned_phrases`
- `preferred_ctas`
- `target_audience`
- `content_pillars`
- `platform_rules`

`content_posts`

- `platform`
- `content_type`
- `hook`
- `body`
- `cta`
- `hashtags`
- `visual_direction`
- `status`
- `scheduled_for`
- `posted_at`

## Phase Timeline

Assumption: 6-week implementation timeline for a polished MVP with local dev, core flows, and basic production readiness.

### Phase 0: Foundation

Timeline: Week 1

Goal:

Stabilize the repo, environment, routing, styling, and shared application structure.

### Phase 1: Brand and Content Core

Timeline: Week 2

Goal:

Ship the brand settings flow and a real content creation flow backed by structured form data.

### Phase 2: Workflow and Organization

Timeline: Weeks 3-4

Goal:

Add content state management, calendar planning, and reusable workflow actions.

### Phase 3: AI and Prompt Discipline

Timeline: Week 5

Goal:

Wire real generation and rewriting flows with prompt templates and brand guardrails.

### Phase 4: Polish and Launch Readiness

Timeline: Week 6

Goal:

Harden the UX, validate edge cases, and prepare the app for real use.

## TODO Checklist By Phase

## Phase 0: Foundation

- [ ] Audit current routes, components, and services for dead code and placeholder logic
- [ ] Confirm environment variable strategy: `.env`, `.env.example`, and required keys
- [ ] Standardize project structure across `app`, `features`, `components`, `lib`, and `services`
- [ ] Validate Tailwind usage, theme tokens, and global layout primitives
- [ ] Add shared app shell states: loading, empty, and error
- [ ] Define canonical status values: `draft`, `approved`, `scheduled`, `posted`
- [ ] Create base mock data strategy for local development
- [ ] Update docs for setup, architecture, and local workflow

Deliverables:

- Stable local development environment
- Clean routing and component ownership
- Shared UI/state conventions

Exit criteria:

- App boots locally without manual fixes
- Lint/build/dev pass consistently
- Core navigation structure is stable

## Phase 1: Brand and Content Core

- [ ] Build brand profile form with persistent state
- [ ] Define schema for tone rules, banned phrases, CTAs, and pillars
- [ ] Connect Brand Settings UI to storage or a temporary persistence layer
- [ ] Build Idea Lab form for topic, platform, goal, pillar, and tone
- [ ] Build Content Editor sections for hook, body, CTA, hashtags, and visual direction
- [ ] Add content type support for caption, carousel outline, reel script, quote post, and reflection
- [ ] Add platform switching logic for Instagram, Facebook, LinkedIn, and X
- [ ] Create reusable UI actions for rewrite, regenerate, shorten, and strengthen

Deliverables:

- Working brand configuration flow
- Working draft generation/editing interface
- Structured content records

Exit criteria:

- User can save brand preferences
- User can create and edit a draft from a structured input form
- Draft content can be tagged by pillar, platform, and content type

## Phase 2: Workflow and Organization

- [ ] Introduce `content_ideas` and `content_posts` data models
- [ ] Build Dashboard metrics for drafts, approvals, scheduled posts, and gaps
- [ ] Build Calendar view with week/month grouping
- [ ] Add post status transitions across draft, approved, scheduled, and posted
- [ ] Add campaign tagging and filtering
- [ ] Add search and filter controls in the top bar
- [ ] Add content duplication and repurposing actions
- [ ] Add weekly planning flow that generates a seven-post working set

Deliverables:

- Content pipeline tracking
- Calendar planning workflow
- Repurposing and organizational controls

Exit criteria:

- User can move content through a visible pipeline
- User can assign dates and browse content by time period
- User can filter content by pillar, platform, campaign, and status

## Phase 3: AI and Prompt Discipline

- [ ] Define prompt templates for create, repurpose, rewrite, weekly plan, and offer promotion
- [ ] Add server/API endpoint for generation requests
- [ ] Inject brand profile context into prompt assembly
- [ ] Add response shaping for hooks, caption, CTA, hashtags, and visual suggestion
- [ ] Add retry and error handling for failed generations
- [ ] Add tone-control options: softer, stronger, clearer, shorter, more direct
- [ ] Add brand safety checks for banned phrases and off-tone wording
- [ ] Save prompt versions for iteration and testing

Deliverables:

- Real AI generation path
- Prompt library with versioning
- Brand-aware generation controls

Exit criteria:

- User can generate content from live AI calls
- Outputs reflect brand voice settings
- Errors are recoverable and visible in the UI

## Phase 4: Polish and Launch Readiness

- [ ] Add analytics notes form for manual post-performance logging
- [ ] Add asset library stub for logos, templates, and reusable media references
- [ ] Improve empty states, helper copy, and onboarding guidance
- [ ] Add form validation and guardrails across key workflows
- [ ] Add responsive QA for desktop and mobile breakpoints
- [ ] Add smoke tests for navigation and critical flows
- [ ] Add seed data or first-run demo content
- [ ] Review copy for consistency with Change180 voice

Deliverables:

- Production-ready MVP workflow
- Basic usage guidance
- Testable critical paths

Exit criteria:

- New user can understand the product without explanation
- Core flows work on desktop and mobile
- App is ready for limited real usage

## Post-MVP Backlog

- [ ] Platform-specific previews
- [ ] Saved prompt presets
- [ ] Team approval workflow
- [ ] Voice memo to post flow
- [ ] Direct publishing integrations
- [ ] Imported analytics
- [ ] AI recommendations based on performance history
- [ ] Canva/export workflow

## Implementation Notes

### What To Build First

1. Brand Settings
2. Content Editor
3. Calendar and status workflow
4. AI generation endpoint
5. Analytics notes and polish

### What Not To Overbuild Early

- Native scheduling integrations
- Full role-based permissions
- Complex analytics dashboards
- Multi-user collaboration logic

### Success Definition

The MVP is successful if Change180 can use it every week to:

- define brand voice once
- generate content faster
- repurpose one idea into multiple posts
- organize drafts by status and date
- maintain more consistent messaging
