# Army desktop playground

Review `/nova-playground`. This separate grid experiment uses Nova’s existing demo content. `/armies/nova`, its saved themes and `/nova-preview` retain their existing presentation.

## Spatial behaviour

The desktop retains twelve logical columns, with half-column and half-row snapping for finer placement. CSS uses 24 subcolumns and 28px subrows with 16px gaps; existing v1 positions and dimensions keep their original physical sizes. Windows are 3–12 logical columns wide and 2–64 rows high. The larger height range replaces the former eight-row ceiling. Fractional sizes and positions survive refresh without rounding back to the older coarse grid.

Dragging places the window at the pointer's grid offset, including empty spaces and gaps. It preserves that window's dimensions. Only an explicit Alt-drop onto another window exchanges footprints. Collisions resolve top-to-bottom: neighbours keep their chosen widths and heights and move down as needed, cascading into subsequent rows. Resizing no longer silently takes width from a neighbouring panel. A right-corner resize anchors the left edge; a left-corner resize anchors the right edge. At the page edge the active handle stops, rather than moving the whole panel sideways. The opposite corner can grow into a gap on the other side.

Every affected window previews its resulting position before release. Desktop DOM order remains stable through pointer capture and commit, preserving drafts and embedded players. The grid retains its starting minimum height during a gesture, and browser scroll anchoring is disabled for the document during that gesture: a growing grid must not anchor the footer, scroll the page, and feed that scroll back into the resize distance. Escape is captured globally during pointer gestures, even when focus started outside the grid. Escape, focus loss, viewport resize and pointer cancellation discard the preview and release capture. Returning the pointer to its starting position also clears a previously previewed move. Iframes ignore pointer input during a gesture.

Only the explicit minimise control hides a window. A compact fixed tray appears only when windows are minimised. Its buttons restore windows; restored windows leave the tray, which disappears when empty. The permanent dock has been removed. Minimising preserves neighbours’ coordinates. Restoring into a space that has since been occupied finds another free slot rather than moving visible windows. Expanding temporarily widens a window and makes room around it; other windows remain visible. Restore layout/Escape returns to the saved geometry. Content remains mounted, preserving drafts and audio during rearrangements and minimising.

Below 1000px windows stack in their saved reading order. Dragging/resizing are disabled; order controls remain available. Desktop geometry is preserved. The overflow menu’s Move up/down acts within the selected panel’s horizontal lane: it first closes an empty vertical gap, then exchanges adjacent occupied rows. A full-width panel can move past both neighbours without inheriting just one narrow slot; a narrow panel ignores tall windows in unrelated columns. On desktop, arrow keys move the selected window spatially by half a column or half a row; row moves remain available in the menu. On mobile, up/down moves individual stacked panels. Row moves preserve dimensions and anchor the selected panel in the viewport where scroll boundaries permit. Shift+arrows and corner arrow keys resize; the left corner also keeps its right edge anchored for keyboard resizing. Menus provide alternatives to dragging. Compact desktop title bars are 34px high with unboxed 28px actions. Expand lives in the overflow menu, and exact width, height, column and row values are available under Size & position. The old reserved resize footer is removed, reclaiming about 31px vertically for content. Corner grips are subtle 24px targets. Coarse-pointer controls retain 44px targets. Menu expansion restores focus to its visible trigger so Escape can reliably return to the normal layout.

## Appearance and discovery

The default Modern view is near-black with mint details, hot-pink actions, restrained retro window controls and a yellow MAKE SOME NOISE invitation. The opaque header groups identity, the Modern/Original view selector, Army style and Layout. Platform navigation retains the Stan Army brand. The permanent dock is replaced by a compact tray containing only minimised windows.

Army style opens a visual inspector: Themes, Room and Panels. Four illustrated starting themes preserve layout. Room controls provide background colour/presets, a validated raster upload with fill/tile/focus/dimming, button and header colours, header typography, window corners and retro/minimal frames. Panels can be styled together or individually using swatches/custom colours, title accents, fonts and title-bar skins. Each window always has a direct palette control: it opens the inspector on that individual panel, highlights its frame, and returns keyboard focus to the originating control on Save/Cancel/Preview. The panel selector starts with an individual panel; All panels together remains an explicit option. Light/custom surfaces choose readable text automatically; frame controls stay consistent. A chunky header uses tracking suited to its font rather than the clean font's tight spacing.

Edits preview as a separate draft. Undo/redo retains up to forty steps. Preview or Escape hides the inspector without discarding its draft/history. Reopening continues that session; Cancel restores the committed appearance, and Save style persists only the chosen appearance. Layout actions are disabled during a style draft. On wide screens the preview makes room for the inspector; smaller screens use a bottom sheet. The editor heading receives focus on open and the trigger regains focus on close. Section tabs support arrow/Home/End navigation. The nonmodal editor leaves preview interaction available.

Image handling reuses the existing 512 KB raster validator and browser decoder. Animated background images are suppressed when reduced motion is requested. Storage errors preserve usable session state and show a warning. Normal page instructions remain hidden, with accessible descriptions/hover hints retained.

See [customisation research and sources](ARMY_CUSTOMISATION_RESEARCH.md) for the historical comparison, interaction rationale and explicit future scope.

## Local prototype boundaries

Personal arrangements use `stan-army:desktop:personal:v1:army-nova`. Appearance and starting layout save separately under `stan-army:desktop:owner:v1:army-nova`. Personal arrangements take precedence; Reset layout restores the current starting layout. The exposed appearance editor is for this local experiment, with no claim of real ownership or role enforcement. Previously saved appearance data gains safe default surface and typeface values. Neither storage key grants permissions.

