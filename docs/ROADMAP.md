# Roadmap — fan-led Stan Army

## Milestone 1 — current prototype and approved pivot
Keep the brand and reusable components, then correct ownership and onboarding around fans. Nova's Army is the primary community, founded by Jess.wav. Artist identity, fan account and Army have separate records. New Army routes preserve old links; legacy saved themes remain readable. Existing customisation, music consent/fallback, discovery, chat, enlistment and fan profile functionality remain.

Two announcement areas are implemented: From the Army (community administrators) and From the Artist (fictional verified artist/representative participation). Official identity does not open the community editor, confer moderation or transfer the Army. Fan-led creation validates local catalogue/address conflicts and produces a non-live preview. Official access is a validated request preview, not real verification.

Original six community fixtures are retained for compatibility; no additional generic Armies are added. One catalogue-only artist allows the create flow to be explored. FAN. THE FLAMES. is explanatory product framing only. Browser acceptance evidence remains outstanding; see `VALIDATION.md`.

## Milestone 2 — accounts, canonical Armies and real stewardship
Select auth/database/storage after cost, region and quota review. Implement stable fan accounts, catalogue artist disambiguation, persistent Armies, unique canonical artist/address creation, safe uploads, membership-based owner/admin/moderator roles and real enlistment. Sensitive handle reservation and artist/community identity separation must be foundational.

Persist Army and fan themes with explicit server authorization and safe asset processing. Plan wildcard-host routing, DNS/TLS and cross-subdomain identity separately from local route fallback. Do not rely on localStorage across subdomains. Test cross-Army denial, founder/artist distinction, duplicate/concurrent creation, last-owner protection, enlistment idempotency and upload policies.

## Milestone 3 — community and verified participation
Persistent chat, announcements, posts, reporting, scoped moderation, rate limits, history, realtime delivery and continuity operations. Add official artist/representative review, authority scopes, expiry/revocation and disputes. Preserve separate community/official announcement surfaces and tests proving verification cannot grant administrative powers.

Stewardship changes require notice, platform review, community continuity and appeal. Inactivity alone is insufficient, especially with active moderators. No automatic ownership transfer. Earlier 90-day/30-day suggestions remain provisional until a reviewed policy exists.

## Milestone 4 — discovery, truthful reporting and reliability
Catalogue matching/search, organic/editorial curation, real engagement metrics, access/privacy/export/delete workflows, accessibility/mobile review and load testing. Paid inventory is visually and operationally separate from organic ranking. Do not manufacture streaming statistics or imply royalties from embeds.

## Later — fan-funded upgrades and FAN. THE FLAMES.
Armies remain free to create/join. PRO $19 and ELITE $59 monthly pricing is provisional for optional Army upgrades, funded by eligible supporters individually or collectively. Final entitlements, ad removal, promotional credits, contribution consent, renewal responsibility, shortfall handling and refunds need agreement before billing. Professional tools may be paid separately and never buy fan community control.

Promotional campaigns need explicit goals/budgets, optional contributions, moderation/creative approval, labelled inventory, ledger/reporting and responsible payments/refunds. No fake engagement, manipulated organic ranking or guaranteed streams. Battleground/polls, ad delivery and licensed exclusive media require separately agreed scope. No live or test-mode billing, campaign collection or exclusive hosting is implemented now.

## Current review gate
The fan-led implementation is ready for product/visual review with available automated checks reported. A broader reskin can follow once the community experience is right. No deployment, paid service or complex backend is authorized by this roadmap alone.

## Current visual review: the living fan space
Prioritise authored community experience over a generic feature catalogue. This revision adds Nova's varied local fan feed, a first-stan feed mode, replies/hearts, a focused gallery/keepsake shelf and original playable video studies, grounded in 2006–2007 historical evidence. The artist remains the hero; founder credit moves down. It does not start a social-network backend or introduce real uploads/hosting. Judge whether a single person's contribution changes the emotional character of the place before adding more product surface.

## Current visual review: Turn up the music
Nova's arrival now uses compact identity and one shared skinnable Music/Video player immediately before participation. The same component replaces older music/video widgets in the room and video shelf. Original demo audio supports the one-stan test; existing fan content, themes and permissions remain. Review real browser playback, responsive height, skin contrast and keyboard control before extending the catalogue. Artist releases/official videos need permitted provider links or rights, not claims inferred from prototype media. Community-curated selection remains a possible later scope; no voting/recommendation or streaming backend is added.

## Boards and picker follow-up
Milestone 1 now includes artist `s/` boards, independent `com/` communities and device-local My Boards, using one shared discussion interface. Content/votes remain local demonstrations; only bookmarks persist. The fan-led accounts/Army/roles/enlistment milestone remains the next engineering gate after visual review. Later board persistence needs the access, vote integrity, moderation and user-favourite constraints documented in DATABASE_SCHEMA.md. A live GIPHY/other GIF catalogue and provider-compliant importing are separate integration work; the current picker uses original local GIFs and an external GIPHY search link.

## Guiding principle: any subject, music-first launch
Adopt ../STAN_ARMY_PRODUCT_DIRECTION.md for future decisions: one flexible Army structure, optional modules and no mandatory music metadata. Current M1 includes module visibility controls and neutral-subject local creation. Keep Nova/discovery/music marketing as the launch focus; do not seed dozens of unrelated categories or add category-specific templates. When the already-planned accounts/persistent Army/roles/enlistment milestone starts after visual review, design generic subject identity and optional media configuration before introducing persistent artist-only constraints. Existing verification/ownership boundaries remain intact.

### Outside the Army follow-up
Delivered the optional click-to-load public social window with local account configuration and theme integration. Before a future structured/automatically refreshed feed: select a provider/API access model, validate entitlements and authorised account types, design encrypted server-only credentials and revocation, enforce owner/admin writes with RLS, and specify caching/deletion/rate-limit behaviour. Do not treat prototype profile links as account-ownership verification or claim live updates. See OUTSIDE_THE_ARMY.md for actual Instagram/X findings; no backend work is included in this milestone.

### Beta registration design
Delivered `/beta` as an email-only design preview, with no collection or list integration. Before enabling real registration, choose the consent/privacy copy and invitation workflow, then implement an explicitly authorised backend/provider connection with server-side validation and abuse controls. No service or mailing list has been created in this visual pass.
