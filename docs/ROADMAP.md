# Roadmap and review gates

## Milestone 1 — current visual prototype
Confirmed scope: responsive landing, working seeded discovery, demo artist spaces, focused listening room, local enlistment/chat/reactions, click-to-load media with fallback, creation wizard and documentation. No live community, backend storage or deployment. Addendum 01 browser-local theme persistence is included now, not deferred. Review screenshots/local views and the behaviour inventory before proceeding. See `VALIDATION.md` for actual checks and environment limits.

**Review gate:** approve or revise typography, colour, personal expression, chat prominence, mobile hierarchy and wizard preview. Backend work has not started.

## Milestone 2 — best next engineering milestone
Accounts, persistent artist pages, roles and enlistment. Prefer Supabase after a cost, region and provider review. Build passwordless identity, stable internal user IDs, explicit artist/manager invitations, safe image upload, provider-aware link validation and a real page editor. Replace demo data behind a typed data-access boundary. Enforce owner/editor/manager permissions server-side and with RLS. Add real enlistment with a unique user/artist constraint and safe concurrent toggling.

Exit criteria: a fan can sign in and enlist; an artist can persist and edit a page; an invited manager can edit only assigned artists; refreshing retains authorized data. Tests cover unauthenticated denial, cross-artist access denial, last-owner protection, duplicate/concurrent enlistment, account linking and storage policies. Record actual service cost assumptions before creating infrastructure. Stop for review if security or service setup changes scope.

## Milestone 3 — community
Persistent chat history and managed realtime delivery, pinned messages, report/mute/delete/ban, spam/rate limits, public/enlisted-only posts and reactions. Real timestamps, moderation audit events and permission tests. Load test expected concurrency. No fake online presence or synchronized playback claims.

## Milestone 4 — discovery and reporting
Database search, editorial curation, truthful measured metrics, manager reporting, export/deletion workflows, mobile usability testing, WCAG audit, privacy/copyright operations and reliability monitoring. Engagement counts measure platform activity; do not imply streams or royalties from embeds.

## Milestone 5 — Battleground and subscriptions
Only after approval: polls, one-vote rules, anti-abuse, premium artist entitlements, Stripe test-mode billing and cancellation. Review provisional $19/$59 pricing and trial/refund policy. Validate webhooks/idempotency and entitlement expiry. Live charges require separate explicit approval; participation by fans remains free unless product requirements change.

## Open product assumptions
Trial lengths and founding-artist promotions, room membership model, manager reporting scope, geographic rollout, moderation staffing, upload limits and retention. No assumption here authorizes a paid service or deployment.

## Addendum 01 is part of Milestone 1
Artist/fan visual customisation, all six presets, local theme persistence, raster/GIF selection, shared live editor, clean/custom viewing and animation controls are current prototype work. This is not a later milestone. The next backend milestone will add ownership enforcement, asset processing and database-backed theme records while keeping the same structured presentation boundary. Browser-based acceptance and visual review remain necessary before calling the milestone fully verified.
