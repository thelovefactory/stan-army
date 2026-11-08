# Army desktop playground

Review `/nova-playground`. This separate grid experiment uses Nova’s existing demo content. `/armies/nova`, its saved themes and `/nova-preview` retain their existing presentation.

## Spatial behaviour

The desktop has twelve columns, 72px rows and 16px gaps. Windows are 4–12 columns wide and 3–8 rows high. Stable grid coordinates supplement the existing v1 layout schema; older saved layouts acquire coordinates on their first spatial edit.

Dropping a title bar onto another window exchanges their actual spaces, including dimensions. Other windows stay put. Small movements within the original window do nothing. Empty-space drops snap to a cell. Resizing anchors the active window; a shared vertical divider trades width with a same-row neighbour when both retain at least four columns. Otherwise only colliding neighbours relocate to the nearest available space. Every affected window previews its resulting position before release. DOM order stays stable during pointer capture. Escape cancels without saving.

Only the explicit minimise control hides a window. A compact fixed tray appears only when windows are minimised. Its buttons restore windows; restored windows leave the tray, which disappears when empty. The permanent dock has been removed. Minimising preserves neighbours’ coordinates. Restoring into a space that has since been occupied finds another free slot rather than moving visible windows. Expanding temporarily widens a window and makes room around it; other windows remain visible. Restore layout/Escape returns to the saved geometry. Content remains mounted, preserving drafts and audio during rearrangements and minimising.

Below 1000px windows stack in their saved reading order. Dragging/resizing are disabled; order controls remain available. Desktop geometry is preserved. Arrow keys on title bars exchange spaces on desktop or change the reading order on mobile. Shift+arrows and corner arrow keys resize. Menus provide alternatives to dragging.

## Appearance and discovery

The default Modern view is near-black with mint details, hot-pink actions, restrained retro window controls and a yellow MAKE SOME NOISE invitation. The opaque header groups identity, the Modern/Original view selector, Army style and Layout. Platform navigation retains the Stan Army brand. The permanent dock is replaced by a compact tray containing only minimised windows.

Army style opens a visual inspector: Themes, Room and Panels. Four illustrated starting themes preserve layout. Room controls provide background colour/presets, a validated raster upload with fill/tile/focus/dimming, button and header colours, header typography, window corners and retro/minimal frames. Panels can be styled together or individually using swatches/custom colours, title accents, fonts and title-bar skins. During editing, each window has a direct palette control. Light/custom surfaces choose readable text automatically; frame controls stay consistent. A chunky header uses tracking suited to its font rather than the clean font's tight spacing.

Edits preview as a separate draft. Undo/redo retains up to forty steps. Preview or Escape hides the inspector without discarding its draft/history. Reopening continues that session; Cancel restores the committed appearance, and Save style persists only the chosen appearance. Layout actions are disabled during a style draft. On wide screens the preview makes room for the inspector; smaller screens use a bottom sheet. The editor heading receives focus on open and the trigger regains focus on close. Section tabs support arrow/Home/End navigation. The nonmodal editor leaves preview interaction available.

Image handling reuses the existing 512 KB raster validator and browser decoder. Animated background images are suppressed when reduced motion is requested. Storage errors preserve usable session state and show a warning. Normal page instructions remain hidden, with accessible descriptions/hover hints retained.

See [customisation research and sources](ARMY_CUSTOMISATION_RESEARCH.md) for the historical comparison, interaction rationale and explicit future scope.

## Local prototype boundaries

Personal arrangements use `stan-army:desktop:personal:v1:army-nova`. Appearance and starting layout save separately under `stan-army:desktop:owner:v1:army-nova`. Personal arrangements take precedence; Reset layout restores the current starting layout. The exposed appearance editor is for this local experiment, with no claim of real ownership or role enforcement. Previously saved appearance data gains safe default surface and typeface values. Neither storage key grants permissions.

This adds no authentication, database, publishing, arbitrary CSS, third-party embeds or new posting feed. Styling is scoped to the playground. Stored options use validated enums and bounded numbers. Invalid collisions are repaired without dropping panels. Existing study components are reused; their normal rendering is unchanged. Drafts survive rearrangement but not refresh. Layout preferences survive refresh. Storage failure keeps the temporary arrangement operable.

## Validation

53 automated tests cover existing behaviour and desktop packing, validation, legacy migration, slot swaps, shared-divider resizing, minimising/restoring occupied slots, repeated spatial edits, skin enums, appearance history, preset/layout independence, custom colour validation, raster migration and separate owner/personal storage. Lint, type checking and the production build are checked separately.

Browser checks exercise pointer swaps and live previews, small in-slot drags, Escape cancellation, left-corner resizing, keyboard control, refresh persistence, minimum-height chat inputs, drafts, audio continuity, panel colours/typefaces, appearance switching, minimised tray restoration, all-minimised recovery, blocked storage and layouts from 320–1440px. Runtime/hydration errors and panel/page overflow are checked. These are prototype interaction checks, not cross-browser certification.
