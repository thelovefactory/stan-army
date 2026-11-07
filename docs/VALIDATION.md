# Fan-led pivot validation — 2026-11-06

## Environment and scope
Checkout `/workspace/stan-army`; review branch `codex/milestone-1-visual-prototype`. Node 24.22.1 / npm 11.9.0. The approved pivot is implemented locally without a backend or deployment. Original source briefs and all public image assets are unchanged.

## Exact commands and results
| Command | Result |
| --- | --- |
| `npm run lint` | Passed, exit 0, no errors/warnings |
| `npm run typecheck` | Passed, exit 0; runs `next typegen && tsc --noEmit` |
| `npm test` | Passed, exit 0; 23 named tests, 23 passed, 0 failed |
| `npm run build` | Passed, exit 0; optimized webpack build, TypeScript and 33 generated route outputs including legacy redirects; create/official-access render on demand |
| `git diff --check` | Passed |
| `git diff --numstat -- STAN_ARMY_CODEX_BUILD_BRIEF.md STAN_ARMY_ADDENDUM_01.md STAN_ARMY_PRODUCT_PIVOT.md public` | Empty; source briefs and supplied/licensed/original public assets preserved |

Commands ran with the managed executor's supported network permissions so Node/Next subprocesses operate normally; this uses no application backend connection. No dependency was added for the pivot. Prettier 3.6.2 was used via npm exec for source formatting.

## Automated test coverage
Seven product tests cover:
1. Combined discovery search, genre, city, favourites and count-based organic sorting over Armies.
2. Separate Nova artist/founder/Army identities, intended address, canonical path, legacy resolution, and unique seed artist/address invariants.
3. Official artist and representative publishing eligibility without community admin/moderation eligibility, and cross-artist scope denial.
4. Fan onboarding required identity/context and existing-artist duplicate prevention, including typed names.
5. DNS address syntax, platform reservations, seeded/claimed conflicts, official-looking address denial and welcome validation.
6. Official-access request evidence/context validation without privilege mutation.
7. Preserved optional HTTPS music-link behaviour and unsafe URL rejection.

Eight theme tests retain the customisation safeguards and add migration coverage:
- All six presets validate and round-trip without shared mutation.
- Unsafe CSS/URL/enum/version input is rejected or defaulted.
- Raster type/signature/base64/size/dimension validation and GIF animation preservation.
- Combined asset budget enforcement.
- Readability fallbacks meet 4.5:1 for tested solid colours.
- Per-profile key isolation and exclusion of role/content fields from theme settings.
- Mock storage save/reload/cancel/reset and quota/denial behaviour.
- New Army keys read legacy customisations only when absent, never overwrite/delete old data during reads, preserve it after failed writes, and take precedence after a new save/reset.

These are model/storage-helper tests, not a claim that browser interaction or file decoding has been exercised end to end.

## Generated-output checks
Python assertions against `.next/server/app` verified:
- All 12 original artist/room alias metadata files have status 308 and point to `/armies/...`.
- Nova's generated HTML contains From the Army, From the Artist, `nova.stan.army`, `jess.wav`, and the community-announcement composer.
- The founder-default generated HTML does not contain an official-announcement textarea.
- Landing, discovery and fan-profile HTML is generated.

These checks read build artifacts; they do not start a server or substitute for browser QA. The 33 generated outputs include compatibility routes, not 33 new product pages or additional generic Armies.

## Working implementation / source-reviewed state boundaries
- Original six communities retained; Nova is the developed primary demo. Echo Valentine is only a catalogue identity for the no-Army onboarding case.
- Existing editor/presets, local image/GIF selection, panel/background settings, clean/custom mode and motion controls are retained. Army editing is fan-founder/admin scoped in the role simulation; official roles do not expose it.
- Theme schema remains v1. Old artist-key customisations load through an explicit read-through fallback and remain stored; new saves use stable Army IDs. Fan keys are unchanged.
- Enlistment and submitted chat use Army IDs, survive client navigation and reset on refresh. Post hearts remain page-local. New announcement posts/drafts are page-local; their publishing role attribution is captured at creation.
- Official and community composers have separate capability gates and submit-time checks. The dropdown is visibly simulated, not secure authorization.
- Creation previews, copyable non-live invite text, safe music links, edit/restart and official-access previews do not create hosted communities, reserve DNS or grant status.
- No automatic ownership transfer or inactivity timer exists. The 90/30-day examples remain provisional policy ideas; review must consider ongoing moderation and community continuity.
- All content remains React-escaped. No arbitrary CSS/HTML/JS is executed. Global nav and role/editor controls remain outside theme scope.

