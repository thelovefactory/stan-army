# Milestone 1 validation — 2026-11-06

## Environment and scope
Checkout: `/workspace/stan-army`, cloned from `thelovefactory/stan-army`. The repository contained the master brief only. It is preserved unchanged. Node 24.22.1 / npm 11.9.0. No backend or deployment was created.

## Commands and results
| Exact command | Result |
| --- | --- |
| `npm --cache /tmp/stan-army-npm install --no-audit --no-fund` | Passed: 366 packages installed; npm emitted a deprecation notice for ESLint 9.39.5 |
| `npm run lint` | Passed: exit 0, no errors or warnings after naming the PostCSS configuration export |
| `npm run typecheck` | Passed: exit 0, TypeScript reports no errors |
| `npm test` | Passed: 11 tests, 11 passed, 0 failed using `node --import tsx --test tests/*.test.ts` |
| `npm run build` | Passed: optimized webpack build, TypeScript and all 18 static pages generated |
| `git diff -- STAN_ARMY_CODEX_BUILD_BRIEF.md` | Empty: original brief unchanged |
| `sha256sum public/brand/stan-army-logo.png /tmp/codex-remote-attachments/01a1b11c-f59a-766f-b6f9-3fe4a28d9050/a8bf5110-9937-4330-9ddf-16059b8ff615/2-1000084232.png` | Matching hash `4d97cadf58c75a66ae1dbfcb726eb80f696f00e6ff509c9b0a3397183f857959` |

The managed executor initially blocked the Git/network command and child-process behaviour: the first build failed while parsing TypeScript `--showConfig`, and the original tsx CLI test script failed opening an IPC pipe. Retrying with the executor's supported network permissions let Next.js child processes run normally. The final test script uses Node's tsx import hook instead of the extra CLI IPC server. The final supported-permissions test run printed all four named tests, rather than relying on a sandboxed process-level result. These are environment details, not ignored application failures.

## Automated functional coverage
- Combined case-insensitive discovery search, genre/location constraints, whitespace normalization and empty results.
- Most-stanned ordering from actual seed counts and editorial favourites membership.
- Required identity fields, handle syntax and bio validation.
- Optional HTTPS link acceptance and rejection of script, HTTP, invalid and credential-containing URLs.

## Source-reviewed provisions (not browser-tested)
- All primary navigation and seeded artist links point to implemented routes. Build generates six artist pages and six listening rooms.
- Local enlistment toggles use `aria-pressed` and update the count through a React context. Count and status are announced; the count resets on refresh.
- Chat trims text, rejects blank content, limits the input to 280 characters, labels new messages `@you.demo`, and states that messages are local only.
- Wizard checks each stage before advancing, moves focus to the heading, allows back/edit/restart, and never publishes. Safe links render as external links, not arbitrary iframe HTML.
- The YouTube iframe does not exist until the Load button is clicked. There is an unload control and persistent link fallback; there is no autoplay or shared playback mechanism.
- Responsive breakpoints at 1100, 800 and 600px; artist media/chat and discovery cards become one column on small screens. Mobile navigation uses a button with expanded state.
- Native keyboard controls, skip link, visible focus outlines, semantic landmarks, labeled form controls, status/alert feedback and reduced-motion rules are implemented.

## Contrast calculation
Calculated from solid design-token foreground/background colours using the WCAG relative-luminance formula:
| Pair | Contrast ratio |
| --- | --- |
| Main text / page background | 18.32:1 |
| Muted text / panel | 7.41:1 |
| White text / blue CTA | 4.81:1 |
| Dark text / mint CTA | 14.66:1 |
| Dark text / pink sticker | 9.15:1 |
| Dark text / orange sticker | 8.95:1 |

All of these solid pairs exceed 4.5:1. This does not certify every composited/photo text region, hover state or browser-rendered view. Small labels have a 10px CSS minimum; body text and major hierarchy are larger. Final legibility, zoom and touch ergonomics still need visual review.

## Browser verification and screenshots: unavailable
The managed browser's `cua_repl.js` tool is not exposed in this session. No browser was installed, alternate control path improvised, preview server started, or screenshot fabricated. Desktop/mobile layout, keyboard journeys, focus rendering, actual reduced-motion behaviour, clipboard permissions and YouTube playback have **not** been verified in a real browser. There are no screenshots in this deliverable.

