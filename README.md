# Stan Army — fan-led Milestone 1 prototype

**The fans build the Army; the artist is who they rally around.**

Local Next.js App Router / TypeScript / Tailwind prototype. The approved [product pivot](STAN_ARMY_PRODUCT_PIVOT.md) supersedes conflicting artist-ownership assumptions in the original brief. The [original brief](STAN_ARMY_CODEX_BUILD_BRIEF.md) and [customisation addendum](STAN_ARMY_ADDENDUM_01.md) remain intact.

## Run
Node.js 22.13+ and npm; validated with Node 24.22.1 / npm 11.9.0. No environment variables or external accounts.

```sh
# Existing checkout
git switch codex/milestone-1-visual-prototype
git pull
npm ci
npm run dev
```

For a new checkout, first run `git clone https://github.com/thelovefactory/stan-army.git` and `cd stan-army`. In this workspace the checkout is `/workspace/stan-army`. Open http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Main review routes
- `/` — fan-led proposition with the existing visual identity.
- `/discover` — find fan-run Armies, filter/search, or start a missing Army with the search prefilled.
- `/armies/nova` — Nova Reign's fan-run Army, founded by Jess.wav.
- `/armies/nova/room` — wider listening/chat view with the same saved theme.
- `/armies/nova/gallery` — the communal shoebox: photographs, original prints and keepsakes.
- `/armies/nova/videos` — two playable original silent fan-video studies.
- `/fans/jess-wav` — the founding stan's own profile and local enlistments.
- `/create?artist=Echo%20Valentine` — artist-without-an-Army onboarding example.
- `/official-access?army=nova` — local artist/representative verification-request preview.

`nova.stan.army` is the intended public address, **not a deployed URL**. `/artists/nova-reign` and its room route redirect to the new local Army routes. All six original communities remain available for discovery and link compatibility; Nova is the main community example.

## What works locally
Artist, founding fan and Army are separate records and visible identities. Enlistment/chat are keyed by Army ID, survive client navigation and reset on refresh. Search, genre/city filters, organic sort/favourites, empty states, share link and post reaction remain. Chat sends only to your in-memory demo view.

**From the Army** belongs to fan administrators. **From the Artist** is a distinct surface for verified artists/representatives. The visible role dropdown is explicitly simulated: founder/admin can customise and compose community announcements; official roles on Nova can compose official announcements, but cannot customise or moderate. Added announcements remain page-local and clear on navigation/refresh. No real identity has been verified.

Creation is unmistakably fan-led: search/select/add an artist; route existing canonical matches to their Army; validate a separate reserved-aware Army address; choose starting imagery and a shared theme preset; write a fan welcome; finish an editable preview. Completion creates no public Army or reserved address. Invite text is marked non-live. Official-request validation likewise submits nothing and changes no permissions.

## The living fan space — leave your mark
Nova now leads into a fan-authored feed rather than a promotional noticeboard. Write a note, choose Simple note / Notebook heart / After hours / Demo photo, and **Leave my mark**. It appears first in the feed. Hearts and threaded replies work locally; notes/replies/hearts and kept gallery memories survive client navigation in the root provider, then clear on refresh. Unlike themes, none of this content is persisted or published.

Switch off **Show sample conversations** to try a first-stan feed: only the founder's first note (without sample hearts/replies) and your contributions remain. There is still something meaningful to do without a crowd. Other fixture areas remain explicitly labelled examples, never a real online-user claim.

A small gallery preview opens the deeper filtered shoebox, with keyboard-native modal viewing, previous/next and a local keepsake shelf. The video shelf contains real six-second silent typography clips created for this prototype; manual playback only, not claimed concert/cover footage. No copyrighted performance was hosted. The short gallery/video previews keep the main Army from becoming a feature catalogue.

Artist first, then community and fan contributions. The oversized founder panel is removed; Jess gets a warm credit near the bottom. From the Army and From the Artist remain in a compact expandable area with their existing separate permissions. Chat, music, events, clean view, animation controls and theme compatibility remain. Existing six community fixtures are retained; this revision focuses on Nova.

The research and original 2007 screenshot are documented in [MYSPACE_2003_2008.md](docs/research/MYSPACE_2003_2008.md), distinguishing historical evidence, inaccessible archive replays, a modern reconstruction and design interpretation. The supplied brief is preserved in [STAN_ARMY_LIVING_FAN_SPACE.md](STAN_ARMY_LIVING_FAN_SPACE.md). This is a reinterpretation, not a copy of MySpace branding/layout.

## Customisation and preservation
CUSTOMISE opens the shared live editor for Army fan-administrator or fan-profile-owner simulation. Six presets, raster/GIF backgrounds, cover/contain/tile/natural sizing, positions, fixed/scroll attachment, colours, retro font stacks, panel styles, original CSS decorations, banner and avatar selection remain.

JPG/PNG/WebP/GIF: 512 KiB each, 1 MiB combined, max 4096×4096. The original pixel-heart GIF is a ready-to-try example. Files are read locally, never uploaded to a server. Save writes a validated v1 JSON theme to localStorage; Cancel/Escape discards draft changes; Reset previews defaults (Save to retain). Storage failures are announced.

Old artist-key themes remain readable for the matching new Army. New saves use a stable Army key and take priority; old values are never deleted. Fan profile keys are unchanged. Clean/custom viewing preserves content and state. Pause/reduced motion freeze CSS and hide animated images. Text/links get contrast fallbacks; core chat/music/controls retain solid readable surfaces. Advanced CSS is disabled.

## What remains simulated
No real auth, server authorization, database, realtime delivery, global availability, public creation, DNS, verification, moderation enforcement, ownership transfers, payment/subscription, campaign delivery, ad serving or deployment. Inactivity never automatically transfers an Army. The proposed 90-day/30-day examples remain provisional; active moderators and community continuity matter.

FAN. THE FLAMES. is a future promotional concept only. No payment CTA or guaranteed streams. Creation/joining are free; optional Army upgrades and professional tools remain separate from ownership and identity.

## Music and verification limits
The player uses a public NPR Music sample through a click-to-load YouTube privacy-enhanced iframe. It is not the fictional artist's catalogue. Loading contacts YouTube and playback depends on provider/browser policies. The watch-on-YouTube fallback remains available. No hosted music, synchronization or playback analytics.

Automated checks and generated-output checks are recorded in [VALIDATION.md](docs/VALIDATION.md). Desktop/mobile browser interaction, keyboard/file-picker/playback journeys and screenshots remain unavailable because this session lacks the required managed browser tool. Do not treat implementation or unit-test coverage as a completed browser accessibility audit.

## Documents
[Product](docs/PRODUCT_SPEC.md) · [Architecture](docs/ARCHITECTURE.md) · [Database design](docs/DATABASE_SCHEMA.md) · [Roadmap](docs/ROADMAP.md) · [Theme engine](docs/THEME_ENGINE.md) · [Asset sources](docs/ASSET_SOURCES.md) · [Pivot audit](docs/PIVOT_AUDIT_PLAN.md)