## Browser QA and screenshots remain unavailable
This session exposes no `cua_repl.js` or supported managed browser-control tool. No browser was installed, alternate browser-control path improvised or screenshot fabricated. The user-requested local development server is used for HTTP checks; it is not a substitute for browser QA.

The [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) says: “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” This leaves actual desktop/mobile rendering, keyboard focus, software keyboard, image/GIF decoding/playback, clipboard behaviour, localStorage refresh, reduced-motion presentation and third-party playback unverified. There are no screenshots in this deliverable.

## Focused manual review
1. Pull the review branch, run `npm ci` and `npm run dev`. Visit `/armies/nova` at 1440px, 390px, 320px and 200% zoom. Inspect Jess's founder spotlight and the three distinct identities.
2. Open an old bookmarked `/artists/nova-reign` or room path. Confirm it redirects and the old saved theme still appears. Edit/Save, refresh and Reset/Save; verify new-key precedence and fan-theme isolation.
3. Try all six presets and existing local JPG/PNG/WebP/GIF controls; test tile/cover/contain/position/fixed/scroll, opacity, colours, font, clean view, animation pause and reduced motion. Check chat/music/announcement readability under extreme colours/transparency.
4. Enlist, send chat, react to a post, switch clean/custom, open the room and return. Verify state and then refresh reset. Confirm fan profile enlistments refer to Armies, while favourites still refer to artist identities.
5. In founder/admin simulation, compose From the Army; switch to official artist/representative simulation on Nova and compose From the Artist. Confirm no Customise/community composer for official-only roles, no official composer for founder-only roles, and stable attribution of already-added posts. Moderator/visitor modes should not expose either composer or theme editing.
6. Search a missing Army in discovery and use its prefilled creation CTA. Search Nova to exercise duplicate prevention; use Echo Valentine for an existing catalogue identity without an Army. Test reserved/conflicting/invalid addresses, unlisted-artist context, welcome/music link, shared theme preview, edit/restart and non-live invite copying.
7. Open official access, test invalid/valid evidence fields and finish the request preview. Confirm nothing was submitted and no role changed. Official appearance in Nova is a fictional fixture only.
8. Tab through all routes, use the skip link and mobile menu, test editor Escape/Cancel focus, and inspect keyboard/touch/rail/bottom-sheet usability. Load/unload media only after consent and test the YouTube fallback.

## Remaining simulation and next engineering step
No authentication, real permissions, database, realtime, global artist/address conflict checks, DNS, verification, moderation enforcement, transfers, payments, campaigns, ads or deployment. No invented streaming/royalty metrics or synchronized playback. Next engineering work is authenticated fan accounts, canonical persistent Armies, explicit stewardship roles and real enlistment, with server/database enforcement and reviewed infrastructure choices.

## Living Fan Space validation update
All existing tests still pass. Four additional tests cover text limits, restricted contribution-style tokens, safe fixed gallery lookup and existence/type/size of playable local MP4 files. The latest total is **19 passed / 0 failed**. `npm run lint`, `npm run typecheck` and `npm run build` pass; build output includes 33 generated routes plus dynamic pages (including the gallery query page). No package dependency was added.

The already-authorised workspace development server remains running. HTTP checks returned 200 for `/armies/nova`, `/armies/nova/gallery?memory=bside-print` and `/armies/nova/videos`. Parsed main HTML confirms Nova, Leave your mark, sample-conversation controls, the shoebox and both announcement labels, with founder credit after fan content and no oversized founder-panel markup. The local MP4 serves `206 video/mp4` for a range request. `ffprobe` confirms the sample clip is six-second H.264, 800×450, with no audio stream. These are HTTP/generated-media checks, not browser playback or visual screenshots.

