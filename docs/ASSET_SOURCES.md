# Asset sources

## User-supplied originals
The three supplied images are preserved byte-for-byte under `public/brand/`:
- `stan-army-logo.png`: original `1000084232.png`. The logo is displayed through an image element; CSS inversion and a clipped container adapt its white background for the dark header. The source file is unchanged. No logo was redrawn or generated.
- `artist-reference.png`: original `1000084226.png`, design reference only. Its portrait and music UI were not reused as licensed product content.
- `space-reference.jpg`: original `1000084229.jpg`, secondary tone and message reference.

## Photography
Downloaded on 2026-11-06 from Unsplash’s image service. Used under the [Unsplash License](https://unsplash.com/license), which permits downloading and use without mandatory attribution. Images are local, not hotlinked. No endorsement or connection to the fictional artist identities is implied. These are photographs, not generated artwork. The URLs below identify the exact source image and downloaded rendition; no photographer attribution is invented where it was not verified.

| Local file | Exact downloaded source | Use |
| --- | --- | --- |
| `public/images/artist.jpg` | https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85 | Stock portrait; illustrative Nova Reign photo |
| `public/images/crowd.jpg` | https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=85 | Festival crowd, artist banner and community section |
| `public/images/sienna.jpg` | https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85 | Stock portrait; illustrative Sienna Blue and fan face |
| `public/images/atlas.jpg` | https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85 | Stock portrait; illustrative Atlas Noir/Milo June and fan face |
| `public/images/room.jpg` | https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=85 | Concert lighting; player art, post and discovery card |

## Media
The YouTube example `https://www.youtube.com/watch?v=ferZnZ0_rSM` is an NPR Music Tiny Desk performance used solely as a public provider playback example through YouTube’s official iframe mechanism. This is not a claim to music rights or affiliation. No recording is downloaded, copied or hosted. The iframe loads only on request and can be unloaded; provider restrictions may prevent playback. Confirm owner embed availability in the user’s browser before relying on it for a demonstration. YouTube is the fallback destination.

## Other
Lucide React icons: ISC license, installed package. System Arial/Helvetica/sans-serif font stack. All stickers and abstract graphic shapes are CSS/text, not artist artwork.

## Addendum 01 original decoration assets
`public/decorations/pixel-heart.gif` is an original 64×64, four-frame pixel heart constructed locally from a hand-specified 8×7 bitmap using Pillow. It has a slow 1.6-second cycle and an 809-byte file size. `src/lib/demo-heart.json` embeds that same GIF for instant local preview and persistence without a remote request. No third-party artwork or generated artist imagery is used. All other theme decorations (hearts, stars, butterfly-like glyphs, CSS flame silhouettes, pixel bits, glitter, checkerboards, chrome and soft gradients) are original CSS or Unicode text using installed fonts. They are pointer-inert, scoped and covered by motion controls.

## Living Fan Space assets and provenance
- Existing stock photographs are reused only as clearly labelled illustration of fictional fan memories. They are not represented as actual Nova concert photography or real fan uploads. Original Unsplash source/license records above are unchanged.
- `MemoryVisual` renders original typographic desk prints (B-side people / You can sit with us), a fictional non-admission ticket, and a cassette with local CSS/text. No artist portrait, lyrics, record sleeve or third-party fan artwork was copied/generated.
- `public/videos/leave-your-mark.mp4` and `public/videos/bside-people.mp4` are original six-second, 800×450, H.264 silent typography studies made locally with FFmpeg colour/drawbox/drawtext filters and installed DejaVu Sans fonts. No recording, artist performance, likeness or borrowed footage is embedded. They are labelled as demo studies, not genuine submitted concert clips or covers.
- `docs/research/myspace-2007-slide-23.png` is a faithful research rendering of page 23 in Peter Godwin's [2007 INFORUM presentation](https://www.inforum.cz/pdf/2007/godwin-peter1.pdf#page=23). It is historical evidence with third-party profile/advertising imagery; no reusable licence is claimed. It stays in research documentation and is not a product asset. No original MySpace branding/layout/code is copied into Stan Army.

## Army Player audio and skins
- `public/audio/midnight-circuit.mp3` and `public/audio/window-seat.mp3` are original 24-second instrumental sketches synthesized from mathematical oscillators, envelopes and pulse patterns in `scripts/create-demo-audio.py`, then encoded locally with FFmpeg/libmp3lame. No recordings, vocals, samples, commercial tracks or artist imitations were used. These are prototype audio, not Nova Reign releases. Runtime needs no generator or external service.
- Four original CSS skins (Classic desktop, Bubblegum Y2K, Quiet hours, Toxic chrome) reinterpret tactile player conventions. No Winamp/Webamp code, bitmap skin, logo or artist art is imported. Skins are fixed enum choices, not arbitrary uploaded archives.
- `docs/research/webamp-equalizer-reference.png` is the inspected [Webamp documentation image](https://docs.webamp.org/assets/images/equalizer-skin-664931adc37bb602f20904b3e91e6fa1.png), retained solely as a research quotation. It is not a product asset and no reusable skin-art licence is claimed. See `research/ARMY_PLAYER_REFERENCES.md` for distinctions between current documentation, preservation and retrospective evidence.
- The existing NPR/YouTube performance remains an explicit click-to-load provider example, never represented as Nova's catalogue. The two existing silent original MP4 studies are reused in the unified player. No copyrighted performance is copied into local files.

## Supplied Spotify playlist
The user supplied https://open.spotify.com/playlist/0EO3CxjNLb1gFi9QuPT6YE for this iteration. The compact, fixed Spotify embed at https://open.spotify.com/embed/playlist/0EO3CxjNLb1gFi9QuPT6YE?theme=0 returned HTTP 200 during validation. Spotify supplies any cover artwork/audio through its own iframe after consent; no tracks or cover artwork have been downloaded into the repository and no ownership/licensing claim is made. It is not presented as fictional artist Nova Reign’s official catalogue. Sign-in, regional availability, previews and playback restrictions remain Spotify’s responsibility.

## Stan Army composer icons
`src/components/stan-icons.tsx` contains original inline SVG UI drawings for Photo and GIF, created for Stan Army. The Photo silhouette incorporates a small star detail; GIF uses an explicit letterform inside a frame. They use currentColor and decorative SVG semantics inside labelled buttons. No external artwork, icon font or generated image asset is used for these two icons; other existing interface icons remain unchanged.
- `StanPollIcon` extends the original SVG set with a familiar chart silhouette. It is drawn locally in the same component file; no borrowed artwork.

## GIF/emoji picker
`public/gifs/leave-your-mark.gif` and `bside-people.gif` are original two-second, 240px-wide GIF conversions of the existing original silent MP4 typography studies, generated with FFmpeg at 8 fps. Matching PNGs are still frames from 0.6 seconds, used for reduced-motion-friendly picker previews. Each GIF is under 20 KB; no artist recording, fan art or GIPHY asset is copied. Emoji are Unicode characters rendered using the visitor’s system font. `StanEmojiIcon` is another original inline SVG. GIPHY is an explicitly labelled external search destination (`https://giphy.com/search/<encoded-query>`), not the source of the local GIF collection or an active API integration.

## Consistent interface markers
StanStarIcon and StanCommunityIcon in src/components/stan-icons.tsx are original inline SVG interface drawings. They replace colour-font glyphs in identity/chat/board headings so the theme’s accent/contrast controls affect their strokes reliably. They do not redraw or replace the supplied hand-drawn Stan Army logo, which remains the original image asset.

## Culture-first landing hero — user-authorised original illustration
`public/brand/stan-army-welcome-sneaks.png` is a 1448×1086 original generated marketing collage made with imagegen, using the user’s attached welcome-image preview as visual reference under their express “feel free to make your own” instruction. Their `/Users/armi/.../stanarmy-welcomeimage.png` path was not available as a downloadable workspace file; this is an original matching illustration, not a byte-for-byte copy or licensed stock photograph. The central figure is an anonymous fictional fan, not a claimed artist identity or Nova artwork. Existing artist/fan stock photographs and the original supplied hand-drawn logo are unchanged.

The user explicitly restored the `s/` visual labels and then changed the footwear label to `s/sneaks`: the final image reads `s/brie`, `s/popmusic`, `s/sneaks`. These are conceptual visual nods, not links, reserved boards or routing changes. No artist endorsement, brand affiliation, photography licence or actual membership is claimed. Original generated outputs are retained under `/workspace/generated_images/`; the final source output is `exec-ebab6886-688d-4116-a273-8971a46d4b7a.png`. The public filename is distinct to avoid stale image-optimizer caches after label revisions.
