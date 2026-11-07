# Architecture — fan accounts, artists and Armies

## Implemented application
Next.js App Router, TypeScript, Tailwind CSS v4 and scoped CSS design tokens. Lucide icons, original logo, local licensed photographs and original decorative assets. No backend client, API endpoints, server actions, auth, billing, secrets or deployment resources. `/create` and `/official-access` read query parameters through ordinary server-rendered pages; neither is a mutation endpoint.

`src/lib/data.ts` now separates:
- `User`: stable identity, personal handle/name/image.
- `Artist`: catalogue identity, artist reference, biography, genre and location.
- `Army`: stable community ID, unique slug, artist reference, historical founder, welcome and demo community metrics.
- `ArmyMembership`: user/Army community role.
- `ArtistRelationship`: portable user/artist relationship, artist vs representative kind, verification state.
- `ArmyView`: explicit joined `{army, artist, founder}` projection for reusable presentation.

Seed invariants are tested: one Army per artist, unique addresses, distinct founder/artist/Army IDs. Membership-based administration/moderation functions do not consult verified relationships; official publishing checks the artist relationship and scope instead. No monetary property is consulted for either. UI roles remain explicitly simulated and are not production authorization.

## Rendering and state
`ArmySpace` in the retained `artist-space.tsx` composes existing media/chat/post surfaces and the shared theme wrapper. New founder/identity hierarchy and `ArmyAnnouncements` expose community vs official contributions. Announcement composers are capability-separated; added posts stay page-local with their author type captured at posting. The original post-heart reaction is preserved.

`DemoProvider` keeps enlistments and submitted chat messages in memory, now keyed by stable Army ID rather than artist slug. They survive client navigation under the root provider, then clear on refresh. Fan profile enlistments join these IDs to Army views. Favourite artist presentation and community membership remain different concepts. Creation and official-request drafts are local component state, never backend writes.

The four-stage `ArmyWizard` searches catalogue identities, detects seeded canonical Armies, validates address/welcome/optional HTTPS music link, and makes a themed preview. It reuses `ThemePresetPicker` from the shared editor and `ProfileTheme`'s preview mode, rather than duplicating the theme engine. A completed preview does not create a public or session-routable Army. Copied invite text explicitly says preview-only and non-live. This is the existing M1 preview boundary, now fan-led.

## Routing
`armyPath` and `armyAddress` centralize local routes and intended public addresses. `/armies/[slug]` and `/armies/[slug]/room` render seeded communities. Legacy `/artists/[slug]` routes use the explicit legacy mapping and return permanent redirects; Nova maps `nova-reign` to `nova`. Unknown slugs return the existing 404.

Future wildcard-host routing must validate a configured base domain and exactly one permitted subdomain label, exclude reserved platform hosts, resolve the Army on the server and render the same route content. Host/proxy trust, wildcard DNS/TLS, cross-subdomain identity/cookie rules, canonical URLs and unknown-host behaviour require infrastructure review. No such infrastructure is provisioned now. Local fallback is the supported implementation. LocalStorage does not cross subdomain origins; future public themes must be database-backed.

## Theme compatibility
`ProfileTheme` now targets `army:<stableArmyId>` and accepts an explicit `artist:<legacySlug>` fallback. `profileThemeSnapshot` prefers the new key; if absent, it reads the corresponding legacy key. Reads never write/delete anything, and values are validated before use. Save writes the new key; old data stays untouched, even on failed saves. Reset writes an explicit default to the new key, so the old customised theme cannot reappear accidentally. Fan keys are unchanged.

The same theme schema, upload limits, six presets, contrast resolution, clean view and motion policies remain. Scope is the canvas; global navigation and role/editor controls sit outside it. The official role has no ability to open the Army theme editor unless a separate community grant is deliberately introduced later. See `THEME_ENGINE.md` for the exact contract.

## Future data/service boundary — proposed only
Supabase remains a candidate for Postgres/Auth/Storage/Realtime after region, quota and cost review. Separate repositories for users, catalogue artists, Armies, memberships and verified relationships should feed the joined display model. Authenticated server mutations and RLS must enforce both community grants and artist-specific official scopes. Never trust the role dropdown, JSON settings or submitted actor IDs.

Creation needs a unique artist/canonical-Army constraint and unique reserved-aware address constraint, enforced transactionally. Artist matching uses reviewed catalogue/provider identities, not names alone. New/ambiguous identities enter conflict review. Verification needs evidence handling, reviewer decisions, scope, expiry/revocation, sensitive-handle reservation and appeals. A payment cannot satisfy an identity or ownership check.

Future uploads require authenticated processing, content-type/signature/size restrictions, metadata handling, safe storage and copyright operations. Chat needs membership authorization, moderation/reporting, rate limits, pagination and delivery infrastructure. Official publishing needs an independently verified relationship, audit trail and rights-aware content rules. Realtime is not authorization.

