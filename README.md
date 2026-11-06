# Stan Army — Milestone 1

**Product update:** [Fan-led pivot](STAN_ARMY_PRODUCT_PIVOT.md) supersedes conflicting ownership/business assumptions in earlier briefs. [Read the codebase audit and proposed implementation plan](docs/PIVOT_AUDIT_PLAN.md). The running prototype has not yet been restructured for this pivot.

Local visual prototype built from `STAN_ARMY_CODEX_BUILD_BRIEF.md`. The original master brief is unchanged. `STAN_ARMY_ADDENDUM_01.md` extends Milestone 1 with artist and fan visual customisation. Stop for visual review before accounts, persistence, realtime or billing.

## Run locally
Use Node.js 22.13+ (validated here with Node 24.22.1) and npm.

```sh
cd /workspace/stan-army
npm ci
npm run dev
```

Open http://localhost:3000. On another machine, use your cloned repository directory instead of `/workspace/stan-army`. No environment variables or external accounts are required.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The build uses webpack explicitly. The app uses Next.js App Router, TypeScript and Tailwind CSS v4. Photos and logo are local assets.

## Review these pages
- Landing: `/`
- Discovery: `/discover`
- Main artist: `/artists/nova-reign`
- Wider room: `/artists/nova-reign/room`
- Create Your Army wizard: `/create`
- Fan space: `/fans/jess-wav`

All six discovery cards open their own fictional artist page and listening room. Navigation works without any backend.

## Working demo interactions
Discovery combines text search, genre and location filters; collections sort/restrict seeded artists. Reset and no-results states work. STAN toggles a local enlistment and updates its count. Submitted chat messages append under `@you.demo`; messages and enlistment survive client navigation, then clear on refresh. A heart reaction is page-local. Copy link uses the clipboard when the browser permits it and provides an address-bar fallback. The wizard validates identity/bio/HTTPS link, lets you choose stock imagery/accent, and completes an editable preview without publishing.

No auth, database, cookies, realtime service, server uploads, billing, backend endpoints or production deployment. Saved profile themes and selected raster images use localStorage under profile-specific keys; community content remains in memory. Fan faces, artists, counts, posts, events and conversations are examples. External platform links are clearly labeled examples.

## My army, my rules — Addendum 01
Open any artist page or `/fans/jess-wav`, then choose **CUSTOMISE**. The demo-role selector simulates Artist/Fan owner, authorised manager (artists only), and Visitor; it is not authentication. Visitors see the clean/custom and motion controls, without the editor button.

Use the six-theme Grossness Library, colour pickers, retro font stacks, panel opacity/borders/corners, CSS decorations, background sizing/positioning/attachment, and banner/avatar file selectors. JPG, PNG, WebP and GIF are accepted at 512 KB per asset, 1 MB combined, up to 4096×4096. The original pixel-heart GIF button gives a ready-to-try animated example; select Tile for the full effect. Uploaded files remain in this browser.

Changes preview on the actual page. **Save theme** persists a validated, versioned JSON configuration locally; **Cancel** or Escape discards the preview; **Reset to default** previews the original design (Save to retain the reset). A browser storage failure is reported rather than claiming a save. Artist rooms share their artist's key; different artists and the fan space use independent keys. Clean view and animation pause are temporary visitor preferences, not edits to the saved theme.

**View clean / View custom** leaves content and local chat/enlistment state intact. Reduced motion always disables CSS motion and hides animated uploads; the pause control does the same. Uploaded PNG/WebP files are checked for animation markers, GIFs are treated as animated. Static uploads remain visible. Low-contrast text/links get readable colour fallbacks. Player/chat and text backplates stay solid while decorative panel backgrounds can be transparent. Retro fonts are system stacks and vary by device. Advanced CSS is a disabled preview; no arbitrary HTML/CSS/JavaScript or remote asset URLs are executed.

See [theme engine design](docs/THEME_ENGINE.md) for limits and the future database boundary. Desktop/mobile CSS is implemented, but browser verification and screenshots remain outstanding in this environment.

## Embed limitations
The music panel contains a public NPR Music sample, not a fictional artist’s track. YouTube’s privacy-enhanced iframe is created only after clicking Load sample video. That action contacts YouTube. Playback is individual and subject to browser/provider restrictions; no synchronization, autoplay or playback analytics. A watch-on-YouTube link is always available.

## Documents and validation
- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture and future Supabase boundaries](docs/ARCHITECTURE.md)
- [Conceptual database design](docs/DATABASE_SCHEMA.md)
- [Roadmap and review gates](docs/ROADMAP.md)
- [Asset provenance and licenses](docs/ASSET_SOURCES.md)
- [Validation results and review checklist](docs/VALIDATION.md)

Screenshots/browser QA are limited by the available managed browser tooling; see validation for an explicit status rather than assuming they passed.
