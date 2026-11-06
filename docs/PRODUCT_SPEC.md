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
| `/armies/nova` | Main exceptional demo Army for fictional artist Nova Reign | Celebrated founder Jess.wav, distinct address/artist/fan identities, enlistment, media, chat, two announcement areas, posts/reactions, fan event and links |
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
