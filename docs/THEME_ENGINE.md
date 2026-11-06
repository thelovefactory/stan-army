# My Army, My Rules — Milestone 1 theme engine

## Contract
One `Theme` schema serves artist pages, their focused rooms, and the fan prototype. It contains presentation only, never messages, memberships, permissions, links, biographies or roles. `schemaVersion: 1` versions the JSON. Unsupported versions and malformed JSON fall back to a fresh default object. Validators explicitly rebuild allowed fields; unknown keys and free CSS/HTML are dropped.

| Group | Accepted values |
| --- | --- |
| Background | Six-digit hex colour; inline validated raster asset or none; cover, contain, repeat/tile, natural size; centre/top/bottom/left/right; scroll/fixed |
| Colours | Six-digit hex text, link, button, border and accent values |
| Fonts | Original, Comic chaos, Terminal kid, Drama club, Scene headline, Typewriter diary; fixed system-font stacks |
| Panels | Hex colour; 0–100 opacity; solid/dashed/dotted/double border; original/square/round/wonky corners |
| Decorations | None/hearts/stars/flames/butterflies/pixels; glitter; animation enablement |
| Images | Banner/avatar using the same raster-asset contract as background |

## Asset boundary
Accept JPG, PNG, WebP and GIF only. File selection is a local read, not an upload to a service. Maximum 512 KiB each, 1 MiB combined per profile, 4096×4096 dimensions. FileReader produces an inline data URL, the browser must decode the image, and the validator checks matching MIME/signature, base64 syntax and actual decoded byte length. SVG, external URLs, malformed data, forged sizes and unsupported CSS strings are rejected. Settings restored from storage are checked again; over-budget restored assets are discarded. The original heart GIF provides a built-in example without needing another download.

PNG `acTL` and WebP `ANIM` markers are conservatively checked for animation; every GIF is considered animated. This is a prototype animation policy, not a full media-security parser. Backend upload processing, metadata removal and resource limits will be needed before public uploads. The current limits and safe browser image rendering do not replace that work.

## Persistence and edit lifecycle
Keys: `stan-army:theme:v1:artist:<slug>` / `stan-army:theme:v1:fan:<handle>`. Pages and listening rooms use the same artist key. Fan keys and every other artist key are separate. The app subscribes to in-page updates and browser storage events using `useSyncExternalStore`. Server rendering uses the original design; saved themes are restored after hydration.

Customise clones saved settings into a draft. All controls update the actual rendered profile immediately. Save validates and writes the draft, then announces success. Failure to write (quota/private-mode policy/storage denial) leaves the editor open with an error. Cancel/Escape discard the draft; Reset previews Blank Canvas, and Save persists that reset. Presets replace the entire draft, including images. They never mutate shared defaults. Choosing the original/default theme removes personalised treatment entirely.

Themes persist on this device/origin; they are not public, cross-device or account-backed. Browsers can clear storage. Multiple profiles with images may exhaust the browser's shared quota even though each profile fits the per-profile budget. The app reports that failure without silently dropping a save. Refresh clears chat/enlistments, but keeps successfully saved themes. Wizard drafts remain in memory as before.

## Protecting the experience
Global navigation/footer, the editor, demo-role selector and viewing controls sit outside the themed canvas. All personalised CSS selectors start within that canvas. Values are mapped from enums/hex/raster types into known CSS variables and background properties; no selector or arbitrary CSS string is interpolated.

Chat and music stay opaque and use readable interface fonts. Other decorative panels can become transparent while text rows keep opaque backplates. Text and links resolve to a 4.5:1 minimum against their solid plate/background; button text resolves against its button colour. Control borders and focus outlines use readable fallbacks. Custom colours are retained in settings so creative intent is not silently rewritten, while rendered tokens can be corrected. Photo text has solid/dark overlays; complete browser contrast auditing remains outstanding.

CSS decorations are original, behind content and pointer-inert. View Clean removes the entire personal presentation, including selected imagery, without remounting profile children or changing content/state. View Custom restores the saved design. These viewing preferences are visitor-local and temporary. When editing, clean-view switching is disabled to avoid hiding the active preview.

Pause freezes CSS decorations and hides animated raster assets (original imagery remains as fallback for banner/avatar). Reduced motion always enforces that behaviour and cannot be overridden by the play control. The theme's own animation switch applies to both CSS and animated uploads. No JavaScript animation loop runs.

## Role prototype
The visible role selector intentionally simulates owner, authorised manager (artist only), or visitor. Owner/manager views expose Customise; visitor mode hides it but retains clean/custom and motion controls. There is no authentication or production permission claim. The future server/database must verify actual ownership and invitations; the current role selector must never become an authorization mechanism.

## Advanced CSS
Read-only token preview plus disabled CSS textarea. No arbitrary HTML, JS, CSS, imports or remote URLs run. A later advanced editor needs a separately reviewed scoped grammar and strict limits; do not simply enable the current textarea.

## Database migration path
The existing master brief's Supabase direction remains a proposal. A later repository boundary can replace `loadProfileTheme` / `saveProfileTheme` with authenticated reads/writes. Keep the validated versioned settings schema and explicit target identity in a server-checked envelope. Replace inline image data with processed storage references, migrate old JSON with explicit converters, support revisions/rollback, and enforce per-artist grants/self-only fan policies. See `DATABASE_SCHEMA.md`. No migration, backend endpoint or service is created now.

## Acceptance evidence and remaining review
| Addendum criterion | Implementation / evidence | Browser status |
| --- | --- | --- |
| Artist opens editor | Owner/manager Customise button; shared `ProfileTheme` rail/sheet | Not exercised |
| Images and animated GIF preview | Local file controls and original example GIF | File decoding/playback pending |
| Tile/cover/contain/centre/fixed/scroll | Typed background properties applied to scoped canvas | Visual rendering pending |
| Colour/font/panel controls | Controlled editor inputs and CSS variables | Visual rendering pending |
| Six themes | Six distinct validated preset records | Unit-tested; visual review pending |
| Refresh persistence | JSON save/load with independent keys and storage subscription | Mock-storage round-trip tested; actual refresh pending |
| Clean/custom visitor toggle | Same child tree with/without themed canvas and assets | State preservation source-reviewed |
| Desktop/mobile usability | Right rail above 1100px, bottom sheet below; responsive profile CSS | Not verified in browser |
| Existing player/chat/posts | Editor wraps the original page components | Production rendering passes; interaction journey pending |
| Shared fan system | `/fans/jess-wav` uses same wrapper/schema/editor | Production rendering passes |

The managed browser tool remains unavailable. No screenshots or end-to-end browser pass are claimed. Milestone 1 remains at visual review with those acceptance checks outstanding.
