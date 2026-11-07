# Outside the Army — prototype and feasibility

Reviewed 2026-11-07. This is a small external-content window below Army Chat, not a second posting feed. Nova is seeded with the two user-supplied profile links: Instagram `aaaaaaarmii` and X `indiscowetrust`. They are test links, not verified affiliations with the fictional Army. Other Armies start with no social accounts. No posts, timestamps, captions or engagement numbers are fabricated.

## What is implemented

- Enabled/hidden using **Customise → Tools for your Army → Outside the Army**. This remains independent of chat, music and other modules. If chat is hidden, the social window still works in the sidebar.
- **Manage channels** is available only to the existing simulated founding-stan/community-admin roles. A verified artist, representative, moderator or visitor does not acquire configuration rights.
- One Instagram and one X profile per Army. Enter a supported HTTPS profile URL to add or explicitly replace that platform's entry; remove either entry individually. Handles and canonical URLs are validated, including after storage restore. Credentials, arbitrary embeds, post HTML and unsupported domains cannot be submitted.
- Links save independently to `stan-army:social:v1:<army-id>` on this device. Removal (including removing all channels) survives refresh. Failed writes leave the existing configuration unchanged. The UI explains that links are not authenticated account connections.
- Presentation uses the existing theme editor: inherited Army accent or a separate validated accent, panel/outline treatment, existing theme corners and guarded text colours. Text is Arial like the other interface controls. The module uses an opaque panel surface for readable external links even on wild wallpaper; post artwork is untouched.
- Instagram and X request no provider resources until a visitor chooses **Load … preview**. Only one preview is open at once, with a 280px viewing area. Close removes its embedded content; providers' scripts, cookies and prior requests cannot be undone by closing, and the loaded X library may remain until reload.
- A source profile link is always available, including after failure. Official previews keep their platform attribution and original post links. Any visible post text, image, order and timestamp come from the provider; Stan Army does not extract or repackage them.

## Supported routes and authentication boundaries

| Route | What it can do | What it cannot establish here |
| --- | --- | --- |
| Instagram public profile embed | Display Instagram's own profile card/post thumbnails when the account allows embedding | Guaranteed availability, arbitrary personal/private-account retrieval, chronological ordering, all captions or timestamps |
| Instagram oEmbed | Generate a frontend embed for supported public content; current official documentation lists profile URLs | An enumerable latest-posts API; the supplied profile's oEmbed rejection must not be treated as proof the direct profile embed fails |
| X official profile timeline | Request the public timeline using `widgets.js` and `twttr.widgets.createTimeline`, with documented sizing/chrome options | Guaranteed posts for this account/session, server-side post data, consistent chronology or a Stan Army refresh guarantee |
| Instagram API with Instagram Login (future) | Read authorised professional account media under the appropriate permissions | A general authenticated feed for any personal account simply from its username |
| X API user-posts endpoint (future) | Retrieve structured user posts with bearer-token/API access | Free/unrestricted access or access without a developer configuration and applicable product entitlement |

The profile embeds need no Stan Army authentication or backend credentials. Meta announced tokenless public oEmbed access on 2026-06-15; do not use old guidance that universally requires an app token/App Review for those embed calls. Authorised account-media retrieval is a separate integration. No paid plan, OAuth connection, developer app, credential, migration or endpoint was created.

## What can update

Reopening a preview requests the provider's current response. Stan Army does not poll, cache, synchronise or promise latest/live posts. Refresh behaviour inside an official widget is provider-controlled. X documents special fixed-post-count embeds as not polling; this implementation uses a bounded-height profile timeline, not that fixed-count mode. A future curated feed with predictable refresh, own card rendering and reliable timestamps needs an API-specific design, authorisation, rate/billing limits, caching/deletion rules and server-side secrets.

## Direct findings from the supplied accounts

- Instagram `/aaaaaaarmii/embed/`: HTTP 200. A real Chromium probe, using the cloud proxy's supplied CA, displayed the profile identity and actual post thumbnails. [Review screenshot](screenshots/outside-army-instagram.png). This is provider content, not demo fixture content.
- Meta's v26.0 oEmbed call for the same profile returned error code 100/subcode 2207047 (“not embeddable media”). Consequently oEmbed is **not** used as a runtime gate; the direct, working profile embed is retained. No inference about private-account status is made from that error.
- X publish/oEmbed recognised the supplied profile and returned timeline markup. The real browser loaded the official widget and timeline resources with HTTP 200, but `createTimeline` yielded no visible timeline. The UI displayed its unavailable state and retained the profile link. **No real X posts or timestamps were verified.** This may vary by provider/account/session; HTTP success alone does not prove content availability.
- The first browser probe failed the environment proxy CA trust check. It was repeated through the configured proxy, trusting only the supplied CA's SPKI, before making the observations above. No TLS exceptions are added to the application.

## Terms and content handling

Official provider embeds are the feasible initial path, subject to platform terms, public-account/embed settings and provider availability. No scraper, private API, third-party feed service, automated login or access-control workaround is included. Provider HTML is not accepted from owners, injected through `dangerouslySetInnerHTML`, or stored. No social post contents are persisted or used for analytics. This is an implementation boundary, not a blanket legal clearance for all future uses. Official widget internals remain provider-owned and cannot be freely restyled to mimic a Stan Army post.

## Official sources

- [Instagram oEmbed documentation](https://developers.facebook.com/docs/instagram-platform/oembed/) — fetched directly with the workspace HTTP client; public content and embed restrictions, profile URL formats and frontend-only use.
- [Meta: Tokenless Access to Meta oEmbed APIs](https://developers.facebook.com/blog/post/2026/06/15/tokenless-access-to-meta-oembed-apis/) — current authentication change confirmed from the official page.
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) — professional accounts and `instagram_business_basic` permission; distinct from public embeds.
- [X embedded timelines](https://docs.x.com/x-for-websites/timelines/overview) — profile timelines, sizing/chrome options, attribution and refresh limitations.
- [X widget initialisation](https://docs.x.com/x-for-websites/javascript-api/guides/scripting-loading-and-initialization) — dynamic page initialisation.
- [X user posts API](https://docs.x.com/x-api/users/get-posts) — bearer-token structured retrieval.

Some Meta pages were throttled through web search; the official pages above were successfully fetched by the workspace HTTP client. No unofficial mirror is treated as authoritative.