### Additional manual visual review
1. Write a note using each of the four treatments; confirm it appears first. Leave a heart, expand replies and answer; navigate to the gallery and back. Confirm session state survives and refresh clears content but retains saved themes.
2. Disable sample conversations. The feed should retain only the founding note, with no sample hearts/replies, plus anything you wrote. Does one personal note feel like a beginning rather than an empty dashboard?
3. Open gallery previews, filter Photos/Fan art/Keepsakes, navigate details with native dialog controls/Escape, and keep/unkeep a memory. Inspect stock/original provenance captions and return-focus behaviour.
4. Play the two original silent clips manually. Confirm no autoplay or looping without explicit Repeat, local file delivery, download links and pause when motion controls switch off. These are original typography studies, not artist performance uploads.
5. Check artist-first hierarchy, varied contribution compositions and bottom founder credit at 1440/390/320px and 200% zoom. Ensure the chat/music/sidebar stack remains useful. Open From the Army / From the Artist and verify existing role-gated composers.
6. Test custom/clean view on main/gallery/video pages, including existing saved themes and a bright/clashing theme. Contribution treatments should neutralise without erasing their content. Check focus, contrasts and reduced-motion behaviour.

The actual historical research screenshot is in `docs/research/`; product browser screenshots remain unavailable. No browser visual/keyboard/dialog/playback pass is claimed because the required managed tool is still absent. The existing user-requested server was used for HTTP checks; no alternative browser was installed or controlled. No production backend, real upload service, payments or deployment was added.

## Turn up the music — current validation
`npm run lint`, `npm run typecheck`, `npm test` and `npm run build` passed. The latest suite has **23 tests / 23 passed / 0 failed**; build generates 33 outputs, with no additional route count from the player. Four new tests cover safe known catalogue sources/mode queues, previous/next wrapping and seek/time edge cases, old v1 preference preservation with the new default, and enum-only player-skin persistence/injection rejection.

HTTP checks on the already-authorised workspace preview returned 200 for `/armies/nova`, `/armies/nova/room` and `/armies/nova/videos`. Parsed markup has exactly one Army Player per page, no unsolicited iframe, and no autoplay attribute. Nova has no promotional banner and follows compact identity → Army Player → Leave your mark → founder credit. Both new MP3 files return 206 `audio/mpeg` to range requests. `ffprobe` reports valid 24.06-second MP3 audio; FFmpeg successfully decodes the original source with non-silent output and no clipping (sample measured mean -24.2 dB, peak -9.0 dB).

The old long-running Turbopack development process stopped responding during HTTP checks, despite successful production compilation. It required a targeted process restart; the attempted cache move failed without changing the files, and no cache/data directory was deleted. Webpack development then served all pages successfully. `npm run dev` now explicitly uses webpack, matching the production build, so local reviewers use the verified bundler. No dependency version changed and no browser-saved preference was cleared. The generated `next-env.d.ts` dev-path change and untracked pre-existing AGENTS.md are not included as product edits.

### Genuinely wired vs. decorative/provider-owned
- Local play/pause/stop/seek/volume/mute/repeat use native audio/video methods/properties; time/duration/loading/ended/error status comes from active-element events. No timer pretends to play a track. Selecting a new item pauses/unloads old playback; the next selection waits for explicit Play.
- Music/video mode, selection queue and compact/expanded layout are real React interactions around one component. The same player is reused in the wider room and video shelf.
- Pixel bars are explicitly decorative CSS motion tied to local playback and motion settings, **not** audio analysis or a working EQ. Reduced motion/animation pause freezes them; no hidden DSP is claimed.
- YouTube is created only on consent. The outer button loads/unloads it; play/pause/seek/volume remain the provider's own controls. Source fallback remains available. Stan Army does not read provider time/state or synchronize it across users.
- Skins are stored through the existing live editor/Save/Cancel contract. Old v1 records missing `playerSkin` receive a safe default while keeping their previous fields; storage keys and legacy fallback are unchanged. Official identity does not gain edit permission.

These implementation statements and model/HTTP/media checks do not claim successful browser audio, gesture/codec handling, keyboard/range interaction, skin layout or screenshot verification.

