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