Future financial domains stay separate: Army entitlements/subscriptions, contribution accounting, promotional campaigns, labelled inventory placements, budget ledger, refunds and reporting. Only agreed entitlements should influence premium features; none influence community ownership or artist identity. No fees, providers or infrastructure plans are selected in this change.

## Validation and operational limits
Commands: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Tests cover entities/permissions, canonical aliases, discovery/onboarding/request validation, theme safeguards and old-to-new key compatibility. Build output can verify rendered headings and redirect metadata. Actual browser desktop/mobile/keyboard/file-upload/playback journeys remain unverified in this environment; see `VALIDATION.md`.

## Living fan space implementation
`fan-space.ts` holds typed fictional note/reply, memory, member and video fixtures with original/stock provenance. `LivingFanSpace` handles controlled text/style composition and threaded reply controls. `MemoryVisual` renders allowlisted local photographs and original CSS/text print/keepsake designs. `FanMediaPreviews` leads to two Nova-only deeper experiences; `FanMediaPage` reuses the same Army theme wrapper. The gallery uses native dialog focus/Escape behaviour. Local MP4 studies are manually controlled through the shared Army Player, never autoplay, loop only with explicit Repeat, and pause when the existing motion preference switches off.

`DemoProvider` adds in-memory notes, replies, heart toggles and kept-memory IDs alongside unchanged enlistment/chat state. It is still a small React context, not a social backend. Text is validated for useful length and React-escaped; style choices are a fixed enum. Gallery query IDs resolve only to known memory fixtures, never user-provided remote asset URLs. Saved theme schema/storage keys and legacy fallback are unchanged. `ProfileTheme` exposes clean/motion settings to contributions and sets a clean-view data attribute for scoped CSS.

Only Nova gets this authored community composition; the original other fixtures remain compatible. `living.css` styles contribution content independently from core platform controls, with responsive layouts and clean treatments. Existing official/community publishing capabilities are unchanged. No database, real uploads, new auth or payment infrastructure is introduced. See research and validation documents for the historical and verification boundaries.

## Shared Army Player
`src/components/army-player.tsx` is the one media component for main Army, room and video shelf. The retained `MusicPanel` is a compatibility wrapper. `src/lib/player.ts` contains a fixed, attributed catalogue (two original MP3 sketches, two existing original silent MP4 studies, one approved YouTube performance example), same-mode queue selection, bounded seeking and time formatting.

Local audio/video use native HTML media elements with callback refs and event-driven status, duration and elapsed time. Source changes pause previous elements and unload any provider iframe. Mute/volume/repeat are real element properties. Media removal pauses the departing element; skin/clean/expanded changes do not intentionally recreate the player. Events from a non-active element are ignored. No autoplay or automatic next-item playback occurs. Browser policy/file errors have a visible fallback.

The YouTube iframe is created only after consent and removed on unload or selection change. Its native controls handle play/pause/volume/seek. The outer player does not claim provider time/playback state and disables unsupported local controls. No remote API/SDK is loaded or needed. Playback is individual, never synchronized.

Skins are fixed CSS treatments keyed by a validated additive `Theme.playerSkin` enum. Old schema-v1 records lacking this field receive a default without changing their other settings or storage keys. The player opens the same theme editor, preserving any already-open draft. Community role simulation still gates editing; verification alone grants no access. Clean view uses the minimal skin. The decorative pixel pulse is a CSS effect tied to local playback/motion state, not an audio analyzer or DSP equalizer.

Original audio is reproducible with `scripts/create-demo-audio.py` (Python standard library + FFmpeg). Runtime playback needs only the committed MP3 files; no new dependency or backend service. `player.css` scopes the skin mechanics and compact Nova arrival. Research/provenance and verification limits are recorded separately.

## Compact community layout and discussion prototype
`SidebarPlaylist` embeds only the fixed, user-supplied Spotify playlist after explicit consent; provider controls own playback. It offers an external fallback and a link to the existing full Army Player in the listening room. Native player/video functionality and stored player skins remain available; the compact Spotify wrapper also reflects the selected skin. Spotify is not controlled by the native player's transport controls.

`LivingFanSpace` and `DemoProvider` accept an optional validated `ThemeAsset` attachment, with text/image-only posts. The shared `readImage` utility is extracted from ThemeEditor and retains MIME/signature, 512 KB and 4096 px checks. Attachments remain in React memory and never enter theme storage. Animated attachments are hidden when motion is paused/reduced, while clean view keeps static post content. Existing profile keys, migration fallback and theme save/cancel semantics are unchanged.

`DiscussionBoard` holds typed threads, replies and per-thread vote state locally; initial Top ranking uses illustrative scores, New preserves insertion order. It does not persist or communicate with a backend. Future database work needs Army-scoped threads/replies, authenticated membership, unique user votes, safe object storage and moderation policies. This update creates none of those services or migrations.