### Focused review checklist
1. Open `/armies/nova`. Confirm the large FEEL IT TOGETHER banner is absent and music is immediately visible after compact identity. At 1440/390/320px and 200% zoom, inspect wrapping, first-screen height, readable controls and access to the note composer/chat.
2. Play each original audio sketch. Test pause, stop/rewind, seeking, mute, volume, repeat and previous/next. Confirm selection change stops the earlier source, never starts unsolicited playback, and displayed time matches actual playback.
3. Switch to Video without leaving the page. Play/pause/seek an original silent study, expand/compact, and show/hide the queue. Load the NPR example only by clicking; test provider controls, unload, source fallback and blocked-embed behaviour.
4. From the player skin button or CUSTOMISE, try all four skins, Save/refresh, Cancel and Reset. Continue audio while changing skins and verify it is not restarted. Reopen an old theme with colours/background/GIF/avatar settings and confirm those remain. Verify custom banner art is a compact readable treatment, not a resurrected hero.
5. Test clean view, reduced motion and pixel visualization off. Audio should not be muted by visual-motion preferences; deliberate native media interaction remains possible. Test explicit video pause when animation preference switches off.
6. Check keyboard focus and range controls, media-error source fallback, official/visitor role restrictions, local note/hearts/replies, gallery/shelf state, distinct community/artist notes and founder credit. No community backend has changed.

Browser tooling remains unavailable, so product screenshots and actual desktop/mobile/playback/keyboard results remain outstanding. Research contains an inspected preservation-reference image separately from product evidence. No production streaming, licensing infrastructure, payments, auth, real uploads or deployment was implemented.

## Feed, stereo, members and s/Nova — November 7, 2026
This section supersedes the earlier music-first layout and browser-tooling limitation for the current iteration.

Commands and results:
- `npm run lint` — passed, zero warnings/errors.
- `npm run typecheck` — passed.
- `npm test` — 23 passed, zero failed (run with subprocess/network capability; the default sandbox otherwise reports only the four test-file wrappers).
- `npm run build` — passed, 33 generated outputs. One initial sandboxed attempt could not parse TypeScript `--showConfig`; repeating with the environment's subprocess/network capability passed.
- `PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-army-community.mjs` — passed using installed `/usr/bin/chromium`. Browser tooling is now available under the updated environment runtime guidance.

Browser checks cover desktop 1440px and mobile 390px layout, page overflow, player/chat column placement, members selection, Escape dismissal, text posts, decoded local-image attachments and image-only posts, creating a discussion, vote toggles, adding replies, Top sorting, click-to-load Spotify and unloading its iframe, refresh resetting posts, and absence of uncaught page errors. An initial mobile dropdown overflow was corrected and retested. A separate browser scenario verified saving Glitter Bomb, restoring it on refresh, clean/custom preserving stored JSON and authored content, Enter/Escape with focus restoration, and no overflow at 320px. Both scenarios used reduced-motion preference. The screenshot tool's first pre-hydration caret hiding produced a development warning; final captures use `caret: "initial"` after interactive checks.

Screenshots: [desktop feed](screenshots/nova-feed-desktop.png), [mobile feed](screenshots/nova-feed-mobile.png), [discussion board](screenshots/nova-discussion-board.png). These show the prototype in actual headless Chromium, not a design mockup.

For a repeatable optional browser check, install Playwright Core outside the app dependency tree and start the existing dev server in another terminal:
```sh
npm install --prefix /tmp/stan-army-browser playwright-core
npm run dev -- --port 3000
# In another terminal, from the repository:
PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-army-community.mjs
```
Set `CHROMIUM_PATH` for your installed browser, `BASE_URL` for another preview origin, or `SCREENSHOT_DIR` for another capture directory. No browser dependency was added to the app. In the managed environment these commands need the supported network/subprocess capability.

Review URL: http://localhost:3000/armies/nova ; jump directly to the board with `#discussions`. The local webpack server was restarted after the production build. Existing saved theme keys and the legacy fallback are untouched; no user localStorage was cleared. Tests use an isolated browser context.

Still simulated: sample fans/counts/posts/chat/threads, identity/roles and all contributions/votes. Uploads are browser-memory attachments, not server storage; posts and discussions reset on refresh. Only presentation settings persist. Spotify iframe creation and fallback link were verified; audio playback, account/region restrictions and full-track availability are provider-controlled and not validated here. The existing full native player and video shelf remain accessible in their previous routes.

