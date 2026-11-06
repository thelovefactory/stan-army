# Fan-led pivot validation — 2026-11-06

## Environment and scope
Checkout `/workspace/stan-army`; review branch `codex/milestone-1-visual-prototype`. Node 24.22.1 / npm 11.9.0. The approved pivot is implemented locally without a backend or deployment. Original source briefs and all public image assets are unchanged.

## Exact commands and results
| Command | Result |
| --- | --- |
| `npm run lint` | Passed, exit 0, no errors/warnings |
| `npm run typecheck` | Passed, exit 0; runs `next typegen && tsc --noEmit` |
| `npm test` | Passed, exit 0; 19 named tests, 19 passed, 0 failed |
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

These checks read build artifacts; they do not start a server or substitute for browser QA. The 31 generated outputs include compatibility routes, not 31 new product pages or additional generic Armies.

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
This session exposes no `cua_repl.js` or supported managed browser-control tool. No browser was installed, alternate browser-control path improvised, preview server started or screenshot fabricated.

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
4. Play the two original silent clips manually. Confirm no autoplay/loop, local file delivery, download links and pause when motion controls switch off. These are original typography studies, not artist performance uploads.
5. Check artist-first hierarchy, varied contribution compositions and bottom founder credit at 1440/390/320px and 200% zoom. Ensure the chat/music/sidebar stack remains useful. Open From the Army / From the Artist and verify existing role-gated composers.
6. Test custom/clean view on main/gallery/video pages, including existing saved themes and a bright/clashing theme. Contribution treatments should neutralise without erasing their content. Check focus, contrasts and reduced-motion behaviour.

The actual historical research screenshot is in `docs/research/`; product browser screenshots remain unavailable. No browser visual/keyboard/dialog/playback pass is claimed because the required managed tool is still absent. The existing user-requested server was used for HTTP checks; no alternative browser was installed or controlled. No production backend, real upload service, payments or deployment was added.
