# Stan Army — fan-led product specification

## Authority
`STAN_ARMY_PRODUCT_PIVOT.md` and the user's approved follow-up supersede conflicting ownership, identity and monetization assumptions in the original master brief and Addendum 01. Those source documents remain intact. Existing visual identity and working functionality are retained, with purposeful hierarchy changes; no wholesale reskin.

## The proposition
Stan Army is fan-led, fan-owned, fan-funded and fan-promoted. Every artist needs an army. Fans establish and steward the community; the artist is who they rally around. The artist need not sign up, approve or pay before an Army exists. "Fan-owned" means administrative stewardship within platform rules, not ownership of an artist's name, music, trademarks or other IP.

One canonical Army per artist is the initial model. Artist identity, founding fan identity, Army address, verification and payment are separate concepts. Official artist/representative participation never automatically grants community ownership, theme editing or moderation.

## Implemented local prototype
| Route | Purpose | Working local behaviour |
| --- | --- | --- |
| `/` | Fan-led proposition with existing Stan Army visual identity | Navigation, demo Army cards, creation CTA |
| `/discover` | Seeded fan-run communities | Combined search/genre/city filters, organic ranking, favourites, reset, no-match creation CTA with artist-name prefill |
| `/armies/nova` | Main exceptional demo Army for fictional artist Nova Reign | Compact artist/Army identity, prominent shared Music/Video player, fan content, chat, distinct publishing areas, enlistment, events/links and warm founder credit |
| `/armies/nova/room` | Wider fan listening room | Shared session chat/enlistment and saved Army theme |
| `/create` | Fan-led four-step onboarding | Find/select/add an artist; prevent seeded duplicates; validate Army address; choose image/preset, write welcome and optionally add a safe public music link; complete editable local preview and copy explicitly non-live invite text |
| `/official-access?army=nova` | Artist/representative request explanation | Local validation and request preview; no submission, verification or permission change |
| `/fans/jess-wav` | Founding fan's own expressive profile | Independent theme, artist favourites and session-local enlisted Armies |
| `/artists/[legacySlug]` and `/room` | Compatibility | Permanent redirects to corresponding Army routes |

Five other original Army fixtures remain for discovery/filtering and old-link compatibility; no new generic community pages were added. Echo Valentine is a catalogue identity without an Army, useful for exercising onboarding.

## The three visible identities
- Artist: Nova Reign, artist reference `@novareign` (fictional demo).
- Founding stan: Jess.wav, separate fan handle `@jess.wav`.
- Army: stable `army-nova`, intended address `nova.stan.army`, actual local route `/armies/nova`.

Public subdomains are illustrative and not provisioned. Copying the main Army link copies a working local route. No verified badge/status about a real person is claimed; the official participation fixture is conspicuously fictional.

## Two distinct announcement areas
**From the Army:** fan-administrator-controlled community welcome and announcements. Founder/admin simulation exposes its local composer; verified identity alone does not.

**From the Artist:** labelled official artist/authorised representative announcements. Only the corresponding fictional verified-role simulation exposes its local composer. Founder/admin status alone does not. Nova includes a clearly labelled sample artist message; other retained fixtures need no official participant.

New announcement text is React-escaped, limited to 500 characters, and page-local. Role attribution is captured when posted. Changing demo roles cannot turn an existing community post into an official post. No server authorization or moderation system is claimed.

## Customisation preserved
One versioned JSON theme schema and shared editor serve fan profiles and fan-run Armies. All six presets, raster/GIF selection, backgrounds, colours, retro font stacks, panel treatments, decorations and banner/avatar customisation remain. Only founder/admin simulation opens the Army editor. Moderator, official artist, official representative and visitor modes do not inherit editing rights. Clean/custom viewing and motion controls remain available to everyone.

Old `artist:<slug>` theme keys remain readable for their corresponding Army; a new Army-key save takes priority without deleting the old value. Fan keys are unchanged. Community content is separate from themes. No arbitrary HTML/JS/CSS or remote asset URL executes. See `THEME_ENGINE.md`.

