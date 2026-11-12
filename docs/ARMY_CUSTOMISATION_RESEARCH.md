# Army customisation: expressive rooms, predictable editing

Research reviewed 8 November 2026. This is a design synthesis and a working prototype, not a claim that every historical interface has been recreated or that old Myspace account tools still work.

## What the history suggests

Early MySpace made a profile feel owned by its member. Backgrounds, typography, colours, graphics and music helped people signal a whole scene. Its HTML/CSS culture also made customisation a community activity: people borrowed layouts, learned techniques and developed recognisable styles. A primary-source MySpace demo in Microsoft's March 2006 MIX transcript describes CSS customisation and a proposed move toward draggable modules for nontechnical members. The later Profile 2.0 launch in November 2008 documents visual module placement and ready-made themes. Those are separate milestones; the 2006 demonstration is not evidence of the 2008 launch date. [1, 2]

The transferable idea is authorship of a space, rather than unrestricted page code. For Stan Army, that authorship belongs to the community's room. Platform navigation and personal profiles retain Stan Army's own identity.

Myspace's currently published help centre focuses on profiles, cover/profile images, posts and media. It does not establish that the old CSS editor remains available. No account was created or logged into as part of this research. SpaceHey is the clearer contemporary comparison for the earlier creative culture: it explicitly supports HTML/CSS and a community layout collection. Its layout catalogue demonstrates continued interest in scene-specific skins, fonts, music and retro desktop treatments. Stan Army can preserve that variety through visual controls without requiring copy-pasted code. [3, 4, 5]

Contemporary editors separate starting points from finer changes. Wix documents themes with coordinated colours and text styles followed by individual customisation. Tumblr provides theme previews and an explicit save step. Squarespace documents undo/redo for style edits. These suggest a reversible, preview-led workflow rather than immediately committing every adjustment. Nielsen Norman Group's progressive-disclosure guidance supports keeping secondary controls in relevant sections instead of presenting a long undifferentiated form. [6, 7, 8, 9]

## What the prototype now does

The page starts black and sleek. The header's Army style control opens an editor with three sections:

| Section | Purpose | Controls |
| --- | --- | --- |
| Themes | A quick, coherent starting point | Blackout, After hours, Acid house, Wild thing; visual miniatures |
| Room | The shared atmosphere | Background preset/colour, own raster image or GIF, tiling/fill, image focus and dimming; button colour; header colour/typeface; window corners and frame |
| Panels | Individual personality | All panels or one panel; colour swatches and custom colour, title accent, typeface, header skin |

Panel controls include clean, terminal, chunky and editorial typefaces. A small palette button on each window opens that individual window's settings directly, even before entering editing mode. The selected window is outlined; all-panel styling is an explicit alternative in the selector. Controls outside the Army retain the platform typography. The page header stays opaque and readable over any background. Individual surfaces select readable text automatically; no arbitrary CSS, scripts or remote image addresses enter the schema.

Preview is immediate. Undo/redo allows experimentation, including recovering from a preset change. Preview/Escape hides the editor while retaining the draft and undo history; reopening continues the same session. Cancel restores the saved appearance. Save style persists the chosen appearance on this device. Neither preset selection nor saving style moves, hides or resizes community windows. The host's stored starting layout is distinct from personal layout preferences. Layout-default actions are disabled during an appearance draft to avoid mixing those operations.

On wide screens, the inspector sits beside the page and the grid uses the remaining width. On narrower screens it becomes a bottom sheet; Preview exposes the whole page. Images reuse existing raster validation: up to 512 KB, bounded dimensions, matched file signatures and successful browser decoding. Reduced-motion preferences suppress an animated background. Failed storage writes keep the session usable and show an honest warning.

## Why this balance

The creative range comes from combining a room background, four independently styled windows, typefaces and media already present in the community. The interaction structure stays stable. Members can still arrange the room for themselves; the editor does not turn an owner's theme choice into a new personal layout.

This deliberately avoids a full site-builder inspector. People choose a starting point, then refine the room or a panel. Theme presets are built-in examples, not a claim of a community theme marketplace. User-made theme sharing, theme-file import/export, sticker layers, banner/avatar uploads and real owner permissions remain future work. The current prototype already has a useful background upload; it does not pretend every possible MySpace-era effect is supported.

A later theme library could let communities share looks with credit to their makers. That would capture one of the most interesting social parts of old MySpace, while keeping the underlying theme format bounded and portable.

## Sources

1. Microsoft, *Bill Gates: Microsoft MIX06 Conference*, 20 March 2006: https://news.microsoft.com/speeches/bill-gates-microsoft-mix06-conference/
2. exchange4media, *MySpace launches Profile 2.0*, 11 November 2008: https://www.exchange4media.com/industry-briefing-news/myspace-launches-profile-2.0-33088.html
3. Myspace, published Help Center: https://help.myspace.com/hc/en-us
4. SpaceHey, description of profile customisation: https://spacehey.com/
5. SpaceHey, community layouts: https://layouts.spacehey.com/
6. Wix, *Customizing Your Site's Theme and Design*: https://support.wix.com/en/article/wix-editor-customizing-your-sites-theme-and-design
7. Tumblr, *Customizing Your Theme*: https://help.tumblr.com/knowledge-base/customizing-your-theme/
8. Squarespace, *Using undo and redo in Squarespace*: https://support.squarespace.com/hc/en-us/articles/4403167416461-Using-undo-and-redo-in-Squarespace
9. Nielsen Norman Group, *Progressive Disclosure*: https://www.nngroup.com/articles/progressive-disclosure/