### Familiar composer and original icons follow-up
Removed the post-style selector and added separate labelled Photo/GIF controls with original inline SVGs. `npm run lint` and `npm run typecheck` passed. The repeatable Chromium script also passed after being extended to assert absence of the selector, exercise the actual photo picker/image-only posting, verify the GIF picker’s accepted type, and check overflow at 320px. Existing desktop/mobile screenshots were refreshed. The earlier full build and unit suite results apply to the preceding layout/board implementation; this follow-up was checked with lint, TypeScript and the browser interaction suite.

### Polls and custom-theme text contrast
`npm run lint`, `npm run typecheck`, `npm test` (24 passed) and `npm run build` (33 outputs) passed. A new poll unit test covers choice count, blanks, duplicates/case-folded duplicates and length limits. The actual Chromium regression check `PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-polls-theme.mjs` exercises creating/voting/changing a vote, duplicate-choice rejection and removing a poll. It saves a deliberately clashing custom theme (black preferred text, dark panel, bright page background) in an isolated browser context and verifies computed text-to-panel contrast: **18.37:1**, with the placeholder using the same opaque readable colour. It also checks 320px overflow and absence of page errors. [Composer regression screenshot](screenshots/nova-composer-custom-contrast.png). The fix uses profile variables and the existing contrast helper; it does not reset or overwrite users’ saved themes. Polls are local demonstrations, with no server vote counts, realtime updates or timed closure.

## Artist/community boards, My Boards and picker
Final checks: `npm run lint`, `npm run typecheck`, `npm test` (**26 passed, zero failed**) and `npm run build` (**44 generated outputs**) passed. Two new tests cover one artist board per Army, independent community identities, canonical paths and whitelisted/deduplicated bookmark restoration. Unknown board IDs do not resolve to fixture data. The new namespace words `s`, `com` and `boards` are reserved in future Army-address validation.

`PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-boards-picker.mjs` passed in actual Chromium: ×/Cancel/Escape with blank/partial poll options preserve typed text; emoji insertion and local GIF posting work; no GIPHY request occurs; favourites add/remove and survive refresh; submitted threads, replies and votes remain isolated to their board across client navigation; `/boards`, `/s/nova` and `/com/disco` have no horizontal overflow at 320/390px; no uncaught page errors. One initial development run lost a draft before assertions; it did not recur in subsequent runs. Two test assertions read the preceding route before navigation completed; the final script waits for the destination heading. The earlier claim that validation blocked the old remove button was corrected: that button was already non-submit. The current controls are explicit and cancellation has been tested directly.

Current review URLs: http://localhost:3000/armies/nova , http://localhost:3000/boards , http://localhost:3000/s/nova and http://localhost:3000/com/popmusic . The local webpack server was restarted after building. Snapshots: [My Boards](screenshots/my-boards-desktop.png), [community discussion](screenshots/community-board.png), [mobile](screenshots/community-board-mobile.png), [GIF/emoji picker](screenshots/gif-emoji-picker.png).

Boundaries: favourites use a separate browser-local key; posts/replies/votes stay in memory until refresh. Theme keys and saved customisations are unchanged. There is no authenticated My Boards account or live community. The picker has two original local GIFs plus Unicode emoji. GIPHY opens only via an explicit external search link; no API key, live result feed or external GIF importer is configured. No backend or production deployment was introduced.

## Any-subject direction and optional modules
`npm run lint`, `npm run typecheck`, `npm test` (**28 passed, zero failed**) and `npm run build` (**44 outputs**) passed. Added unit coverage for older v1 records defaulting modules to enabled, strict boolean module parsing/unknown-key rejection, module round-trip, and a non-music subject creating a preview without music metadata or link.

`PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-modules-direction.mjs` passed in Chromium. It checks Nova’s enabled defaults; independent playlist preview; Cancel; Save and refresh; a visual preset retaining visibility; clean/custom retaining hidden modules; all-modules-off plus recovery from Customise; mobile overflow; direct hidden-gallery notice; official artist unable to edit community configuration; Spotify in a second Army with its correct room link; and completion of a Brie cheese preview without a music link. An initial check caught the profile context substituting default modules in clean view; that was corrected and the full scenario passed. Tests use isolated browser contexts and do not overwrite users’ themes.

