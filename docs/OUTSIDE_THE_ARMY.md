# Outside the Army

Updated 2026-11-08. An optional external-post window below Army Chat. Only this module changes; the surrounding Army layout, other modules and theme controls remain unchanged.

## Single-post tile

- One Instagram or X post is visible at a time. No profile grids or profile timelines.
- Compact account link and platform-icon selectors above the post. Previous/Next arrows, position, original-post link and close control below it. No visible module heading, subtitle, divider stack, duplicate attribution, or explanatory copy around loaded content. The module retains its accessible name.
- Instagram uses its individual captioned post embed. Both artwork and caption come from Instagram. The iframe accepts bounded height measurements only from its exact window and Instagram origin. X uses its individual-post widget. Native attribution, controls, sign-in restrictions and availability remain provider-owned; Stan Army cannot freely restyle or remove them.
- External resources load only after **Load … post**, with a short cookie notice before loading. Switching channels or closing removes the displayed embed. Prior requests/cookies cannot be undone; the X library may remain until reload.
- Unavailable posts show a short status and retain the original link. Channels with no selected posts show a profile link, without loading a grid or timeline. No posts, captions, timestamps or engagement data are invented.
- With no channels the module is hidden for visitors. Owners retain setup access. The existing Customise module toggle and accent/panel/outline settings still work.

## Owner controls and persistence

A small settings icon opens **Manage channels**. Only simulated founding-stan/community-admin roles can manage it. Official identity does not grant management permissions.

One supported HTTPS Instagram and one X profile per Army, with up to 12 public post URLs each, newest first. Add, Edit, replace or remove channels; edit the list to change or clear selected previews. X post URLs must match the configured handle. Instagram post URLs do not encode the author, so the owner must confirm ownership; the actual embed supplies attribution. No arbitrary iframe HTML, credentials, external domains or tracking query parameters are accepted.

Configuration remains local to this device under `stan-army:social:v1:<army-id>`. Legacy links and theme settings are preserved. Failed writes do not overwrite existing configuration. This is not OAuth or a production permissions system.

Nova's supplied Instagram profile `aaaaaaarmii` has two manually selected public image-post links (`DfH7u8RqpCh`, `DdjE56sq0Qy`), identified in that profile's official embed. These are sample selections, not an automatically refreshed feed. Old Nova settings for that exact profile inherit them only when the `posts` field is absent; an explicitly cleared list is respected. X `indiscowetrust` remains a supplied test profile with no invented post links. Other Armies start with no channels.

## Automatic feeds remain a separate integration

Individual public embeds require no Stan Army API credentials. Automatic Instagram media retrieval requires an authorised Business/Creator account, appropriate permissions and approval where required. Automatic X retrieval requires developer/API access with applicable costs and limits. Neither integration is implemented. No scraper, unofficial API, automated account login, server-side post cache, or paid provider was introduced.

Older/Next browsing currently traverses the owner's selected links, not an unlimited historical archive. Caption and media presentation remain native; rendering our own image-and-caption cards requires approved API access.

## Sources

- [Instagram oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed/)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/)
- [X individual post widgets](https://developer.x.com/en/docs/twitter-for-websites/embedded-tweets/overview)
- [X user posts API](https://docs.x.com/x-api/users/get-posts)

## Validation

Unit tests cover safe URLs, bounded lists, persistence, theme compatibility and non-destructive legacy migration. Browser checks cover one-post rendering, channel switching, next/previous boundaries, source links, saving/reloading, role-restricted settings, empty-channel visibility and narrow layouts. Browser fixture tests are isolated from shipped content; live provider probes are reported separately because availability can vary.

Latest validation: all 36 tests, lint, TypeScript and production build passed. Chromium passed single-frame navigation, source links, refresh, permissions, empty-state and 320/390/800/1440px layout checks. A separate live browser probe confirmed both selected Instagram images and their actual captions render, with provider height measurement working. Instagram's native header, engagement links and comment-link field remain visible within its embed; this limitation is not represented as a fully custom image-only renderer. X still has no verified test-post content and is not presented as a live feed.