## Creation and identity integrity
The creator acts as a fictional fan, never as the artist. Existing canonical matches lead to Visit & Enlist rather than a second Army. Adding an unlisted artist requires distinguishing details and carries a future conflict-review explanation. Address checks cover DNS syntax, reserved platform names, seeded conflicts and misleading official/verified claims. They are local demonstrations, not public uniqueness guarantees or reservations.

Official-access requests require a separate fan handle, public HTTPS evidence link and explanatory details. A real workflow will need identity/authority verification, reserved sensitive handles, disputes, expiry/revocation and auditable scoped grants. The prototype neither sends evidence nor grants status.

## Stewardship policy — approved boundaries
Inactivity is not automatically abandonment. Assessment must consider active moderators, continuing community care and reasonable absences. Notice, platform review, community continuity and an appeal route precede any involuntary stewardship change. The suggested 90-day/30-day periods remain provisional policy examples, not timers or implemented thresholds. No automatic ownership transfer is implemented.

Voluntary transfer requires explicit owner consent, recipient acceptance and a supported audited process. Founder attribution remains historical even if administration changes later. Verification, upgrades and promotional spend never transfer control.

## Funding and music
Army creation and enlistment are free. PRO $19/month and ELITE $59/month remain provisional Army upgrade concepts, optionally fan-funded; exact entitlements and collective funding rules are undecided. Professional tools may be paid separately, without buying ownership or identity.

FAN. THE FLAMES. is a future voluntary, transparent promotional-campaign concept. Paid inventory must be clearly labelled and separate from organic discovery. Moderation/approval, budgets, reporting, responsible payment handling and refunds are future requirements. No fake engagement, ranking manipulation or guaranteed streams. The prototype displays the concept only, with no payment UI or fabricated performance figures.

Music uses consented, permitted third-party playback with a fallback. The NPR sample is not Nova's catalogue. No copyrighted media is hosted, no synchronized playback is claimed, and verification does not establish media licensing rights.

## Remaining simulated / out of scope
All people, identities, counts, posts, conversations and events are fictional. Roles are an explicit UI simulation. Community activity and creation/request previews are in memory; only successful visual-theme saves persist locally. No accounts, database, global duplicate detection, DNS, real official access, moderation enforcement, transfers, payments, campaigns, ad delivery, exclusive-media hosting or deployment. Desktop/mobile browser journeys and screenshots remain unverified because managed browser tooling is unavailable.

## Living Fan Space — latest approved creative direction
The source `STAN_ARMY_LIVING_FAN_SPACE.md` and subsequent user clarification guide this revision: it need not look ugly or manufacture a crowd. A single stan should be able to leave a visible personal mark. Research links, original period screenshot and evidence/interpretation distinctions live in `research/MYSPACE_2003_2008.md`.

Nova remains the recognisable artist identity. An oversized founder panel no longer interrupts the artist-to-community hierarchy. The prominent fan feed has distinct fictional personalities and controlled note/photo/notebook/after-hours treatments, local composition, hearts and threaded replies. The sample-conversation switch supports a first-stan feed without sample hearts/replies on its sole founding note. Root-provider state keeps local contributions through client navigation; refresh clears them.

The compact communal shoebox/video previews lead to `/armies/nova/gallery` and `/armies/nova/videos`. Gallery filtering, original CSS print/keepsake visuals, stock photo provenance, native-dialog detail navigation and session-only saving work locally. Two real, original six-second silent typography videos play manually; they are not described as actual fan concert/cover footage. No real upload infrastructure or media hosting rights claims are introduced.

From the Army and From the Artist stay separate in an expandable notes area with their existing role simulation. Chat, music, events, membership/identity, all themes and preferences, clean view, pause and FAN. THE FLAMES. remain. Founder recognition is a warm bottom credit linking to Jess's own profile. Fan decorative treatments also respect clean view; actual authored artwork remains content rather than being erased. Fictional participation is labelled; no fake live activity or presence indicator is added.

## Turn up the music — current arrival hierarchy
The user source `STAN_ARMY_TURN_UP_THE_MUSIC.md` supersedes the oversized Nova artist-hero treatment. Keep the artist recognisable in a compact name/avatar/Army/count/enlistment area, then show THE ARMY PLAYER immediately, then participation. Remove the promotional FEEL IT TOGETHER banner from Nova. Saved custom banner assets are retained and may decorate the compact identity safely; no theme data is deleted.