[Module controls](screenshots/army-module-controls.png) · [Non-music preview](screenshots/non-music-army-preview.png). Read the guiding direction in ../STAN_ARMY_PRODUCT_DIRECTION.md. Start with `npm run dev -- --port 3000`; use http://localhost:3000/armies/nova → Customise → Tools for your Army, or http://localhost:3000/create . The webpack preview was restarted after the build.

Visibility is not privacy or authorization: hiding the embedded discussion module does not delete or restrict its separate s/ board, and direct media URLs keep their return navigation with a hidden-module notice. Existing seeded artist fields are compatibility fixtures; no new generic-subject backend exists. Old saved settings stay intact with enabled defaults, no localStorage keys are cleared, and non-music creation remains an unpublished local preview.

## Breathable layout refinement
This visual follow-up passed `npm run lint`, `npm run typecheck` and `npm run build` (44 outputs). No model or persistence behavior changed; unit tests were not expanded for CSS geometry. A new repeatable browser check is `PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-layout-polish.mjs`.

Actual Chromium checks pass in development and against the production build (`npm run start -- --port 3001`, with `BASE_URL=http://localhost:3001`): composer/player share the same top edge, feed cards align to composer width/left edge, sidebar cards align, identity has 24px space before content, post frames are unrotated, and clean/custom switching leaves saved configuration byte-for-byte unchanged. No horizontal overflow at 320, 390, 768, 800, 820, 1024 or 1440px; the members dropdown fits at tested phone/tablet sizes and closes with Escape. An initial 320px dropdown overflow was fixed by anchoring it to the full action row. Reduced-motion preference is enabled. No uncaught page errors occurred.

The existing `check-army-community.mjs` interaction suite also passes against the production build: text/image posts, thread creation/replies/votes/sorting, Spotify consent/unload and members/keyboard dismissal. Temporary production verification used port 3001; the normal webpack development preview was restored on port 3000 afterward.

Screenshots: [clean desktop](screenshots/layout-clean-desktop.png), [custom desktop](screenshots/layout-custom-desktop.png), [custom mobile](screenshots/layout-custom-mobile.png). The custom screenshots use an existing original PNG as a tiled background with bright test colours in an isolated context; they do not replace or modify the user’s personal theme. No assets, backgrounds, localStorage keys or content were removed by the refinement.

## Seven-post feed and creator header
`npm run lint`, `npm run typecheck` and `npm run build` passed (45 outputs, including `/armies/nova/posts`). The browser regression `BASE_URL=http://localhost:3001 PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs node scripts/check-post-archive.mjs` runs against a temporary production preview: eight new local posts plus four seeded entries produce exactly seven visible main-feed cards and twelve all-posts cards, newest first. The oldest local post is retained on the full page, and returning to the Army preserves the seven-post view and order. Refresh resets contributions to the four seeds. It also verifies removal of breadcrumb/gallery preview/bottom founder bar, the header Discover link, creator attribution, the mobile all-posts page and no uncaught page errors. An initial assertion was corrected to handle whitespace between flex children in the creator credit.

Screenshots: [all posts](screenshots/all-posts.png), [creator in Army header](screenshots/army-creator-header.png). Existing module browser checks now locate the small Videos link instead of the removed preview tile. Theme keys, permissions and local-only contribution boundaries are unchanged. The legacy gallery fixture page remains separate; it is not used to store old feed posts.
The updated `check-modules-direction.mjs` also passes against this production build, confirming existing module Save/Cancel/clean-view behavior, official-role boundaries, per-Army Spotify and non-music preview creation remain working after the archive/header changes.

## Customisation audit and consistent participation
Final commands passed:
- `npm run lint` — zero errors/warnings.
- `npm run typecheck` — passed.
- `npm test` — **30 passed, zero failed**, including Participation Colour migration/isolation/contrast coverage.
- `npm run build` — passed, **45 outputs**.

Against the compiled production preview (`npm run start -- --port 3001`), each command below passed with `BASE_URL=http://localhost:3001 PLAYWRIGHT_MODULE=/tmp/stan-army-browser/node_modules/playwright-core/index.mjs`:
- `node scripts/check-customisation-audit.mjs`
- `node scripts/check-army-community.mjs`
- `node scripts/check-boards-picker.mjs`
- `node scripts/check-modules-direction.mjs`
- `node scripts/check-polls-theme.mjs`
- `node scripts/check-post-archive.mjs`

