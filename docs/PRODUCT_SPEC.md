# Product specification

Authority: `STAN_ARMY_CODEX_BUILD_BRIEF.md`, plus the user's approved balanced-nostalgia plan and supplied mood visuals. The brief wins where references show future functionality.

## Confirmed

Every artist needs an army. The heartbeat of every artist is their community. Artist-to-fan and fan-to-fan relationships both matter. Fans enlist free in multiple Armies; artists own expressive community pages; invited managers can oversee multiple artists. Admins moderate and curate. Editorial favourites are never paid placement.

Nearly black canvas, white bold type, mint/blue/magenta/orange accents, original hand-drawn logo, large photography, asymmetric rounded panels and playful personality. MySpace influence comes through personal spaces and community modules, with modern mobile use, keyboard navigation and reduced motion. Artist pages make music and Army Chat the heart of the experience.

## Milestone 1 delivered behavior

- Landing: promise, both core CTAs, community explanation and demo artist discovery.
- Discovery: editorial/new/most-stanned collections, combined search and genre filters; empty/reset state.
- Artist room: fictional artist identity, imagery, sample count, local STAN/share actions, approved provider embed, prominent demo chat/pin, local message composition, public post/reaction and clearly future-facing event/merch/exclusive panels. Focus mode expands listening and chat.
- Wizard: identity, imagery/bio, music URL and preview; no account or public publishing. Draft remains only in memory. Image selection never uploads.
- Loading, not-found and unexpected-error routes. React renders user text without raw HTML.

## Assumptions / design decisions

NOVA and three additional artists are fictional; photography represents them for layout review only. Brand text is temporary pending recovery of the original logo asset. One local artist photo represents the visual identity in the wizard; separate avatar/banner controls arrive with persistence. New Artists uses reverse fixture order; sample statistics are not real rankings. No arbitrary page CSS/customization editor in v1.

## After design approval

Real passwordless/Google/Apple auth where supported, internal user identity, fan/artist/manager/admin permissions, invite-based roster management, server-validated links, owned media uploads and actual enlistment. Later: real persistent chat, moderation, entitlements, reporting and truthful analytics. Battleground and billing remain deferred and separately approved. Never claim cross-user synchronized provider playback.

Acceptance requires visual review of desktop/mobile layout and a clear distinction between local demonstrations and real account/community features. The user has approved the direction, not yet the implemented design.
