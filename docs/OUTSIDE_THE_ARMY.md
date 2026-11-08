# Outside the Army — Instagram-first gallery

Updated 2026-11-08. Only this module changes. The surrounding Army page, feed, chat, placement and theme controls are untouched.

## Gallery design

A compact three-column gallery shows six square media thumbnails per page. Small video markers distinguish video thumbnails; arrows browse another six. There are no post captions, social counts, follow/comment buttons, native embeds, or provider scripts. Settings remain behind a small icon. Keyboard controls have visible focus, targets are at least 44px, and hover motion respects reduced-motion preferences.

The prototype uses **owner-only, explicitly labelled sample artwork** from existing project assets. Its title is “Gallery preview” and footer says “Sample media · not live”. Samples open their own local image/video files, never unrelated Instagram posts. They are not attributed to the configured account or hashtag. Visitors do not see simulated imported content: they see an honest unconnected state with an external source link. X is retained as a separate profile link, without an image-only X feed or widget.

## Simple source flow — no Instagram sign-in

Owners enter a public **@username**, Instagram profile URL or **#hashtag**, then save. This saves a source preference on this device; it does not fetch media or establish a live connection. There are no Instagram authorisation, password, professional-account conversion, or vendor-signup steps in the Army owner's flow.

Sources are canonicalised and validated. Executable/foreign URLs, credentials, tracking parameters, malformed handles and hashtags are rejected. The field is independent of legacy social profile/post links, which remain stored. Explicitly removed Instagram sources remain removed after refresh. Owner management permissions remain separate from verified identity. No channels/sources results in a hidden visitor module; owners retain setup access. Module visibility/accent/panel/outline settings still work.

Existing `stan-army:social:v1:<army-id>` storage is preserved, with an optional validated `gallerySource` field. Credentials, provider HTML, fetched media URLs, captions and assertions of connected status are never restored from browser storage.

## Live integration is not implemented

The desired live interaction is a thumbnail linking to its actual original social post, with no text or engagement controls in Stan Army. Live account/hashtag retrieval, media licensing/display rights, refresh, deletion handling, hashtag moderation and pagination require a suitable provider integration. Hashtag content should be approved before appearing; there is currently no import queue, approval system or auto-publishing path.

The gallery remains a design preview until Stan Army has a provider connection. It does not scrape Instagram, extract images from iframe HTML, reuse expiring CDN URLs, strip attribution from native embeds, or invent social posts. No backend, OAuth app, subscription, external widget or provider account was created.

## No-login provider investigation

Elfsight's current first-party documentation describes public Account and Hashtag connections **without Instagram login**, restricted to publicly accessible sources without age/country restrictions. This is a candidate for the requested owner experience, not a completed or approved integration.

- [Connection types and limitations](https://help.elfsight.com/article/1375-instagram-feed-connection-types-benefits-and-differences)
- [Public account/hashtag source setup and content filters](https://help.elfsight.com/article/130-step-1-set-the-source-of-your-instagram-feed)
- [Pricing and limits](https://elfsight.com/instagram-feed-instashow/pricing/)

Before selecting it, confirm permission to operate feeds across many independently managed Armies, programmatic source provisioning, branding/customisation, retrieval and media-use rights, moderation/deletion support and aggregate cost. A vendor's claim of public retrieval is not itself proof of Meta authorisation or a multi-tenant licence. No paid plan was purchased. Provider setup should belong to Stan Army, not individual Army owners.

Instagram's official account API and hashtag routes remain alternatives, but account types/permissions/limits make them distinct from a general public username input. X's standard display requirements require post text and attribution, so an image-only X feed is excluded unless appropriate permission is established.

- [Instagram Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/hashtag-search/)
- [X display requirements](https://docs.x.com/developer-terms/display-requirements)

## Validation

Unit tests cover safe account/hashtag inputs, canonical links, storage/legacy compatibility, preservation of original post links, explicit removals and rejection of forged connected-state data. Browser checks cover gallery pages, click-through sample links, settings/save/reload, visitor boundaries and narrow layouts. Live media retrieval is not represented as tested or working.

Latest checks: 38 unit tests, lint, TypeScript and production build passed. Chromium verified six valid thumbnails, video sample destinations, next/previous boundaries, account/hashtag saving and reload, invalid source rejection, preserved legacy post links, owner-only samples/settings, honest visitor state, removal persistence, no provider requests, 44px controls and no overflow at 320/390/800/1440px. [Desktop preview](screenshots/outside-gallery-desktop.png) · [Mobile preview](screenshots/outside-gallery-mobile.png).
