# My Army, My Rules — shared Army/fan presentation engine

## Current scope
Fan community administrators control Army appearance. A verified artist/representative identity grants no editor access. Fan profile owners independently customise their own profile. One `Theme` schema, shared `ThemeEditor`, `ThemePresetPicker` and `ProfileTheme` canvas serve both. The fan-led wizard reuses the preset picker and canvas for a non-persistent preview. No duplicate theme system was introduced.

## Structured v1 contract
- Background: six-digit hex, optional inline raster, cover/contain/tile/natural sizing, centre/top/bottom/left/right, fixed/scroll attachment.
- Colours: text, links, buttons, borders, accent.
- Font: Original, Comic chaos, Terminal kid, Drama club, Scene headline, Typewriter diary, mapped to fixed system stacks.
- Panels: hex colour, 0–100 opacity, solid/dashed/dotted/double, original/square/round/wonky corners.
- Decorations: none/hearts/stars/flames/butterflies/pixels, glitter, animation setting.
- Images: banner and avatar using the same asset contract as background.

Six presets remain: Blank Canvas, Glitter Bomb, Scene Queen, Burning Desire, Digital Dream and Cyber Trash. Defaults are cloned; unknown fields, unsafe CSS/HTML, unapproved enums and unsupported schema versions never enter the style pipeline. Content and authority are not stored in themes.

## Raster boundary
JPG/PNG/WebP/GIF only, 512 KiB per image, 1 MiB combined, up to 4096×4096. FileReader reads locally, browser decoding checks dimensions, and validation matches MIME/signature/base64 and actual byte length. No SVG, external URLs, CSS text or arbitrary HTML/JS. GIFs are treated as animated; PNG `acTL` and WebP `ANIM` markers are conservatively checked. Full server media parsing/processing is future work before public uploads. The built-in original pixel-heart GIF is unchanged.

## Backward-compatible persistence
Army profile ID: `army:<stableArmyId>`. For Nova, key `stan-army:theme:v1:army:army-nova`. The explicit legacy fallback is `stan-army:theme:v1:artist:nova-reign`. Fan key `stan-army:theme:v1:fan:jess-wav` is unchanged.

The storage snapshot prefers any new-key value. Only when absent does it read the mapped old key. Rendering never writes/deletes storage. Restored settings are validated. A later Save writes the new key and retains the old key; denied/quota-failed writes preserve the old data and leave the editor open. Reset then Save creates an explicit new-key default, preventing an old theme from resurfacing. This read-through/lazy-write migration preserves existing customisations without an automatic destructive migration.

No community messages/memberships or roles are persisted with the presentation. Cross-tab storage updates and local save notifications use `useSyncExternalStore`; server rendering starts from safe defaults. Browser storage is per device/origin and can be cleared or fill up across profiles. Future public subdomains require database-backed themes; localStorage will not cross origins.

## Live editing and safeguards
Customise clones saved settings; controls update the real profile tree, preserving underlying chat/enlistment state. Save commits validated settings. Cancel/Escape restores saved presentation and returns focus; Reset previews the original design until Save. Choosing a preset replaces the draft, including uploads.

All personal CSS is scoped to `.profile-canvas.profile-custom`. Header/footer, role controls and editor are outside it. Only known CSS variables, fixed property values and inline raster sources are applied. Core music/chat/controls retain opaque readable surfaces and interface fonts. Decorative panels may be transparent; text rows use solid backplates. Text/link/button colour resolution protects contrast, and essential control borders/focus use readable fallbacks.

Clean view removes custom presentation and images without replacing the content tree; custom view restores it. Animation pause and reduced motion freeze CSS and hide animated raster uploads. Static images stay visible. Reduced motion cannot be overridden by the play control. Original decorations are pointer-inert and below content. Advanced CSS remains a read-only token preview with disabled textarea.

## Permissions are simulated here
Founder/admin modes expose Army editing; moderator, official artist, official representative and visitor modes do not. Official Nova role simulation exposes only its separately labelled official-announcement composer. Role selection is not authentication. Future server/data policies must independently verify community membership and artist relationship scopes. Nothing in the theme JSON or a successful payment authorizes either.

## Future persistence
Keep the presentation schema separate from its target/authorization envelope. Authenticated repositories and RLS should own writes to Army/user theme records. Replace data URLs with processed storage references, add revision/rollback, and use explicit schema converters. No backend, service or migration is created. See `DATABASE_SCHEMA.md`.

## Verification limits
Unit tests cover all six presets, unsafe inputs, asset budgets, contrast, independent keys, save/load/reset/failures and legacy-to-Army fallback precedence. Actual browser refresh/file-picking/GIF playback, keyboard journeys and mobile rail/sheet behaviour remain outstanding because managed browser tooling is unavailable. See `VALIDATION.md`.
