# STAN ARMY™ — Codex Master Build Brief

**Website:** stan.army  
**Core promise:** Every artist needs an army.  
**Emotional proposition:** The heartbeat of every artist is their community.

## Your assignment
Act as the founding engineering team. Plan and incrementally build a real, secure, music-first fan community web application. Do not deliver a static mockup pretending to be functional. Begin by inspecting the repository; if empty, scaffold it. First deliver a visually reviewable prototype and a realistic implementation plan, not the whole product in one pass.

## Product vision
Artists create their own Army pages. Fans discover artists, enlist, listen through legitimate music/video embeds, talk in real time, interact with artist content, and eventually vote on tracks and videos in a Battleground. The feel is early Myspace personality + IRC/Twitch community energy + contemporary usability. Artist-to-fan and fan-to-fan interaction are equally important.

## Visual direction
- Nearly black backgrounds, white typography, vibrant electric blue, turquoise/mint, magenta and orange gradients.
- Preserve the supplied hand-drawn Stan Army logo; do not replace it with a generated logo.
- Bold typography, large artist imagery, expressive asymmetric rounded cards and deliberately playful details.
- No generic SaaS dashboards, excessive glassmorphism or placeholder AI artwork.
- Desktop-first shared listening/social experience, fully usable on mobile.
- Use supplied screenshots as visual references, not pixel-perfect mandates; maintain accessibility, keyboard support and reduced-motion behavior.

## User roles and permissions
**Fan:** social or passwordless sign-in, handle/avatar, discover artists, enlist in multiple Armies, chat, access entitled content, edit profile, export/delete data.

**Artist:** create/edit an artist page; upload banner/avatar; add biography, genre and links; publish posts and exclusives; pin chat announcements; moderate their own room; view engagement metrics.

**Manager/Label:** one login managing multiple artists through explicit invitations and role-based permissions; roster dashboard; artist-level edit permissions; later aggregate analytics and batch publishing.

**Admin:** moderation, reports, discovery curation, account and subscription administration; audit privileged actions.

Enforce permissions on the server and in database policies, never only in the UI.

## Authentication
- One internal Stan Army user ID independent of social providers.
- Passwordless email login, Google and Apple where available; evaluate Spotify and Discord login later based on actual provider support.
- Secure account linking/unlinking; never auto-merge accounts based solely on unverified email.
- Minimal scopes, clear privacy choices, secure sessions.
- Use a mature auth service, preferably Supabase Auth if suitable.

## Core pages
1. **Landing:** “Every artist needs an army.” Supporting line about the heartbeat of an artist being their community. CTAs: “Create Your Army” and “Find Your Artist.”
2. **Discovery:** New Artists, Most Stanned, Our Favourites (editorial, never paid placement), search and filters.
3. **Artist page:** artist banner/avatar, handle, bio, verified badge only when genuinely verified, enlisted count, STAN and ENLIST OTHERS actions, music/video embeds, central realtime ARMY CHAT, pinned artist message, posts/exclusives, events, merch and social links.
4. **Create Your Army wizard:** name/handle, images/bio, link entry, preview and publish; editable afterwards.
5. **Fan profile:** identity, enlisted artists, settings and notifications.
6. **Artist dashboard:** page/content editor, chat moderation, engagement overview.
7. **Manager dashboard:** roster, artist switcher, team permissions, per-artist reporting.
8. **Admin console:** moderation and editorial tools, restricted to admins.

## Artist links and content
Support validated links for Spotify artist/album/track/playlist; YouTube channel/video/playlist; SoundCloud; Apple Music; Bandcamp; Instagram; TikTok; artist website; Shopify/merch; Eventbrite/DICE/ticketing; press kit. Use approved APIs/oEmbed when available, with graceful link-card fallback. Never scrape private data or claim all providers support identical embeds. Artists can create public and enlisted-only posts, announcements and approved media uploads.

