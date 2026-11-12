# Customisation & consistent participation audit

Principle: **Customise the atmosphere, not the usability.** This is a refinement of the current prototype. Nova’s feed/sidebar, seven-post limit, full-feed page, board, permissions and optional modules retain their existing behavior.

## Control inventory and final scope

| Control | What it affects | Audit result / boundary |
| --- | --- | --- |
| Presets (all six) | Complete appearance, including uploaded images and Participation Colour | Retained as explicit whole-appearance operations. Keep current module visibility; Cancel restores saved settings. |
| Fan posts | Composer, latest-seven feed and all-posts content | Existing visibility behavior retained; no content deletion. |
| Music / Spotify | Main playlist / listening-room media | Retained; independent from chat and videos. |
| Videos | Video link and video shelf | Retained, including access when posts are hidden. |
| Chat | Army Chat module | Retained; independent from music. |
| Announcements | From the Army / From the Artist panels | Retained; distinct author permissions unchanged. |
| Events & links | Events / external-links panel | Retained. |
| Discussion board | Embedded board | Retained; standalone s/ board remains independent. |
| Gallery | Legacy gallery page only | Removed from the main editor because its preview was retired. Available in that page’s editor; stored flag preserved. |
| Player skin (four) | Compact Spotify frame and native Army Player | Added visible frame/header distinctions; hidden from fan-profile editor. Cannot restyle Spotify’s iframe internals. Hidden player modules must be enabled to preview a skin. |
| Background upload / remove | Wallpaper only | Validated JPG/PNG/WebP/GIF; no remote/SVG assets. Removal does not affect header or portrait. |
| Background colour | Page, identity/header and reading backplates | Scope explicitly described. Opaque wallpaper can cover the page colour; backplates still expose it. |
| Background sizing | Cover / contain / tile / original-size wallpaper | Disabled until an image exists. Removed redundant “centre” from original-size label because position is separate. |
| Background position | Wallpaper focal position (five choices) | Clear target label; no effect on separately uploaded header. Disabled without an image. |
| Wallpaper scroll | Scroll with page / fixed to viewport | Correct CSS property applied. Actual fixed-background behavior depends on browser/device support. |
| Page & panel text | Shared text with per-surface contrast fallback | Keeps requested colour in JSON; displays readable fallback when needed. Author-styled sample paper/ink remain authored content. |
| Links | Shared links and text actions | Minimal board actions use the panel-readable link colour. Participation-area links calculate contrast on their own surface. |
| Primary buttons | Post, Send, Join and submit/reply actions | Filled buttons retained. Readable button ink, familiar fonts, stable control geometry; secondary board actions excluded. |
| Panel borders | Shared outer frames | Applied consistently across Army frames, ordinary/author-styled post frames and player wrapper. Participation frames use a contrast-safe variant. |
| Decorative accents | Identity/board markers and shared decorative highlights | SVG markers replace colour-locked emoji in interface headers; separate page/panel/participation contrast calculations. The supplied logo image is unchanged. |
| Participation Colour (new) | Composer and Army Chat surfaces only | Independent from other panels/buttons. Same colour relationship, distinct layouts. Opaque fields and readable text/caret/placeholder/icons are protected. |
| Heading & decorative font | Page headings and decorative copy | Interaction fields/buttons stay Arial/system sans. Author-styled samples keep their own lettering. Exact font faces depend on installed fonts. |
| Secondary panel background | Secondary content panels, ordinary posts and board surfaces | No longer recolours composer/chat. Player internals and author-styled sample backgrounds keep their palettes. |
| Panel corners (four) | Shared outer frames across Armies | Consistent scope, including non-Nova player/board frames. Does not change button shapes. |
| Panel border style (four) | Shared outer frames | Solid/dashed/dotted/double work; double now uses 3px so both lines are visible. |
| Secondary panel opacity | Decorative content-panel fills, including events/announcements | Text backplates remain opaque. Composer, chat, player, feed posts and boards stay opaque for reading. Equal page/panel colours can naturally mask transparency. |
| Sticker set (six incl. none) | Original decorative overlay only | Retained; no pointer capture or navigation modification. |
| Glitter | Independent decorative overlay | Retained, including without a sticker set. |
| Animate decorations & GIFs | Motion-enabled CSS / visibility of animated uploads | Retained. Reduced motion and visitor pause take precedence; the editor explains hidden animated wallpaper. |
| Header upload / remove | Army identity image or fan banner | Reduced overly opaque Army tint so the image is visible; solid text backplates protect readability. Clearly separate from wallpaper. Main Army page is the header preview target. |
| Profile image upload / remove | Portrait only | Independent from header/wallpaper. Existing raster validation/limits retained. |
| Advanced styling | Read-only token preview | Collapsed, explicitly read-only; removed the redundant disabled CSS textbox. No arbitrary HTML, JS, CSS or remote URLs. |
| Save | Existing profile JSON on this device | No storage-key/version change. Failure reporting retained; no automatic writes during load. |
| Cancel | Current draft only | Restores saved appearance and visibility without writing. |
| Reset appearance | Default visual settings | Renamed to state scope; preserves current module visibility. Preview only until Save. |
| View clean/custom | Visitor visual override | Keeps saved modules/content and leaves stored JSON unchanged. |
| Pause / reduced motion | Visitor motion preference | Does not mute user-initiated audio or change stored themes; OS reduced motion wins. |
| Demo role | Simulated authorisation | Founders/admins can customise; official artist/representative identity still grants no community editing rights. |