## Shared board engine and local favourites
`lib/boards.ts` owns a typed, whitelisted catalogue of artist (`s`) and community (`com`) boards, sample threads and favourite-ID validation. Artist boards map one-to-one to seeded Armies; community boards have no Army slug. App Router pages `/s/[slug]` and `/com/[slug]` resolve catalogue IDs and return notFound for unknown boards; `/boards` is the directory and My Boards UI. No user-supplied path is imported or treated as an external URL.

`BoardsProvider` sits at the application root. Threads and vote maps use board IDs as separate keys, so equal thread IDs in different boards do not collide. The shared `DiscussionBoard` is used inside Armies and on both standalone board types. Per-board component keys reset unsent form state on route changes while provider-held submitted content stays available across client navigation. Bookmarks use `stan-army:my-boards:v1`, restored through useSyncExternalStore with a stable server snapshot, a strict catalogue whitelist, cross-tab storage events and local change events. Read/write failures are handled without touching theme keys; write failures report an actionable status. Only theme settings and board bookmarks persist.

`ReactionPicker` provides emoji insertion and two local original GIF attachments, using the existing raster-validation path and shared upload busy state. It renders static PNG previews, closes with ×/Escape and restores trigger focus. It does not contact GIPHY in the background; an external search link is the sole provider interaction. Integrating a live provider catalogue remains separate work. Poll cancel buttons are non-submit controls and do not invoke form validation; Escape restores composer focus.

## Optional Army tools and subject-neutral creation
The existing version-1 profile JSON gains a boolean `modules` map, validated against fixed keys and defaulting missing/invalid values to the existing enabled layout. No key/version/storage migration or artist/fan identity rewrite is required. Module visibility is presentation configuration, separate from posts, identities, messages and board data. `ArmyModule` gates mounted content using the shared profile context. Gallery/video previews are independently gated; direct media pages retain navigation and show a hidden notice. Main-page nav follows module availability and the feed expands when the sidebar is disabled. Native player and chat components are unmounted when their module is hidden.

Clean view preserves the saved module map while replacing visual treatments. Preset selection preserves the current map; Cancel returns to saved settings. Existing founder/admin role checks guard the same editor and new toggles; artist verification grants no additional permissions. Fan-profile editors do not expose Army tool toggles. The existing local JSON Save behavior stores this map per Army and keeps legacy read-through fallback.

The onboarding data shape retains internal `artistName`/`artistContext` names for compatibility, but UI/validation accept any subject with neutral identifying details. Music links remain optional. `SidebarPlaylist` accepts the Army slug, making the supplied Spotify example available in every seeded Army without linking them back to Nova’s room. No category templates, backend endpoints or persistence services were added.

## Scoped layout refinement
`army-layout.css` is imported after existing styles in the root layout and scopes geometry to the living Army canvas. Shared gap/inset/radius variables regularise identity, feed, sidebar, media and board framing without changing content, storage or permissions. Theme colour/radius variables remain authoritative. The optional-module layout and mobile display-contents ordering are preserved. Production CSS ordering is verified with the actual compiled build, not inferred solely from development rendering.

## Shared full-feed view
`LivingFanSpace` accepts `allPosts`: the default renders seven newest entries from the shared local+seeded note list, and the all-posts variant renders the entire list without a duplicate composer. `/armies/nova/posts` uses the existing Army theme/profile key and feed-module gate through `ArmyPosts`. Root `DemoProvider` retains notes/replies/hearts across client navigation; no new persistence or backend endpoint is introduced. Post archive and independent video links sit outside the feed component so videos remain accessible when the feed module is hidden. The gallery fixture collection is no longer previewed in the Army layout. Creator attribution is part of the Army identity; the existing global Discover navigation replaces the removed breadcrumb.

## Participation colour and interaction layer
The additive v1 `participationColor` field is validated independently; old records derive it from their panel colour. Computed participation foreground/link/accent/border tokens use the existing contrast function. participation.css shadows panel tokens only inside composer/chat subtrees and applies the stable interaction font/focus/control layer. Secondary panels, post content and primary button tokens remain separate. Shared frame styles now reach non-Nova frames; double borders use an explicit 3px token. Colour-font header glyphs are replaced by original currentColor SVG interface markers. No theme-key/storage migration or backend change is required. The context-aware editor exposes legacy gallery visibility on that page, suppresses irrelevant fan player settings, and reports asset/motion/provider scope rather than presenting silent no-ops.

## Outside the Army
`OutsideArmy` sits immediately after the Army chat slot, independently wrapped by `ArmyModule`. `social-channels.ts` validates canonical public profile URLs and restores per-Army local JSON containing links only. Presentation remains in the theme's additive v1 `outsideArmy` settings and `modules.outside`; old theme data restores safely without modifying stored records. Instagram's official profile iframe and X's official widget load only on explicit visitor action, with a single preview at a time and original-link fallbacks. No API proxy, scraping, post cache, credentials or backend route exists. See [feasibility and measured account behaviour](OUTSIDE_THE_ARMY.md).
