# STAN ARMY™ — ADDENDUM 01

## MY ARMY, MY RULES.

Customisable Artist & Fan Profiles — Milestone 1

## Objective

Bring back the creative freedom, personality and glorious visual chaos of early MySpace.

Every artist should be able to make their Army page feel like their own world. Every fan should eventually be able to do the same with their personal profile.

This functionality must be incorporated into the current visual prototype, not deferred to a future release.

## 1. CUSTOMISE YOUR ARMY

Introduce a prominent CUSTOMISE button visible to the artist or authorised manager when viewing their own Army page.

Opening it launches a visual editor with a live preview.

Artists can customise:

- Backgrounds: Upload JPG, PNG, WebP or animated GIF backgrounds.
- Background behaviour: Tile, cover, contain, centre, fixed or scrolling.
- Colours: Background, text, links, buttons, borders and accent colours.
- Typography: Choose from a curated collection of fonts, including some gloriously questionable retro options.
- Panels: Adjust opacity, background colours, border styles and corner treatments.
- Decorations: Add animated stickers, hearts, stars, flames, glitter and other nostalgic web graphics.
- Banners: Upload custom artist headers and profile imagery.

Include a RESET TO DEFAULT option.

## 2. THE GROSSNESS LIBRARY

Build a collection of optional preset themes inspired by early-2000s internet culture.

Initial themes:

- Glitter Bomb: Pink, sparkles, animated hearts.
- Scene Queen: Neon colours, checkerboards, chaotic typography.
- Burning Desire: Flames, chrome, black and red.
- Digital Dream: Butterflies, stars and soft gradients.
- Cyber Trash: Acid green, pixel graphics and industrial textures.
- Blank Canvas: The original Stan Army design.

These should feel expressive and deliberately imperfect, not like polished corporate website templates.

Use locally created CSS patterns and licensed or original decorative assets. Avoid pulling copyrighted artwork from random websites.

## 3. LIVE CUSTOMISATION

Changes should appear instantly in the artist page preview.

Provide SAVE, CANCEL, and RESET controls.

For the first prototype, settings may be persisted in local storage or a mock profile configuration. Structure the data so it can later be saved to the database per artist.

## 4. ADVANCED MODE

Include a future-facing Advanced CSS section in the editor.

For Milestone 1, this can be a disabled preview or a restricted set of CSS custom properties.

Do not execute arbitrary HTML, JavaScript or unsanitised CSS supplied by users.

The eventual advanced editor should be scoped to the artist's profile and protected against security, privacy and usability issues.

## 5. FAN PROFILES

Create a basic fan profile prototype using the same visual customisation system.

Fans should eventually be able to display their favourite artists, enlisted Armies, personal imagery and decorative elements.

The design system should support both artist and fan customisation without duplicating the underlying editor.

## 6. PROTECT THE EXPERIENCE

Creative freedom must not compromise essential functionality.

The music player, chatroom, navigation, moderation controls and enlistment actions must remain accessible.

Include a visitor-facing VIEW CLEAN / VIEW CUSTOM toggle that removes personalised visual treatments without changing the underlying content.

Respect reduced-motion preferences, provide animation controls, and maintain readable text and usable controls.

## 7. TECHNICAL DIRECTION

Build a reusable theme engine based on structured JSON configuration and scoped CSS variables.

Keep artist content separate from presentation settings.

Use a common theme schema for artists and fans, with safe defaults, validation, asset-size limits and a migration path to persistent database storage.

Do not allow user themes to alter global navigation or other users' pages.

## MILESTONE 1 ACCEPTANCE CRITERIA

The first prototype is complete only when:

- An artist can open the Customise editor.
- Background images and animated GIFs can be selected and previewed.
- Background tiling and positioning work.
- Colours, typography and panels can be changed.
- At least six preset themes are available.
- Customisation settings survive a page refresh in the prototype.
- A visitor can switch between clean and customised views.
- The layout remains usable on desktop and mobile.
- The editor works with the existing artist page, including music, chat and posts.

## Creative principle

Stan Army provides the stage. The artist decides what the stage looks like.

Don't sanitise the personality out of the internet. Bring it back.
