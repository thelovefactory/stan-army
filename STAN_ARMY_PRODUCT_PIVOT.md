# STAN ARMY — PRODUCT PIVOT & ARCHITECTURE UPDATE

## Context

We've refined the Stan Army concept since the original build brief. The existing Milestone 1 prototype is a strong visual foundation, and **we do not want to throw it away or redesign it from scratch**.

Keep the existing brand identity, design system, landing page aesthetic, discovery layout, fan profiles, customisation controls and overall visual direction.

However, the product model needs an important correction.

## 1. The fundamental idea

**Stan Army is a fan-led, fan-owned, fan-funded and fan-promoted music community platform.**

**Every artist needs an army.**

Fans create Armies for the artists they love. They build the community, recruit other fans, customise its appearance, share music, organise activities and help their artist reach new audiences.

Artists don't need to sign up, approve the community or pay for anything before their Army can exist.

This is not another artist-controlled fan club or an artist marketing dashboard.

**The fans build the Army. The artist is who they rally around.**

Here, "fan-owned" means community stewardship and administrative control within Stan Army's rules. It does not mean ownership of the artist's name, music, trademarks or intellectual property.

## 2. Armies belong to fans

Anyone can start an Army for an artist who doesn't already have one on the platform.

For example:

- A Britney Spears fan creates Britney's Army.
- The Army lives at `britney.stan.army`.
- That fan becomes the founding administrator.
- Other fans enlist, participate and help grow the community.
- The founder controls the community's design, content organisation and moderation, subject to platform rules.

The artist does not automatically gain ownership of the Army if they join.

For Milestone 1, assume one canonical Army per artist, with a clear policy for duplicate artists, founder inactivity, moderation and ownership transfers. Do not allow users to create confusing duplicate official-looking communities.

## 3. Separate Army addresses from artist identities

This distinction is essential.

**Army address:** `britney.stan.army`

**Official artist handle:** `@britneyspears`

**Founding fan handle:** `@britneysnumber1fan`

These are three different things.

The Army subdomain identifies the fan-run community.

The official artist handle identifies the verified artist.

The fan handle identifies the person who founded the community.

Fans may create an Army for Britney Spears, but they cannot impersonate Britney Spears or claim the official artist identity.

Design the architecture around separate entities for users, artists, Armies, Army memberships and verified artist/representative relationships.

Artist identities must be verified before official status is granted. Reserve sensitive handles and implement an identity-dispute process.

## 4. Artist and representative participation

Artists and their authorised managers or labels can request verified access to an existing Army.

Introduce two special identities:

**OFFICIAL ARTIST** — The verified artist.

**OFFICIAL REPRESENTATIVE** — An authorised manager or label representative.

These users may receive specific permissions to publish official announcements, interact with fans, host events and eventually share exclusive content.

They do not automatically take over community administration.

The founding stan remains the community owner unless an explicit, platform-supported transfer occurs.

An artist's verified identity should be portable across the platform.

## 5. Update the onboarding flow

The existing onboarding currently assumes the person creating an Army is the artist.

Change this.

The primary action remains:

**CREATE YOUR ARMY** or **START AN ARMY**

Suggested flow:

**Step 1 — Who are we starting an Army for?**

Search for an existing artist or add an artist not yet listed.

**Step 2 — Claim your Army's address**

Suggest an appropriate subdomain, for example `britney.stan.army`.

Validate availability, reserved names and potential conflicts.

**Step 3 — Make it yours**

Customise the Army's appearance, choose an initial theme, add imagery and write a welcome message.

**Step 4 — Rally the fans**

Preview the Army, create it and invite the first members.

The founding fan's own account and handle are separate from the artist's identity.

Include a secondary route for artists:

**ARE YOU THE ARTIST? REQUEST OFFICIAL ACCESS**

This should initiate verification, not create an artist-owned community.

## 6. Update discovery and empty states

Retain the existing discovery design.

However, the messaging should encourage fans to create communities rather than imply artists must create them.

Replace:

"Artist? This could be your space."

With something closer to:

**CAN'T FIND YOUR ARTIST? START THEIR ARMY.**

If someone searches for Britney Spears and no Army exists, show an invitation:

**Britney doesn't have an Army. Yet.**

**Every Army starts with one fan. Could that be you?**

Provide a CTA to start the Army with the searched artist name prefilled.

Keep discovery rankings organic and distinguish paid promotions clearly.

## 7. Community customisation is fundamental

Keep the existing visual customisation editor and fan-profile features.

The main Stan Army platform should remain polished, clear and consistent.

Individual Armies, however, should be able to develop radically different identities.

Think early MySpace: expressive backgrounds, colours, fonts, stickers, animated imagery, layouts and personality.

We want the internet to feel individual again.

Retain **VIEW CLEAN**, animation controls and safe, scoped customisation. Do not permit arbitrary user JavaScript or unsafe HTML/CSS.

Eventually fan profiles should have similarly expressive customisation.

## 8. FAN. THE FLAMES.

This is our fan-funded promotional concept.

**FAN. THE FLAMES.**

Fans can voluntarily contribute money to promote their favourite artist beyond their existing community.

For example, Britney's Army could pool money to run a promotional campaign encouraging people to discover her music.

The concept is about fans actively championing the artists they love.

Plan for:

- Transparent campaign goals and budgets.
- Optional individual contributions.
- Clearly labelled paid placements across eligible Stan Army inventory.
- Campaign performance reporting.
- Moderation, approvals, refunds and responsible payment handling.

Never sell fake engagement, manipulated organic rankings or guaranteed streams.

This can be a later milestone. For now, establish the product concept and leave architectural room for it.

## 9. Subscription model

Armies are free to create and join.

Free Armies may display unobtrusive, clearly labelled, artist-relevant advertising.

Fans can optionally fund premium upgrades to their Army, either individually or collectively.

Initial provisional tiers:

**PRO — $19/month**

**ELITE — $59/month**

Premium features may include ad removal, enhanced customisation, community tools, promotional inventory control and a defined allowance of promotional credits.

Managers and labels may also pay for verified professional tools, but paying does not grant ownership of fan-created Armies.

Subscription payment, community ownership and artist identity must remain separate concepts.

Do not implement billing until the underlying model and entitlements are agreed.

## 10. Music and future exclusives

For the initial build, use official music embeds where permitted, including Spotify and other supported providers.

Do not host copyrighted music without the appropriate rights.

In future, verified artists and record labels may partner with Stan Army to provide licensed exclusive tracks, early listens, demos, premieres and special fan experiences.

Design music modules to be extensible, but do not implement exclusive media hosting or promise synchronised playback without the necessary technical and licensing foundations.

## 11. What to do now

**Do not restart the project. Do not redesign the existing interface.**

First, audit the current codebase against this revised product model.

Then:

1. Identify where the current implementation incorrectly assumes artist ownership.
2. Propose the smallest architectural changes needed to separate artists, fan accounts and Armies.
3. Update onboarding copy, discovery CTAs and empty states.
4. Plan subdomain routing using `artist.stan.army`, with a local-development fallback.
5. Define the verified artist and representative access model.
6. Preserve existing working functionality and visual customisation.
7. Prioritise building one compelling, fully customisable, fan-run demo Army.

**Before making major structural changes, report your proposed implementation plan and any decisions that need clarification.**

## The principle to remember

Stan Army is not a platform where artists collect fans.

**It's a platform where fans come together to champion artists.**

The artist is the reason the Army exists.

The fans are the reason it comes alive.