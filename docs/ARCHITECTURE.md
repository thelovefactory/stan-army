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
`fan-space.ts` holds typed fictional note/reply, memory, member and video fixtures with original/stock provenance. `LivingFanSpace` handles controlled text/style composition and threaded reply controls. `MemoryVisual` renders allowlisted local photographs and original CSS/text print/keepsake designs. `FanMediaPreviews` leads to two Nova-only deeper experiences; `FanMediaPage` reuses the same Army theme wrapper. The gallery uses native dialog focus/Escape behaviour. Local MP4 video elements have controls, no autoplay/loop, and pause when the existing motion preference switches off.

`DemoProvider` adds in-memory notes, replies, heart toggles and kept-memory IDs alongside unchanged enlistment/chat state. It is still a small React context, not a social backend. Text is validated for useful length and React-escaped; style choices are a fixed enum. Gallery query IDs resolve only to known memory fixtures, never user-provided remote asset URLs. Saved theme schema/storage keys and legacy fallback are unchanged. `ProfileTheme` exposes clean/motion settings to contributions and sets a clean-view data attribute for scoped CSS.

Only Nova gets this authored community composition; the original other fixtures remain compatible. `living.css` styles contribution content independently from core platform controls, with responsive layouts and clean treatments. Existing official/community publishing capabilities are unchanged. No database, real uploads, new auth or payment infrastructure is introduced. See research and validation documents for the historical and verification boundaries.
