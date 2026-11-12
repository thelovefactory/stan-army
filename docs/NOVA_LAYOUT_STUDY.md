# Nova — alternative Army layout

Review `/nova-preview` beside the unchanged `/armies/nova`. This is an isolated design study, using Nova's existing artist, founder, post, discussion and sample chat content to make the layout comparison useful. It creates no new Army, account or backend.

## Layout decisions

- A graphic cover expresses community identity; the identity row explains the Army, its host and how to join. The community title remains the only h1. Host credit does not compete with the community.
- The first visit leads with a real sample community contribution rather than an empty form. The composer expands when requested and moves above the feed after joining.
- A larger feed has photographic, editorial-note, late-night and fan-art treatments. Consistent author/action placement keeps their interactions familiar. Text and artwork use different space without giving every supporting item a large panel.
- Pale mint connects composer and chat; violet identifies primary actions. Structural spacing, labels, readable fields and 44px primary controls remain consistent.
- Army, Discussions and About are distinct views. Section navigation remains available while scrolling; mobile has a direct chat shortcut. The discussion view uses reading-focused rows, search/sort and minimal secondary actions.
- Music is a compact working local audio player. The host's welcome is an editorial note, and the illustrative event is a small calendar row. No empty or unconnected social module is inserted just to fill the sidebar.
- The page ends with the existing invitation to create an Army, so an arriving visitor need not see the homepage to discover that option.

## Boundaries and behaviour

All styling is in a CSS module under this page. The original Nova page, shared header/footer, existing CSS, data, theme schemas, saved themes, social settings and other routes are unchanged. The isolated poster font has a unique family name and uses the existing local Anton file. No third-party scripts or new assets are fetched.

Join, posting and chat reuse Nova's existing in-memory demo context. Local posts/chat can consequently be visible when navigating between the two views of the same Army, but reset on refresh. Study post likes/saves/replies use separate keys. Joining is a demo participation affordance, not authentication. Write/reply/send actions consistently require joining within this study. Discussions reuse the existing Nova board store; My Boards continues saving to its existing device-local key. No personal follower counts or verification privileges are introduced.

The design study does not reproduce the full customisation editor, media-upload tools, official-post controls or full Army Player. They remain available on the original page. This is a reviewable alternative layout, not a completed migration of Nova to a new theme system.

## Validation

Existing 38 tests, ESLint, TypeScript and the production build pass. Browser checks cover join, composer, posts, likes, bookmarks, replies, chat, audio play/pause/seek availability, post sorting, discussion search/voting/replies/creation/My Boards, About, mobile chat navigation and all three views at 320/390/768/800/1024/1440px. The original Nova's computed styling and saved theme were compared before and after visiting the study and remained unchanged. No browser runtime errors were observed.

Production smoke checks also passed: `/nova-preview` returns HTTP 200, joining works, long unbroken discussion titles remain contained at 320px, and no runtime errors were observed. [Desktop](screenshots/nova-layout-study-desktop.png) · [Mobile](screenshots/nova-layout-study-mobile.png) · [Discussions](screenshots/nova-layout-study-discussions.png).
