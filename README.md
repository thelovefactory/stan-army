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

The dev script uses webpack, matching the production build, to avoid a hang observed in the previous long-running Turbopack preview. No browser storage reset is needed.

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

## Turn up the music — latest revision
Nova's large promotional banner is removed. Arrival is compact identity → **THE ARMY PLAYER** → the existing community, with no marketing introduction. Old custom banners remain saved and can appear as a small readable identity background; avatar/background settings and fan content are preserved.

The same Army Player powers the main Army, focused listening room and video shelf. Switch **MUSIC / VIDEO** on-page; choose selections with Previous/Next or the queue; use Play/Pause, Stop, seek, volume, mute, repeat and compact/expanded controls. Local controls operate HTML media elements. No playback starts automatically, and selecting a different item requires pressing Play. A browser playback failure has a visible status and source-file fallback. YouTube is explicitly load/unload consent with provider-native play/pause/seek/volume; Stan Army never pretends to read or synchronize that iframe's state.

Choose **Classic desktop**, **Bubblegum Y2K**, **Quiet hours** or **Toxic chrome** in CUSTOMISE → The Army Player. The player skin button opens that existing editor for fan administrators, with live preview and Save/Cancel. Skins are a safe additive v1 theme field, not a second storage system. Old themes without the field keep their earlier preferences and receive the classic player default. Clean view uses Quiet hours. Existing saved Army/fan keys and legacy fallback are unchanged.

The pixel pulse is **decorative, not audio analysis or an equalizer**. It runs only while the local media reports playback and motion is permitted, and can be switched off. Visual motion controls do not mute user-started audio; they pause currently playing local video when switched off. Native deliberate media play remains possible. No streaming infrastructure, DSP, voting, licensing service or backend is introduced.

[Player research and inspected visual reference](docs/research/ARMY_PLAYER_REFERENCES.md) · [Supplied music brief](STAN_ARMY_TURN_UP_THE_MUSIC.md)

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
The Army Player starts with two original 24-second synthesized instrumental sketches, clearly labelled as prototype audio rather than Nova recordings. Video mode offers the existing two original silent films and the public NPR Music performance through a click-to-load YouTube privacy-enhanced iframe. Loading the iframe contacts YouTube; provider/browser restrictions may prevent playback, so the YouTube link remains. Commercial recordings are not hosted; original local demo files are. No synchronization or playback analytics.

Automated checks and generated-output checks are recorded in [VALIDATION.md](docs/VALIDATION.md). Desktop/mobile browser interaction, keyboard/file-picker/playback journeys and screenshots remain unavailable because this session lacks the required managed browser tool. Do not treat implementation or unit-test coverage as a completed browser accessibility audit.

## Documents
[Product](docs/PRODUCT_SPEC.md) · [Architecture](docs/ARCHITECTURE.md) · [Database design](docs/DATABASE_SCHEMA.md) · [Roadmap](docs/ROADMAP.md) · [Theme engine](docs/THEME_ENGINE.md) · [Asset sources](docs/ASSET_SOURCES.md) · [Pivot audit](docs/PIVOT_AUDIT_PLAN.md)

### Outside the Army
On `/armies/nova`, the optional external social window sits below chat. In the founding-stan/admin demo role, open **Manage channels** to save or remove Instagram/X profile links on this device. In **Customise**, toggle **Outside the Army** and choose its accent/treatment; save the theme to retain appearance changes. Visitors choose **Load … preview** before either provider is contacted. Instagram's supplied profile can display official thumbnails; X may show an unavailable message with its original link. These are public previews, not verified account connections or a guaranteed live feed. [Research, supported routes and limitations](docs/OUTSIDE_THE_ARMY.md).
