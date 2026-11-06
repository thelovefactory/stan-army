# Fan-led product pivot — audit and implementation proposal

Status: audit complete; structural implementation has not begun. The user's `STAN_ARMY_PRODUCT_PIVOT.md` supersedes conflicting product assumptions in the original brief and Addendum 01. Later clarification: the current design is a useful starting point, not a constraint; purposeful changes are welcome, with a broader reskin possible later.

## Product invariant
Fans establish and steward an Army around an artist. The artist need not register, approve or pay. Community authority, verified artist identity and financial support are independent. "Fan-owned" means stewardship within platform rules, never ownership of artist IP. No money or verification event automatically transfers community control.

## Audit of the current implementation
| Current assumption | Location | Smallest correction |
| --- | --- | --- |
| Artist object doubles as community, address and activity | `src/lib/data.ts`: `Artist` owns slug, handle, count, favourites and discovery ordering | Separate artist identity/catalogue data from an Army record, founder and memberships; build a joined display model for existing cards |
| Creator is the performing artist | `src/components/army-wizard.tsx`, `validateDraft` | Fan selects/adds an artist, selects an Army address, writes a welcome/customises, and rallies fans; their own account handle is distinct |
| Community URL implies artist identity | `/artists/[slug]`, artist-card links, share link and room links | Canonical local route `/armies/[armySlug]`; retain legacy artist routes as redirects to existing Armies |
| Artist controls the visual editor | `ProfileTheme` role selector says Artist owner / Authorised manager | Community founder/admin governs Army settings; official artist/representative identity alone cannot open the editor |
| All enlisted state/chat/room/theme targets are artist slugs | `DemoProvider`, `ArmyChat`, `ArtistSpace`, theme keys | Key community state by stable Army ID; keep user profiles keyed independently |
| The welcome, announcement and conversational authority are the artist's | `ArmyChat` and artist-space posts | Lead with a founder welcome and community announcements; distinguish any simulated official contribution explicitly |
| Discovery asks artists to create pages and empty results only clear filters | `discovery.tsx` | Fan-led CTA; no-match start flow with escaped search prefill; existing Army links to Enlist |
| Landing implies "your music" means the creator performs | `src/app/page.tsx` and related metadata | Keep primary slogan; explain fans build Armies without artist signup; adjust a few CTAs and supporting lines |
| Fan space is visually separate but underlying memberships still refer directly to artists | `fan-profile.tsx` | Favourite artists remain artists; enlisted communities become Army memberships |
| Proposed permission/schema and roadmap assume artist ownership | product, architecture, database, theme-engine and roadmap docs | Recast all ownership and grant boundaries around fan-run Armies |
| Revenue proposal assumes artist subscriptions | original brief / roadmap | Army-level optional funding and entitlements, separate professional tools, separate promotional campaigns |

## What stays reusable
The theme schema, six presets, raster validation, clean view, motion controls, media consent/fallback, chat composer, responsive panels, discovery controls, original logo, stock assets and fan profile layout. The media module already avoids music hosting and synchronization claims. No existing database/backend needs migration because none was created.

Visual changes should express the corrected roles: a prominent "fan-run" identity, founding fan/steward attribution, an Army address distinct from a user handle, community-authored pinned material and a separate official-access CTA. Keep the interface coherent, but do not preserve layout/copy that obscures these distinctions. Do not spend this pass on a wholesale reskin.

## Minimal entity separation
| Entity | Responsibility | Must not imply |
| --- | --- | --- |
| User | Stable account ID, personal handle/profile | An artist identity solely because a handle resembles an artist |
| Artist | Catalogue identity, display name, provider references and disambiguation | Community ownership, a user account, verified status by default |
| Army | Stable ID, artist reference, unique address, founding user, welcome, presentation, status | Ownership of artist name/music/IP |
| ArmyMembership | User/Army membership and explicit community role | Artist verification or payment entitlement |
| ArtistRelationship | User/artist relation, artist vs representative type, verification state, scope and provenance | Army admin rights |

Keep historical founder attribution separate from the current community owner/steward membership, so an audited transfer can change administration without rewriting history. Use a unique active/canonical Army constraint on artist ID, plus globally unique reserved-aware Army addresses. A joined `ArmyView` can feed the current components; no need to duplicate layouts or introduce a large client state framework.