## The listening room / chat
- On desktop, the room should feel like the heart of the experience; offer a wider focused room mode where chat and music/video coexist.
- One persistent chatroom per artist; real messages, timestamps, reactions, pinned artist announcements, message reporting, moderator mute/delete/ban and rate limiting.
- Use an established realtime infrastructure (Supabase Realtime or managed chat provider), with a documented scaling path.
- Treat fan identity and moderation consistently regardless of login method.
- Do not pretend multiple Spotify or YouTube embeds are synchronized across users; obey provider policies and playback restrictions.

## Battleground — phase 2
- Artist creates polls from approved catalogue links; fans vote on next track/video; live results and anti-duplicate voting.
- Voting is a premium artist-plan feature, but fan participation should remain simple and free unless explicitly changed.
- Poll results may select the next displayed link/embedded item. Automatic cross-user playback only if genuinely permitted and supported.
- Later: badges, Superstan leaderboards, events and fan challenges.

## Business model and analytics
- Provisional artist subscriptions: Pro $19/month and Elite $59/month, editable in configuration pending final confirmation.
- One-month standard trial; three-month promotional trial for selected founding artists/label pilots.
- Fans enlist free. External merch/ticket sales link out without a platform commission in the initial model.
- Stripe billing only in a later approved phase; do not activate live charges now.
- Simple cancellation, account closure and a clearly defined configurable refund policy.
- Show actual measurable stats: enlistments, posts, reactions, chat activity and permitted embed interactions. Do not invent streaming counts or claim Spotify royalties from embeds.

## Technology preference
- Next.js App Router, TypeScript, Tailwind CSS.
- Supabase Postgres, Auth, Storage and Realtime if appropriate.
- Server-side authorization, row-level security, schema migrations and seed data.
- Componentized, maintainable architecture; environment-variable template with no secrets committed.
- Tests for auth, authorization, enlistment, permissions, chat moderation and billing entitlements.
- Responsive, accessible UI with loading/empty/error states.

## Security, compliance and operations
- Input validation, XSS prevention, file-upload restrictions, spam/rate limits, abuse reporting, GDPR-conscious data retention/export/deletion and copyright takedown process.
- No unlicensed music hosting, unauthorized streaming or unsupported API claims.
- No production deployment, paid services, real payments or live user data without explicit approval.
- Record infrastructure costs and API dependencies before selecting services.

## Delivery plan
**Milestone 1 — Foundation and visual prototype:** inspect repo, create docs, scaffold project, build polished landing, discovery, artist page and creation wizard with clearly labeled demo data. Provide local run instructions and screenshots if practical.

**Milestone 2 — Accounts and pages:** real auth, fan/artist/manager roles, page persistence, link validation, roster permissions and enlistment.

**Milestone 3 — Community:** realtime chat, pinned messages, moderation, posts and enlisted-only visibility.

**Milestone 4 — Discovery and reporting:** search, editorial picks, truthful analytics, mobile refinement and reliability testing.

**Milestone 5 — Battleground and subscriptions:** polls, tier entitlements, Stripe test-mode billing and cancellation flows after approval.

## Your FIRST task — do this now
1. Inspect the existing repository and identify anything reusable; do not overwrite existing work without explaining it.
2. Create `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/DATABASE_SCHEMA.md` and `docs/ROADMAP.md`, separating confirmed features from assumptions.
3. Scaffold the application if necessary.
4. Build a visually polished **demo artist page** with music player, prominent Army chat layout, enlistment counter, artist posts and responsive behavior. Use seeded demo content clearly labeled as demo; do not claim the chat or streaming is live unless implemented.
5. Add landing and discovery page shells with consistent design.
6. Run lint/typecheck/tests available, fix issues, and report exact commands and results.
7. Explain what works, what is mocked, any third-party API limitations, and the single best next engineering milestone.
8. Stop for visual review before implementing the complex backend or subscriptions.

**Success definition:** A working local prototype that looks and feels like Stan Army, plus a clear roadmap toward a real product where an artist can create a page, fans can enlist and chat, and a manager can oversee multiple artists.
