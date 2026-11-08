# Army desktop playground

Review `/nova-playground`. This is a separate snap-to-grid experiment using Nova's existing demo content. `/armies/nova`, its saved themes and `/nova-preview` retain their existing presentation.

## What to try

- Drag any title bar to move a panel in the reading order. A ghost shows its snapped destination before dropping. The grid packs the other panels around it without overlap.
- Drag either bottom corner to change a window's column span and height. The right edge grows with a rightward drag; the left edge grows with a leftward drag. Resizing reflows the grid rather than anchoring an absolute screen coordinate.
- Use **Chat first** to compare an 8-column chat with a 4-column discussion board.
- Minimise to the dock; restore from the dock. Expand one window for focus and return to all windows. Contents remain mounted when minimised/focused, preserving draft text and audio playback.
- Use the **Size & position** menu instead of dragging. Arrow keys on a title reorder; Shift+arrows resize. Arrow keys on a corner resize. Escape cancels an in-progress gesture, closes a window menu or exits focus view.
- **Reset to Army layout** restores the host's starting arrangement without clearing drafts or modifying existing Army theme settings.

## Why a grid first

This tests personal spatial control without introducing overlapping windows, escalating z-index problems or inaccessible off-screen title bars. A 12-column first-fit layout reflows neighbours. Widths are bounded to 4–12 columns and heights to 2–8 rows. Menus remain within the frame, and keyboard/menu alternatives make dragging optional.

Below 1000px the windows stack to fit the screen. Dragging and resizing are disabled, with order controls still available. Saved desktop widths are preserved for a later desktop visit. Minimised windows remain available in the dock; even minimising everything is recoverable. Focus view is temporary and does not overwrite saved dimensions.

## Host atmosphere versus personal arrangement

The initial role is **Community member**. Personal moves, resizes, order and minimised state save only under `stan-army:desktop:personal:v1:army-nova` on this device.

Switch the explicitly simulated **Demo role** to **Community host** to try **Army style**. Host controls provide Electric leopard, After hours and Chrome room appearances, a linked mint/pink/yellow participation surface for composer and chat, and **Use this as the starting layout**. These save separately under `stan-army:desktop:owner:v1:army-nova`. A personal arrangement takes precedence; reset returns to the current host default.

This is a local prototype, not authentication, real community role enforcement, a published default or cross-device syncing. No role or permissions are restored from storage. Host styling remains readable and does not change which controls do what. Storage failures retain an operable temporary layout and explicitly report that it is unsaved.

## Implementation boundaries

The page has its own CSS module and safe enum/numeric layout schema. It adds no dependency, arbitrary CSS storage, third-party embeds, database, billing, backend or new posting feed. The first-fit packing and validation are pure functions in `army-desktop.ts`. Existing study content components are reused with opt-in suppression of duplicate window headings; their default rendering is unchanged. The original root navigation, pages and theme schemas remain untouched.

Posts, chat, membership and discussions retain the existing demo-only behaviour. Drafts survive rearrangement and minimising, but do not survive refresh. Layout preferences survive refresh. Music uses existing original sample audio, not an unlicensed or purported Nova recording.

## Validation

44 tests cover existing behaviour plus packing, collision-free reflow across 180 size combinations, clamping, persistence parsing, minimised state and owner/personal separation. Browser checks cover real pointer dragging and left resizing, keyboard movement/resizing, Escape cancellation, draft retention, audio continuing while minimised, focus/restore, refresh, host styling/defaults, member-only controls, reset, fully minimised recovery, blocked browser storage, menus and responsive layouts at 320/390/800/999/1000/1024/1100/1440px. No runtime or hydration errors occurred in interaction checks.

The full interaction check also passed against the production build, and the prior Nova layout study regression passed with original Nova styling and saved theme unchanged. ESLint, TypeScript and production build passed. [Desktop](screenshots/army-desktop-playground.png) · [Chat first](screenshots/army-desktop-chat-first.png) · [Mobile](screenshots/army-desktop-mobile.png).
