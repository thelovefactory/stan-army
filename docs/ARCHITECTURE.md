# Architecture

## Current: local prototype

Next.js App Router + TypeScript + Tailwind CSS v4. Shared styling in the global stylesheet provides the visual system. Server route components select typed fixture data; interactive components use in-memory React state. `/`, `/discover`, `/army/[handle]`, `/create` are the public routes. Unknown handles return a 404. A production build prerenders the known rooms; no custom backend routes exist.

`lib/artists.ts` is the typed fixture boundary. `lib/demo.mjs` contains pure filtering and provider/handle checks shared with Node tests. The wizard does not call the network. Selected images use revocable object URLs. User text is rendered as text, never HTML. Chat input is trimmed, empty messages disabled and length limited to 500 characters. These UI limits do not substitute for server enforcement later.

Photography ships locally. The only embedded external content is Spotify's official iframe, loaded only on request. Until then there is no provider connection. A direct provider URL always remains available. Third-party playback restrictions and failures remain outside Stan Army's control. There is no scraping, unlicensed music hosting or synchronization. No data is persisted or collected by Stan Army in this prototype.

## Proposed after approval — not implemented

Supabase is the preferred candidate for Postgres, Auth, Storage and Realtime; selection remains subject to measured cost/capacity and authorization requirements. Use server-side validation, transactions and row-level security as the authority, not client state. Auth identities link to one internal user; verified linking flow only, never automatic merge by unverified email. Fan identity remains consistent across providers.

Read/public page data can be cached; role-sensitive page edits, enlistments and roster changes require authenticated server operations and RLS. Media uploads need size/MIME/signature checks, restricted buckets, image decode/re-encode, quotas and removal policy. Never use client-supplied roles or storage paths as authority. Artist-owned provider links need server allowlists, provider-specific parsing, safe redirects and fallback cards; no arbitrary iframe HTML or server-side fetch to unvalidated hosts.

Persistent chat should write authorized messages to Postgres and broadcast via private artist channels with reconnect/cursor recovery. Persist moderation state, reports and audit events; rate-limit writes at a shared server boundary. Start with Supabase Realtime load tests; at higher room concurrency, partition message retention/indexes and evaluate a managed chat provider. Document actual concurrent subscribers, throughput, message retention and egress before choosing the scaling threshold.

## Dependencies and cost decisions

Current runtime costs: no paid infrastructure provisioned; local compute only. Next.js, React, Tailwind and Lucide are open-source dependencies. Package lock records installed versions. Unsplash photography is under the Unsplash license; attribution/source notes are retained. Spotify is a third-party dependency with variable regional/account playback access, not a platform streaming API.

Future provider prices and limits have **not** been verified or contracted. Before M2 selection, record dated Supabase quotes/plan limits for MAU, storage, egress, DB and realtime, hosting runtime/egress, transactional email, moderation and backups. Before M5, record Stripe fees and supported billing countries. Do not present an unverified free tier as a production cost guarantee. No paid services, production deployment, live users or charges without explicit approval.

## Operational work after approval

Versioned migrations and seed data, separate development/staging/production, no committed secrets, backups and restore checks, logging without sensitive content, role-policy integration tests, abuse controls, privacy retention/export/delete and copyright takedown process. Monitor actual enlistments, posts, reactions, chat writes and permitted embed interactions only.