## Interaction language

Post, send, reply and join keep familiar labels/icons, filled primary-action treatment, stable interface fonts and control shapes. Theme fonts affect atmosphere and reading copy, not typing mechanics. Focus uses a two-tone visible outline that remains distinguishable on light, dark and fluorescent backgrounds. Hover treatment is restrained; native disabled/pressed/expanded semantics remain intact.

The shared board header uses text actions: `+ My Boards`, `Open board` with a vector arrow, and `+ Start a discussion`. All have 13px/24px interface typography, 44px targets and the same baseline on desktop, with comfortable wrapping on mobile. No filled backgrounds/heavy borders. Hover underlines, saved state and keyboard focus remain visible. Standalone boards use Explore boards in place of Open board. Similar My Boards card actions are lightened; primary submit/join controls remain buttons.

## Backward compatibility and isolation

Version-1 JSON gains validated `participationColor`. An older record without it derives the initial colour from its saved panel colour, preserving the former shared appearance; it is not rewritten on load. Once edited, panel colour and Participation Colour are independent. Requested text/link colours stay stored; readable variants are computed per surface. Asset limits, safe enums, legacy artist-to-Army key fallback, fan/Army isolation and module flags remain intact. Participation variables are scoped to composer/chat subtrees and cannot recolour siblings, global navigation or another Army.

Reset appearance intentionally supersedes the older reset-all-tools behavior documented in earlier milestones. No backend, migration, service, authentication or arbitrary styling execution was added.

## Remaining deliberate limits

- Spotify owns iframe typography, colours, playback controls and availability. Four frame/native-player skins do not claim to customise the provider UI.
- Curated fonts remain system stacks. Missing faces use installed fallbacks, so some choices can converge on a given OS; no font bundle was introduced. Interface fonts/geometry remain stable.
- Animation-off/reduced motion hides GIF/APNG/animated WebP uploads rather than extracting a frozen frame. Still images remain available. Wallpaper positioning only has a visible effect with a visible image; fixed attachment can vary on mobile browsers.
- Opacity does not fade essential interaction/readability surfaces. This is explicitly labelled, not an ineffective slider.
- Header/portrait controls target the main identity/banner. They are saved for that profile even when editing from a listening/media page without an identity header.
- Saved themes are local to the browser and apply after client hydration; server-rendered defaults can briefly appear. They are not server-backed themes or production access controls.

No enabled control is left silently ineffective on its documented target. Controls with no target in a context are hidden, disabled, or explain where the effect can be previewed.

## Evidence

See VALIDATION.md for exact commands and results. `check-customisation-audit.mjs` verifies control effects, migration, no colour bleed, per-surface contrast, images/removal, border/corner/opacity behavior, fonts, stickers/motion, skins, Save/Cancel/refresh/reset, module preservation, board action baseline/style/functionality/focus, 320/390px worlds and theme isolation across Nova/Sienna/Atlas. Tests use isolated browser contexts and never touch the user’s personal saved wallpaper.


## Army interaction consistency follow-up
The Army participation stylesheet now gives primary Join, Post, Send, Load Spotify and in-Army reply/submission controls the same 44px minimum height, 13px Arial UI typography, 18px direct icons, 10px control corners, and paired existing `--theme-button` / contrast-guarded `--theme-button-text` colours. Enlisted status retains its checkmark, label, aria-pressed state and an inset selected treatment. The Enlist others action is transparent/outlined. Secondary tools retain lighter styling, with 44px composer/icon hit areas and 36px secondary links.

Nova's sidebar heading rows now share an 18px UI title/icon alignment; the larger Army and discussion identities stay distinct. Panel padding follows the existing responsive `--army-inset`; corners follow saved `--theme-radius`. Chat times align right and wrap safely alongside founder badges. Metadata uses 11px UI text without fading contrast-protected content. Feed author/footer interfaces use Arial while post body fonts, artwork, images and expressive styles remain untouched. The mint participation surfaces remain independently controlled by Participation Colour; action colours do not recolour them.

Scope is Army pages, with Nova-specific geometry and mobile rules. No theme schema, storage keys, saved values, module toggles, permissions, interactions, global navigation or homepage styles changed. The owner Customise control retains its separate platform-toolbar identity. Spotify's internal iframe controls remain provider-owned; only the local click-to-load action is unified.