This adds no authentication, database, publishing, arbitrary CSS, third-party embeds or new posting feed. Styling is scoped to the playground. Stored options use validated enums and bounded numbers. Invalid collisions are repaired without dropping panels. Existing study components are reused; their normal rendering is unchanged. Drafts survive rearrangement but not refresh. Layout preferences survive refresh. Storage failure keeps the temporary arrangement operable.

## Validation

Automated tests cover existing behaviour and desktop packing, validation, legacy migration, slot swaps, anchored resizing, minimising/restoring occupied slots, repeated spatial edits, skin enums, appearance history, preset/layout independence, custom colour validation, raster migration and separate owner/personal storage. Lint, type checking and the production build are checked separately.

Browser checks exercise pointer swaps and live previews, small in-slot drags, Escape cancellation, left-corner resizing, keyboard control, refresh persistence, minimum-height chat inputs, drafts, embedded-player DOM continuity, panel colours/typefaces, appearance switching, minimised tray restoration, all-minimised recovery, blocked storage and layouts from 320–1440px. Runtime/hydration errors and panel/page overflow are checked. These are prototype interaction checks, not cross-browser certification.

## Readability refinement

Title-bar patterns blend across a single surface; opaque label plaques are removed, and window chrome uses a consistent UI font independently of panel content fonts. Chat messages have a 15px minimum, readable metadata, and timestamps beside their authors in wide panels. Conversation lines have a comfortable maximum width. Thin themed scrollbars replace bright native tracks, and wheel scrolling chains to the page when a panel reaches its end. Panel scroll positions remain intact when rearranged rather than resetting a reader midway through a discussion.

The playground stereo is now an external-service module; the older local instrumental in the separate layout study is not the playground's playback model. See [external music behaviour](ARMY_EXTERNAL_MUSIC.md).

## StanCam

StanCam adds a fifth movable/customisable panel beneath the player in the new starting layout. It is an edge-to-edge photo with Upload your own, previous/next and shuffle overlays. It has no likes, comment counts, caption form or advertising controls. Existing local assets are explicitly described as examples. Uploads reuse raster validation and remain only for this demo visit; the post-upload status says so. The prototype does not publish photos to other users or persist them on refresh. Invalid files leave the selected photo intact. Snaps survive rearranging and minimising while mounted.

Migration preserves the original four windows' positions, sizes and minimised state, finding an available space for StanCam near the stereo. If necessary it uses a shorter available gap or the nearest free space. Fresh layouts give discussions eight columns, with StanCam occupying the four-column space beside it. The packing search now accommodates all five tools at maximum size.

See ARMY_TOOLBOX_DIRECTION.md for the proposed longer-term plug-and-play direction. A catalogue of tools is not implemented yet.


## Grid repair — 21 November 2026

The bounded packing scan was replaced with obstacle-edge candidate placement, so tall sets of windows cannot run beyond a fixed 64-row search horizon and lose a placement. Validation excludes minimised panels from visible collision repair: hidden saved footprints no longer shift visible panels on refresh.

Regression coverage includes the original layouts, half-grid persistence, empty-space drops, moving then filling an adjacent gap, both anchored resize directions, tall windows, and 400 deterministic sequences of arbitrary moves/resizes/minimise/restore operations. Browser checks cover actual pointer drags, previews, filling gaps without shrinking neighbours, left resize after a move, global Escape rollback, 12.5→13-row resizing without page scroll, half-column keyboard resizing, deliberate Alt-swaps, refresh persistence, iframe continuity and widths from 320–1440px. The provider frame in interaction checks is an explicitly labelled fixture; this is not a Spotify playback certification.


## Lower-panel movement and expansion locks

Move up/down no longer groups the entire staggered desktop by transitive vertical overlap. Rows are derived from the selected window's horizontal lane, so a tall feed/discussion column cannot disable movement in the stereo/StanCam column. Move up first fills the gap above the selected panel; subsequent actions exchange its occupied row. A lone panel can move to the top of an otherwise empty lane. Planned moves pass through the collision resolver and persist the actual resulting coordinates.

Expansion remains a reversible view until the user edits the arrangement. Expanding a panel no longer hides all resize handles or blocks every drag. A new move or resize starts from the displayed expanded geometry, preserving positions under the pointer; committing that edit exits the temporary expanded view and saves the resulting arrangement. Cancelling keeps the expanded view. Menu sizing and keyboard controls use the same displayed geometry.

Once a title-bar drag is underway, holding the pointer within 56px of the viewport top or bottom scrolls the page gently (up to 14px per frame). Preview positions include this deliberate page scroll. Resizing does not auto-scroll. Release, Escape, pointer cancellation, blur, viewport changes and unmount stop the animation loop. Browser scroll anchoring remains disabled during the gesture, separately from this deliberate edge-scroll behaviour.

Added regression checks cover staggered-column Move up and filling an otherwise empty lane (20 geometry tests total). Browser checks reproduce repeated upward drags of lower Stereo/StanCam panels at changing page scroll positions, two consecutive Move up actions, dragging another panel after expansion, resizing an expanded panel, moving upward across a long page with edge scrolling, release cleanup, Escape cancellation and retention of the existing Spotify iframe. Third-party playback is represented by a clearly labelled fixture for these interaction tests.
