# Stan Army — Product specification

## Authority and review gate
Confirmed requirements come from the unchanged root `STAN_ARMY_CODEX_BUILD_BRIEF.md` and the current Milestone 1 request. The current request narrows the master brief: local prototype only; stop for visual review before backend development. No backend resources, migrations, API endpoints, account system, persistent community storage, payment flow or deployment are part of this deliverable. Addendum 01 explicitly authorises browser-local persistence for visual themes only.

## Confirmed product direction
Every artist needs an army. The heartbeat of every artist is their community. Music and conversation should have equal visual weight. Balance personal MySpace-style expression with modern navigation, readable text, responsive layouts, visible keyboard focus and reduced-motion support. Preserve the user’s hand-drawn logo as an image; no generated artist imagery.

## Milestone 1 routes and acceptance
| Route | Intended experience | Local interaction |
| --- | --- | --- |
| `/` | Brand introduction, artist discovery, community proposition | Working navigation and artist cards |
| `/discover` | New artists, Most stanned, Our favourites | Search by artist/handle/genre/city, combined genre/location filters, reset and empty state |
| `/artists/[slug]` | Banner, identity, count, media, Army Chat, pinned message, posts, fan faces, events, external links | Reversible enlistment, local message composition, copy army link, post reaction |
| `/artists/[slug]/room` | Wider media-and-chat view | Same session-local chat, click-to-load media |
| `/create` | Four-step artist setup | Identity validation; bio, stock image and accent selection; optional HTTPS link; editable preview, completion and restart |

Every identity, conversation, event, post and count is fictional. Photography represents illustrative people and performances, not the fictional artists. Demo content is labeled across landing, discovery, artist and room views. No verified badges. No real online-user count, streaming statistics or synchronized-playback claims.

## State and expected behaviour
Enlistment, submitted chat messages and reactions change the interface only. Enlistment and submitted chat messages survive client navigation through the shared provider and reset on refresh. Likes reset when their page unmounts. Composer drafts reset on navigation. Wizard state remains while the wizard is mounted and resets on refresh or leaving the route. Community content does not use localStorage, cookies or a server database. Addendum 01 visual themes and their selected image data are saved to namespaced localStorage keys. Text is rendered through React escaping.

Messages must contain non-whitespace text and are limited to 280 characters. A blank composer disables Send. A new message is visibly attributed to `@you.demo` and acknowledged as local only. Messages do not reach any other person.

Wizard rules: artist name 2–60 trimmed characters; handle 3–30 lowercase ASCII letters, numbers and hyphens, starting with an alphanumeric character; biography 10–300 characters; optional HTTPS link without credentials. Handle uniqueness is not checked. Completion displays a local preview, never a publish button or a fabricated public URL. Stock selection stands in for uploads.

## Media and external links
One fixed public YouTube example is loaded using the privacy-enhanced iframe after an explicit click. It is labeled third-party sample content, not the fictional artist’s catalogue. Loading contacts YouTube; browser privacy, geography, provider restrictions and owner embed settings can prevent playback. No autoplay or playback synchronization. A persistent watch-on-YouTube link is the fallback. No music is hosted. Bandcamp and NPR links are platform examples, not claimed artist profiles.

## Assumptions awaiting review
- Nova Reign and five other fictional artists establish the first content set.
- Blue is the primary action colour; mint anchors music and community; pink and orange provide personal sticker details.
- Generic UK/EU locations, illustrative events and free enlistment demonstrate the intended shape.
- The creation wizard uses stock image choices; Addendum 01 profile editors additionally support browser-local raster selection. Typography uses local system fonts to avoid network dependencies.
- This prototype’s desktop content hierarchy puts media on the left and chat in the wider right column; mobile stacks media, chat, fans and posts.

## Out of scope until later milestones
Auth, real roles and manager rosters, image uploads, persistent artist pages, real enlistment, realtime chat, moderation, access-controlled posts, notifications, subscriptions, Battleground voting, analytics and production privacy/legal workflows. Future pricing remains provisional ($19 Pro / $59 Elite in the master brief), with no pricing or billing UI in this milestone.

## Visual review questions
Does the artist page feel personal enough without losing usability? Is Army Chat prominent enough? Does the nostalgia/modern balance fit? Review desktop and mobile before approving accounts and persistence.

## Addendum 01 — confirmed in this milestone
The root `STAN_ARMY_ADDENDUM_01.md` is part of the specification. A shared live visual editor customises existing artist pages, their listening rooms, and `/fans/jess-wav`. Six presets: Glitter Bomb, Scene Queen, Burning Desire, Digital Dream, Cyber Trash, Blank Canvas. Settings include raster/GIF backgrounds, cover/contain/tile/natural sizing, positioning and fixed/scroll attachment; six colour roles; six system font stacks; panel colour/opacity/border/corners; original animated CSS decorations; custom banner/avatar imagery.

Save persists versioned JSON per profile in localStorage. Cancel and Escape discard drafts. Reset previews defaults, with an explicit Save required to persist. Visitor clean/custom and pause controls preserve all content. The editor is available only in simulated owner/manager views; real role authorisation remains Milestone 2. Reduced motion hides animated uploads and stops CSS animations. Text contrast and opaque core surfaces are protected. Advanced CSS is disabled, with a token preview only.

Fan space includes a fictional biography, licensed imagery, favourites, and the actual session-local enlistment list. It uses the same schema/editor as artist pages. See `THEME_ENGINE.md` for asset limits, migration and acceptance evidence.