One player supports local original audio, local original video and a consented approved provider example. MUSIC/VIDEO change mode on the same page; the video surface grows naturally, and compact/expanded and queue controls remain in the same component. Original synthesized sketches are not Nova tracks or commercial releases. Previous/next select within the mode; playback begins only by explicit Play. Local play/pause/stop/seek/volume/mute/repeat are bound to native media. Third-party playback remains governed by the loaded provider controls with a source fallback.

Four safe player skins use the existing live theme editor and save lifecycle: Classic desktop, Bubblegum Y2K, Quiet hours, Toxic chrome. `playerSkin` is an additive validated v1 enum; old preferences and key mappings survive. Clean view uses the restrained skin. Decorative pixels are labelled non-analytical, never a fake EQ or streaming statistic. There is no autoplay, production streaming, licensing platform, recommendations/voting, billing or new backend. All living fan-space features and ownership boundaries remain.

## Feed, stereo and s/Nova board — November 7 review
Nova’s main page now places fan posts in the left column and the supplied Spotify playlist above Army Chat on the right. Mobile places the compact stereo before the feed. The large introductory heading and its standalone fictional-content disclaimer have been removed; concise local-demo labels remain on actual interactions. The composer offers text, one image/GIF attachment, optional post style and Post. The member count opens the existing fictional fan directory rather than reserving a sidebar panel for it.

`s/Nova` is the chosen display name for a Reddit-inspired discussion board at the bottom of the Army page, with topic tags, expandable replies, Top/New sorting, vote toggles and local thread creation. The name is a product convention for this prototype, not a separate public route. Sample threads are fictional; user threads, votes and replies reset on refresh. No moderation or identity permission is inferred from voting or creating content.

### Composer clarification
The fan composer now follows familiar contemporary posting conventions: “What’s happening?”, separate labelled Photo and GIF upload buttons, an attachment preview/removal control, character count and Post. Presentation choices (Plain/Notebook/After hours) are removed from composing; new posts use the default note style. Existing seeded post designs and saved profile themes remain intact. No nonfunctional poll, scheduling or audience controls are displayed.

### Polls and theme-aware composing
The composer additionally offers Poll with 2–4 distinct choices (up to 80 characters each); the main text becomes the question. Polls and image attachments are alternatives. Posted polls accept one local choice, allow changing it, and show percentages for that local vote only. No fabricated aggregate results or live closing times are shown. All poll content and voting are demonstrations that reset on refresh; votes also reset if the poll component is remounted.

Composer background, entered text, caret, placeholder, labels, attachment controls and Post use the profile’s validated colour pairs. The editing panel stays opaque so readable contrast is maintained over patterned/GIF backgrounds even when other decorative panels are translucent. Saved customisations are unchanged.

## Artist discussions, communities and My Boards
The current canonical artist board naming is lowercase `s/<army-slug>` (for example `s/nova` at `/s/nova`). Each seeded Army has its own artist board, embedded in its Army page and available as a separate discussion page with a link back to the Army. Wider music communities are independent `com/` boards: `/com/popmusic`, `/com/disco`, `/com/2000s`, `/com/musicvideos`. Artist discussions use mint, communities use pink; both use the same thread creation, topic labels, sorting, reply and vote experience. Armies, Army Chat and boards remain distinct.

`/boards` is the shared exploration and My Boards page, linked in desktop/mobile navigation. Users can save/remove either kind from board headers or cards, and revisit favourites via My Boards links on board pages. My Boards persists on this browser/device; it is not an authenticated account collection. Threads/replies/votes are scoped by board, survive client navigation, and reset on refresh. These changes supersede earlier documentation describing s/Nova as display-only or all non-theme settings as nonpersistent. The guiding principle is “Your Army is where you belong. Your boards are where you explore.”

The feed poll now has a visible ×, Cancel poll and Escape dismissal; all preserve the post text even when choices are blank. GIF opens an inline GIF/emoji picker instead of a file dialogue. Emoji inserts at the text cursor. Two original demo GIFs can be searched/attached; still previews respect motion preferences. Searching on GIPHY is an explicitly external link, not an integrated results feed or GIF import. Photos retain the file picker. Polls and image/GIF attachments remain alternative post types.
