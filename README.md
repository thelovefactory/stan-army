# Stan Army — Milestone 1

Local visual prototype built from `STAN_ARMY_CODEX_BUILD_BRIEF.md`. The original master brief is unchanged. Stop for visual review before accounts, persistence, realtime or billing.

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

All six discovery cards open their own fictional artist page and listening room. Navigation works without any backend.

## Working demo interactions
Discovery combines text search, genre and location filters; collections sort/restrict seeded artists. Reset and no-results states work. STAN toggles a local enlistment and updates its count. Submitted chat messages append under `@you.demo`; messages and enlistment survive client navigation, then clear on refresh. A heart reaction is page-local. Copy link uses the clipboard when the browser permits it and provides an address-bar fallback. The wizard validates identity/bio/HTTPS link, lets you choose stock imagery/accent, and completes an editable preview without publishing.

No auth, database, cookies, localStorage, realtime service, upload, billing, backend endpoints or production deployment. Fan faces, artists, counts, posts, events and conversations are examples. External platform links are clearly labeled examples.

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
