# Army desktop playground

Review `/nova-playground`. This separate grid experiment uses Nova’s existing demo content. `/armies/nova`, its saved themes and `/nova-preview` retain their existing presentation.

## Spatial behaviour

The desktop has twelve columns, 72px rows and 16px gaps. Windows are 4–12 columns wide and 3–8 rows high. Stable grid coordinates supplement the existing v1 layout schema; older saved layouts acquire coordinates on their first spatial edit.

Dropping a title bar onto another window exchanges their actual spaces, including dimensions. Other windows stay put. Small movements within the original window do nothing. Empty-space drops snap to a cell. Resizing anchors the active window; a shared vertical divider trades width with a same-row neighbour when both retain at least four columns. Otherwise only colliding neighbours relocate to the nearest available space. Every affected window previews its resulting position before release. DOM order stays stable during pointer capture. Escape cancels without saving.

Only the explicit minimise control hides a window. Dock buttons reveal or restore; repeated clicks cannot minimise an open window. Minimising preserves neighbours’ coordinates. Restoring into a space that has since been occupied finds another free slot rather than moving visible windows. Expanding temporarily widens a window and makes room around it; other windows remain visible. Restore layout/Escape returns to the saved geometry. Content remains mounted, preserving drafts and audio during rearrangements and minimising.

Below 1000px windows stack in their saved reading order. Dragging/resizing are disabled; order controls remain available. Desktop geometry is preserved. Arrow keys on title bars exchange spaces on desktop or change the reading order on mobile. Shift+arrows and corner arrow keys resize. Menus provide alternatives to dragging.

## Appearance and discovery

A single restrained window system uses slim tinted headers, consistent controls, thin borders and readable opaque content. Simulated hosts can select a colour and Solid, Leopard or Grid header skin for each window. Header skins do not interfere with content or alter geometry. Room appearances remain Electric leopard, After hours and Chrome. Mint/pink/yellow participation surfaces link composer and chat.

Visible tutorial blocks, gesture instructions and routine success notices have been removed. Hover hints and screen-reader instructions remain. Real storage failures still display a warning. Menus retain functional labels and the prototype retains its local-demo disclosures.

## Local prototype boundaries

The initial role is Community member. Personal arrangements use `stan-army:desktop:personal:v1:army-nova`. Switching the simulated Demo role to Community host reveals Army style. Host appearance and starting layout save separately under `stan-army:desktop:owner:v1:army-nova`. Personal arrangements take precedence; Reset to Army layout restores the current host default. Neither key grants or restores permissions.

This adds no authentication, database, publishing, arbitrary CSS, third-party embeds or new posting feed. Styling is scoped to the playground. Stored options use validated enums and bounded numbers. Invalid collisions are repaired without dropping panels. Existing study components are reused; their normal rendering is unchanged. Drafts survive rearrangement but not refresh. Layout preferences survive refresh. Storage failure keeps the temporary arrangement operable.

## Validation

49 automated tests cover existing behaviour and desktop packing, validation, legacy migration, slot swaps, shared-divider resizing, minimising/restoring occupied slots, repeated spatial edits, skin enums and separate owner/personal storage. Lint, type checking and the production build are checked separately.

Browser checks exercise pointer swaps and live previews, small in-slot drags, Escape cancellation, left-corner resizing, keyboard control, refresh persistence, minimum-height chat inputs, drafts, audio continuity, host styles, repeated dock activation, all-minimised recovery, blocked storage and layouts from 320–1440px. Runtime/hydration errors and panel/page overflow are checked. These are prototype interaction checks, not cross-browser certification.
