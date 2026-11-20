# Stan Army — Milestone 1

A local visual prototype built from [the master brief](STAN_ARMY_CODEX_BUILD_BRIEF.md). The repository originally contained only that brief; it has been preserved unchanged.

## Run locally

Requires Node.js 20.9+ (Node 24 used here).

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Start with `/army/nova` for the main design review, `/` for landing, `/discover` for discovery, and `/create` for the artist wizard. Production: `npm run build`, then `npm start`.

## What works

- Four responsive page types, four fictional artist rooms, mobile navigation and focus-room mode.
- Search by name, handle, genre or city; genre and collection filters; sorted sample enlistment counts.
- Tab-local STAN toggle, share-link copy with fallback, post reaction toggle and text-only demo chat composition.
- Four-step wizard with handle/provider validation, local image selection (JPG/PNG/WebP, 5 MB maximum), live preview, back/edit navigation and explicit demo completion.
- Click-to-load official Spotify sample embed and direct-link fallback. This is a third-party sample track, not music attributed to the fictional artist. Provider playback is account/region dependent and never synchronized.

## What is mocked / deferred

All artist identities, messages, posts and counts are fictional. Chat is not live. Local state clears on route unmount or refresh. Nothing is published by the wizard. No auth, server storage, APIs, realtime infrastructure, role enforcement, subscriptions or payment processing are implemented. Events, merch and exclusives are explicitly future-facing previews, not dead purchase controls. No streaming metrics or verified badges are fabricated.

The original hand-drawn logo attachment is missing from the restarted workspace. The plain navigation text is explicitly temporary, not a replacement logo. Reattach the original to integrate it faithfully. See [asset notes](docs/ASSETS.md).

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The tests exercise combined discovery filtering, sort immutability and hostile URL/handle validation. Browser acceptance steps are in [the review checklist](docs/DESIGN_REVIEW.md); they are not claimed as completed unless recorded in [validation](docs/VALIDATION.md).

## Product documents

- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Proposed database](docs/DATABASE_SCHEMA.md)
- [Roadmap](docs/ROADMAP.md)

**Review gate:** stop here for visual review. The next engineering milestone is accounts and persistent artist pages, only after design review. No production deployment has been made.