The audit verifies legacy records derive their former panel colour without being rewritten; Participation Colour changes composer/chat without changing board/events/player backgrounds; other panel colour stays independent; primary colours, border styles (including visible double), corners and opacity affect their named targets; typography leaves typing/control fonts stable; wallpaper sizing/position/fixed/scroll and file removal work; header/portrait uploads are independent; six decoration choices, glitter, four player skins and animation preferences work. Uploaded-image assertions wait for decoding; theme assertions wait for local hydration. Keyboard focus is checked through actual Tab/Shift+Tab, not just programmatic mouse-mode focus.

Three worlds (monochrome, pink/glitter and fluorescent yellow with an original tiled pattern) were checked at desktop plus 390/320px. Composer/chat text contrast meets 4.5:1 and their header icons meet 3:1. Board-header actions have transparent backgrounds, zero borders, matching desktop baselines, usable mobile targets and visible keyboard focus. Bookmarking, board opening and starting a discussion still work. The audit also submits a feed reply, checks Save/Cancel/refresh/Reset appearance, confirms reset preserves hidden modules, and proves theme isolation on Nova, Sienna and Atlas. No page errors occurred. Existing post/chat/poll/archive/board/permission tests remain working; the current hostile-theme contrast regression measures 17.28:1.

The full control inventory, fixes and deliberate provider/font/motion/context limits are in [CUSTOMISATION_AUDIT.md](CUSTOMISATION_AUDIT.md). No auth/backend/migration/service was created. The normal webpack development preview is restored on port 3000 after temporary production verification.

Screenshots: [monochrome](screenshots/participation-monochrome.png), [pink](screenshots/participation-pink.png), [neon](screenshots/participation-neon.png), [neon mobile](screenshots/participation-neon-mobile.png), [minimal board actions](screenshots/board-text-actions.png). These are actual browser renders in isolated test contexts; the user's personal wallpaper and stored themes are not replaced.

## Culture-first landing page
`npm run lint` and `npm run typecheck` passed. A focused Chromium check verified the exact supplied headline/subheads/avatar copy; Create your Army → `/create`, Find your Army → `/discover`; successful image decode of the final s/sneaks asset; actual CTA navigation; and no horizontal overflow at 320, 390, 768, 800, 1024 or 1440px. No uncaught page errors occurred. The hero was visually inspected at desktop size. The new copy has normal semantic headings, labelled links and a descriptive collage alt text.

Review images: [desktop](screenshots/landing-culture-desktop.png), [mobile](screenshots/landing-culture-mobile.png). The asset is an original generated illustration made under the user’s express permission, not their unavailable local PNG or a stock photo; provenance is recorded in ASSET_SOURCES.md. The original logo and existing Army functionality/themes are untouched. Review the homepage at http://localhost:3000/ .
`npm run build` also passed with 45 outputs. This landing-only change used focused browser verification rather than adding unit tests for static copy/CSS. The local webpack preview was restarted after the build.

### Landing community copy follow-up
`npm run lint` and `npm run typecheck` passed. A focused Chromium check verified exact ticker/discovery/belonging copy, all three feature leads and descriptions, the creation CTA destination and actual navigation, and no overflow at 320/390/800/1440px. Mobile ticker layout now displays all three phrases rather than clipping the older wide strip. [Belonging-section screenshot](screenshots/landing-ours-section.png). No application-model logic or dependencies changed; no additional unit tests were added for static copy.

### Mixed landing obsessions
Landing features Nova plus Celebrity Pets and Brie concept cards; Nova links to the existing demo, both concepts link to creation and are labelled as concepts. Licensed local photography and visible Brie attribution are recorded in ASSET_SOURCES.md. `npm run lint` and `npm run typecheck` passed. Focused Chromium checks passed for three cards, correct destinations and no horizontal overflow at 1440/800/390/320px. Screenshot: screenshots/landing-featured-obsessions.png. No shared demo fixtures or theme storage changed.