This follows the [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md): “If `cua_repl.js` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” The [managed preview reference](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/references/preview/managed.md) requires that tool and the managed preview daemon. This is an environment verification limit, not a passed check.

## Review checklist when a browser is available
1. Run `npm run dev`; open `/`, `/discover`, `/artists/nova-reign`, `/artists/nova-reign/room`, `/create` at 1440×1000 and 390×844. Also check 320px width and 200% zoom. Capture full-page screenshots of the five main views and the completed wizard.
2. Tab from the skip link through navigation and every control. Open/close mobile navigation. Verify visible focus, readable labels, no horizontal page overflow and useful focus after wizard stage changes.
3. Search `nova`, combine Bristol and Alternative R&B, switch collections, create an empty result and reset. Open every artist card; test browser back.
4. Enlist, confirm the +1 count, navigate to the room and back, undo enlistment, refresh and confirm reset.
5. Send a message, verify local attribution, test whitespace/280-character boundary and navigate between artist and room. Confirm another artist does not share the message.
6. Submit an empty wizard; test invalid handles and unsafe URLs; complete all stages, change imagery/accent, edit the preview and restart. Confirm no page is published.
7. Confirm no YouTube network request occurs before clicking Load. Then test consented playback, unload and fallback in a browser with and without third-party restrictions.
8. Enable reduced motion, verify no smooth scroll/transitions, and inspect contrast over photographs. Test clipboard allowed/denied paths.

## Review gate
Local implementation complete; browser evidence remains outstanding. Stop here for visual review. The next engineering milestone is accounts, persistent artist pages, explicit roles and real enlistment after the visual direction and infrastructure choices are approved.

## Addendum 01 validation update
`npm run lint`, `npm run typecheck`, `npm test` and `npm run build` were rerun for the customisation implementation. Lint has no errors/warnings; route generation and TypeScript pass; 11 tests pass; the production build generates 18 pages, including `/fans/jess-wav`. The unchanged master brief is accompanied by the user-supplied `STAN_ARMY_ADDENDUM_01.md`.

Seven additional named tests cover all six preset round trips and isolation; CSS/URL/enum/version rejection; SVG/external/forged/oversized raster rejection; preserved GIF animation metadata; aggregate image budgets; readable contrast fallbacks; per-profile/content separation; and mocked storage save/reload/cancel/reset/quota-denial behaviour (some checks share one named test). Theme persistence is verified with the same storage helpers used by the UI, not a browser refresh. Image decoding, file-picker interaction and localStorage availability in an actual browser remain unverified.

### Addendum visual/interaction review
1. On `/artists/nova-reign`, choose CUSTOMISE in owner or manager demo role. Select each preset and confirm the actual banner, identity, player, chat and posts remain usable.
2. Try the original animated GIF button, select Tile, then test cover/contain/natural sizing, all positions and fixed/scroll attachment. Select a local JPG, PNG, WebP and GIF. Test oversize, wrong-format and corrupt-file errors.
3. Change all colour roles, font, opacity, border and corners. Set text equal to panel colour and confirm the readability fallback. Set opacity to 0% and inspect solid chat/music/text backplates.
4. Add banner/avatar files, Save and refresh. Navigate to the focused room: it should use the same saved artist settings. Visit another artist and the fan page to confirm isolation.
5. Reopen, change preset, Cancel/Escape; check restoration and returned focus. Reset and Save; verify the original design returns and survives refresh. Simulate denied/full localStorage and confirm an announced save failure.
6. Switch to Visitor; Customise should disappear while View Clean/Custom and Pause/Play remain. Enlist/send a local chat message, switch clean/custom, and confirm the content/state remains.
7. Enable reduced motion; decorations should stop and animated uploads should disappear. Pause/Play should have the same effect when reduced motion is off. Static images should remain.
8. Open `/fans/jess-wav`; customise with the shared editor, inspect favourites and session-local enlistments. Use keyboard, 320/390/1440px widths, 200% zoom and a mobile software keyboard. Verify rail/sheet scrolling and essential controls.

See `THEME_ENGINE.md` for the precise limits, role simulation, persistence contract and acceptance matrix. Browser QA and screenshots remain unavailable for the same managed-tool reason documented above. No production authorization, backend or deployment has been added.
