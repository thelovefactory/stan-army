# Architecture

## Implemented now
Next.js App Router + TypeScript + Tailwind CSS v4 (PostCSS integration), with CSS design tokens and responsive component styles in `src/app/globals.css`. Lucide supplies interface icons; original supplied images and licensed stock photographs are local assets. No remote font or image request is needed for initial rendering.

App Router pages render the static shell and seeded artist records. Discovery, artist actions, chat, media consent and wizard use client components. `DemoProvider` wraps the app and holds session-in-memory enlistments and messages keyed by artist slug. No API route handlers, server actions, services, Supabase client, storage, credentials or external data fetch are implemented. Browser state changes do not persist.

## Source boundaries
- `src/lib/data.ts`: typed artist seed, discovery selection, fixed media example, wizard validation.
- `src/components/shell.tsx`: navigation, mobile menu, footer and demo labels.
- `artist-card.tsx`, `discovery.tsx`: reusable discovery surfaces.
- `artist-space.tsx`, `music-panel.tsx`, `army-chat.tsx`: artist room and reusable media/chat panels.
- `army-wizard.tsx`: four-stage controlled form and preview.
- `tests/demo-logic.test.ts`: meaningful filtering and validation checks using the Node test runner through tsx.

Dynamic artist routes use `generateStaticParams` for all six seed slugs; unknown artists render the custom 404. Shared provider state follows client-side navigation, while page-local state unmounts normally. No runtime secret is required. Root metadata discourages search indexing for this prototype; that is not access control.

## Accessibility design
Semantic page landmarks, skip link, labeled controls, native links/buttons/radios/selects, visible focus styles, pressed state on toggles, polite status messages, alert validation errors and keyboard-focusable mobile navigation. Wizard stage changes focus the stage heading. Reduced-motion CSS removes transitions and smooth scrolling. Input limits and wrapping protect conversation and preview layouts. See validation report for what was actually checked; these implementation provisions are not a claim of a completed accessibility audit.

## Future Supabase boundary — proposed, not implemented
Use Supabase Postgres/Auth/Storage/Realtime if review confirms fit and costs. Server-rendered/session-aware reads and authenticated server mutations should sit behind a typed data-access layer. Never replace demo provider methods with unauthenticated direct writes.

Auth must map multiple provider identities onto one internal user ID. Passwordless email is the initial candidate; Google/Apple require provider setup. Link accounts only with verified ownership, never an unverified email match. Enforce roles on the server and with RLS, including manager access scoped to explicit artist invitations. Never expose service-role credentials to the browser.

Artist/public discovery reads may be anonymous; page edits require explicit owner/editor authorization. Enlistment mutations need authenticated fan identity, uniqueness and idempotency. Storage needs private upload processing, MIME/signature/size limits, safe image transformation and copyright handling. Artist media links need provider-specific allowlists; unknown safe links should remain link cards instead of arbitrary embeds.

Chat will need persistent per-artist rooms, server-authorized membership, paginated history, rate limits, report/mute/delete/ban actions and an audit trail before realtime delivery. Realtime is delivery infrastructure, not authorization. Slow mode and retention are open decisions. Scale by paginated history, indexed room/time queries and bounded presence; reassess managed chat if expected concurrency exceeds measured Supabase limits.

## Dependencies, costs and decisions before selection
Current application is local and requires no paid account. Node/npm and the installed packages run locally. YouTube is optional external playback with provider restrictions and privacy effects. Unsplash photos are downloaded locally under their license, with provenance in `ASSET_SOURCES.md`.

Future Supabase and Stripe plans are unselected. Record then-current database/storage/egress/MAU/realtime quotas and regional hosting cost before provisioning. Stripe fees and email-provider costs also need explicit review. Environment variable names, secrets and service configuration will be introduced only in the approved backend milestone; `.env.example` currently documents that none are needed.

## Validation
Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Browser review should exercise all routes at desktop/mobile widths and both keyboard/reduced-motion settings, then verify the consented embed separately with network access. No claim of live playback availability follows from a successful local build.