### Homepage final polish and widescreen campaign
- `npm run lint`: passed, no warnings/errors.
- `npm run typecheck`: passed, route types and TypeScript.
- `npm test`: 30 passed, 0 failed.
- `npm run build`: passed, all 45 static outputs generated.
- Focused Chromium campaign check passed: four images loaded; animation advances; pause freezes animation time; resume works; reduced motion disables animation and shows first still; keyboard focus visible; Rally the troops navigates to `/create`; no browser exceptions; no horizontal overflow at 320/390/800/1440px.
- Focused Chromium copy check passed: latest hero/supporting copy, one hero CTA, Nova/Brie/Sneakers labels, preserved hero collage, community and discovery destinations, exact final campaign copy, no overflow at the same four widths.
- Screenshots: `screenshots/homepage-polish-desktop.png`, `homepage-polish-mobile.png`, `homepage-campaign-desktop.png`, `homepage-campaign-mobile.png`.
- Local dev server restarted after build and ready at http://localhost:3000/. No backend, theme storage or Nova interaction logic changed. Concept cards remain demonstrations; generated campaign frames are illustrative, with provenance in ASSET_SOURCES.md. No claims to exact Midjourney reference fidelity.
- Replacement logo remains unavailable: repeated inline image previews reference Mac-local files that are not present in workspace attachments. Existing original header logo remains unchanged; no imitation was made.

### Compact placeholder campaign, responsive subline and fuchsia actions
Supersedes earlier campaign controls: the temporary montage is now a 208px desktop / 220px mobile banner, headline and CTA over imagery, no visible pause control. Four one-second frames loop continuously, starting on viewport entry; hover/keyboard focus holds motion and reduced-motion shows a still. User plans to supply final media at 2480×416px (desktop display 1240×208), with text/CTA rendered separately. Hero supporting sentence scales with its text container and stays on one line. Landing-page filled actions now use fuchsia with dark text; Army customisations remain untouched.
`npm run lint` and `npm run typecheck` passed. Focused Chromium verified the one-line sentence without clipping or page overflow at 320/390/600/800/1024/1440px, fuchsia button colour, 208px banner height, infinite animation, no pause button and static reduced motion. Existing full suite/build results above predate these presentation-only refinements; neither was rerun.

### Leopard action and mint heading follow-up
Landing CTAs use an original local fuchsia/purple leopard SVG with solid light-pink labels. The community heading's “It's ours.” uses the same `--mint` token as the hero and ticker, reserving pink for actions. Lint and TypeScript passed for the button/component changes. Focused browser checks verified single-line subline, action background and no overflow at 320/390/600/800/1024/1440px, plus compact loop/reduced motion. The mint change is a scoped CSS colour declaration.

### Denser leopard and readable white labels
Replaced sparse rosette pattern with a denser reference-inspired generated texture and strengthened white label weight/stroke/shadow. Hover scale and motion preferences remain unchanged. `npm run lint` passed. Focused Chromium checks passed at 320/390/600/800/1024/1440px with no overflow; desktop screenshot visually inspected for label readability and pattern rendering.

### Transparent logo / chunky creation CTAs
The ZIP supplied a valid white-on-transparent logo. Header renders its exact pixels with correct aspect ratio and no old inversion/blend/clipping rules. All three landing creation CTAs read “Build your army” with a chevron and use local Anton, no text stroke or shadow. Pattern, hover enlargement, mint heading and reduced-motion behaviour remain.
`npm run lint` and `npm run typecheck` passed. Focused Chromium confirmed the supplied asset path and no inversion, font availability, all three CTA labels, absent text stroke and no overflow at 320/390/800/1024/1440px. Desktop screenshot visually inspected: `screenshots/homepage-logo-anton.png`.

### Consistent darker actions and rotating chunky ticker
Restored real ArrowRight icons to all primary homepage creation CTAs, including the homepage header, with consistent typography, padding, pattern treatment and white labels. A 40% black layer darkens the pink/purple pattern; labels have no outline or shadow. Mobile header creation moves into the existing navigation menu to prevent crowding; the original header elsewhere and Army themes are preserved.
The mint strip cycles Anton / Bungee / Rubik Mono every four seconds using local fonts; its height remains stable and reduced motion keeps Anton static. Mobile font size/spacing accommodates the widest face. `npm run lint` and `npm run typecheck` passed for implementation. Focused Chromium checks passed: four matching primary action styles, no chevron icons, all three fonts load, every font phase fits at 320/390/800/1024/1440px with no page overflow, reduced motion disables type cycling. Desktop capture: `screenshots/homepage-actions-type.png`.