A provider-specific catalogue ID can help disambiguate an artist, but an external catalogue listing is not proof that a user is the artist. A stage name alone is insufficient to detect duplicates. Pending artist additions need conflict/review status rather than instantly acquiring unchallengeable canonical status.

## Community and official access capabilities
| Action | Founding owner / community admin | Moderator | Verified artist / representative | Member / visitor |
| --- | --- | --- | --- | --- |
| Change Army theme/welcome/organisation | Yes, per explicit community grant | No by default | No solely through verification | No |
| Moderate community chat/posts | Owner/admin; scoped moderation grants | Scoped grant | No solely through verification | Members report; visitors browse |
| Publish community announcements | Explicit community publishing permission | If separately granted | Only if also granted community permission | No by default |
| Publish labelled official announcements | Only if independently verified for the artist | Only if independently verified | Verified scope required | No |
| Transfer Army administration | Explicit platform-supported process | No | No automatic transfer | No |
| Fund an upgrade/campaign | Subject to later payment rules | Same | Same | Eligible contributors; no authority purchased |

Official identity is portable through user-to-artist relationships, rather than a badge stored on an Army member row. Representatives require evidence of authorization, artist scope, review/expiry/revocation. Reserve sensitive user handles and review identity disputes separately from community stewardship disputes. Never label an entire fan-run Army "official" merely because a verified artist participates.

Recommendation: official contributions have a clearly labelled surface without replacing the community's pinned welcome. Community admins continue to enforce platform rules; platform review handles disputes involving identity, rights or abuse. A verified relationship must not grant unrestricted editorial or moderation power.

Prototype scope: labelled role simulation plus an official-access request screen that validates locally and explicitly does not submit a real request or grant verification. No genuine verified badge for a real person without verification.

## Revised onboarding
1. **Who are we starting an Army for?** Search seeded artist identities. Existing canonical Army leads to Join/Visit, not duplicate creation. Add an unlisted artist with distinguishing details. The signed-in concept is a founding fan; M1 uses an explicitly fictional fan account.
2. **Claim your Army's address.** Suggest a subdomain independent of any artist/user handle. Validate DNS label syntax, reserved names and seeded/local conflicts. Availability is a local demonstration, not a worldwide reservation. Production must perform this atomically server-side.
3. **Make it yours.** Welcome message, imagery and initial theme using existing customisation primitives. Avoid creating a second theme schema/editor. The creator writes as a fan, not as the artist.
4. **Rally the fans.** Preview a fan-run Army, show founder attribution and an illustrative invite URL. Creation remains local-only; no public site/DNS/account is created. Link to a compelling full demo Army without pretending the preview is hosted.

Secondary flow: **Are you the artist? Request official access.** Explain verification, specific participation permissions and the continuing fan administration before the local request form.

Discovery empty state: "No Army found for [search]. Every Army starts with one fan. Could that be you?" Use conditional wording because seed-only search cannot prove worldwide nonexistence. The CTA carries artist-name prefill through URLSearchParams, and never interpolates raw search into HTML.

## Routing and address plan
- Human Army address: `nova.stan.army`; official artist identity and founding fan handle displayed separately.
- Local first-class routes: `/armies/nova` and `/armies/nova/room` on localhost. Existing `/artists/nova-reign` URLs redirect to the corresponding Army.
- Central helpers resolve Army ID/slug and build links; do not concatenate artist handles into community addresses.
- Future production host routing: an explicit configured base domain, validated single-label subdomain, reserved platform hosts and server-side Army lookup. Rewrite a recognized Army host to the same Army renderer; unknown/reserved hosts produce safe results rather than tenant guessing. Verify host/proxy handling in the chosen hosting stack.
- Wildcard DNS/TLS and a cross-subdomain session/cookie policy are future infrastructure work, not provisioned in M1. No claim that example subdomains resolve now.
- LocalStorage is origin-scoped. Current fallback routes can share local settings, but future subdomains cannot silently share those settings; production requires database-backed themes or an explicit migration/import design.

## Canonical-artist and stewardship policy proposal
For M1 model these rules in seeds, validation and policy copy; do not claim live enforcement.

1. A matched artist with a canonical Army goes to that Army. An ambiguous match requires distinguishing evidence/review. Platform review can merge duplicates with redirects and preserved member/history references; no automatic destructive merge.
2. Names and addresses must identify the fan community without impersonating an artist. Reserve platform/security names and sensitive identities; verification unlocks eligible official identities rather than a payment or first-come claim.
3. Founder inactivity never instantly exposes the Army for public claiming. Proposed production process: 90 days without administrative activity, notice and a 30-day response window, review of suitable existing stewards, platform approval and an appeal route. Thresholds are provisional.
4. Voluntary transfer requires current-owner consent, recipient acceptance and an audited platform-supported handover. Involuntary transfer requires documented policy grounds and review/appeal. Official participation, subscription funding and promotional spend are not transfer grounds.
5. Platform abuse, copyright/trademark and impersonation reports follow documented procedures. Community stewardship does not remove an artist's rights or platform enforcement responsibilities.

## Preserve existing local settings
Current theme keys use `artist:<slug>`. Introduce `army:<stableId>` keys with a bounded, validated one-time fallback read from the matching legacy key. Prefer an existing new key, never overwrite it. Retain the old key until the new write succeeds; surface storage failures. Keep fan keys unchanged. Migrate presentation settings only, never infer community authorization from a stored role or config.

Map the six demo artists to explicit seeded Armies and founders so current links/content remain available. Re-key session enlistments/messages to Army IDs without changing their prototype-only persistence scope. Add regression tests for alias routing, duplicate/reserved addresses, legacy theme preservation, role separation and existing filtering/preview interactions.

## Funding and promotion: concept now, implementation later
Free creation and free enlistment are confirmed. PRO $19/month and ELITE $59/month are provisional Army upgrades; fan contributions and professional tools must not confer ownership or artist identity. Exact entitlements, pooled-funding rules, credit value/expiry, renewal responsibility and refunds remain open. Do not introduce billing, wallets, contribution collection or a nonfunctional checkout.

**FAN. THE FLAMES.** is a future opt-in promotional campaign concept. Architect separate future Campaign, Contribution, Placement, BudgetLedger and Reporting boundaries. Paid inventory is visibly labelled and never modifies organic discovery rankings. Moderation/approval, consent/rights for creative, responsible payments and refunds precede launch. Do not sell or promise streams, fake engagement, reach guarantees or royalty outcomes. A concept panel in the prototype may explain this without a payment CTA or fabricated campaign metrics.

Keep provider-approved music embeds and fallback links. Licensed exclusive media remains future work; verified identity alone is not a media rights license.

## Smallest implementation sequence after this report
1. Capture the pivot and audit (this commit); retain earlier source briefs as history. No application behaviour changes yet.
2. Separate seed identities/Armies/users/memberships/verified relationships; add a joined display adapter. Preserve six current communities, with Nova as the strongest complete fan-run demonstration.
3. Introduce Army routes/link helpers and theme-key compatibility; keep the existing visual editor, player, chat and fan profiles working.
4. Reattribute community content and role controls; make founder stewardship visible; add clearly separate official-access request demo.
5. Revise wizard, landing supporting copy, discovery CTA/empty states and prefill. Reuse existing visual styling and customisation controls, improving hierarchy where needed.
6. Replace conflicting product/architecture/database/roadmap/theme documentation with the revised model; describe subdomain routing and later funding boundaries.
7. Run lint, typecheck, targeted regression tests and production build. Repeat browser/desktop/mobile/keyboard review when supported tooling is available. Current environment still lacks the required managed browser tool; no screenshots or browser pass are implied.

## Decisions worth confirming
- **Stewardship:** accept the proposed platform-reviewed inactivity and ownership-transfer process? The 90-day + 30-day notice periods are suggestions, not confirmed requirements.
- **Official voice:** adopt a separately labelled official announcement surface while leaving community pins/administration with fan stewards? Recommended; verified users do not automatically moderate or edit Army design.

Neither requires a backend in this prototype. The core fan-led ownership, one-artist/one-canonical-Army rule, separate identities and no automatic artist takeover are already explicit requirements, not open questions.

## Gate
The pivot's section 11 explicitly says: "Before making major structural changes, report your proposed implementation plan and any decisions that need clarification." This commit supplies that report. It does not restart, redesign, restructure or deploy the application. The user's later design clarification permits purposeful UI changes; it does not remove the requested plan-first step.
