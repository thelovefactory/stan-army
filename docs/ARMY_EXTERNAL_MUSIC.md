# Army stereo: service playback

The playground stereo now uses public music-service links rather than its previous local instrumental demo. The standard product model is a service-backed playlist/artist/album/track queue. Artist-authorised uploaded treats are a future exception; no upload, permissions or hosted-track queue is implemented here.

## Prototype behaviour

Army Stereo's panel editor accepts a public Spotify or Apple Music link. Use music link previews it; Save style commits the source on this device. Undo/redo and Cancel include source changes. Removing a source remains explicit across refresh and theme changes. Presentation presets preserve the configured music source.

Spotify artist, playlist, album and track links produce official embed URLs. Apple Music album/song/playlist links produce official embed URLs. Apple artist profiles use an external-link fallback: this prototype does not invent a top-tracks feed or claim an unsupported artist embed.

The player loads only after Listen. The loaded state uses the provider's own playback, queue, skip/back and seeking controls where offered. Stop removes the iframe, ending this page's playback. Open Spotify/Apple Music remains available. No custom button pretends to control an unconnected service. The initial Spotify playlist is the same example link already used elsewhere in the demo, with no fabricated track list or artist affiliation.

No service API token, account connection, metadata scraping or media download is involved. Links are validated and canonicalised; arbitrary iframe markup, foreign hosts, local audio URLs and credential-bearing URLs are rejected. Desktop panel nodes remain stable during row moves and swaps so a loaded iframe is not reinserted into the DOM by those operations. Source changes intentionally remount it.

Providers determine playback availability, previews, login/subscription requirements and the precise controls available. A public link is not a promise of full-length, continuous playback for every visitor. Spotify's troubleshooting guide specifically notes encrypted-media/browser issues and possible preview-only playback. Apple documents preview limits for signed-out listeners. Actual track playback was not authenticated or certified in this prototype.

## Official references, reviewed 8 November 2026

- Spotify, supported embed content and sizes: https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed
- Spotify, iframe controls: https://developer.spotify.com/documentation/embeds/references/iframe-api
- Spotify, playback troubleshooting: https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting
- Apple Music for Artists, marketing tools and preview behaviour: https://artists.apple.com/support/1117-apple-music-marketing-tools

## Validation scope

Unit tests cover supported/canonical URLs, invalid hosts and executable input, migration, explicit removal and theme independence. Browser checks cover click-to-load, Stop/unload, source editing, undo, Apple artist fallback and iframe DOM continuity during rearrangement. Automated provider-frame checks use clearly labelled fixtures to isolate app behaviour; they do not certify third-party playback.

## Native Spotify window refinement — 21 November 2026

The playground now displays the official player directly, with no duplicate transport controls or fabricated metadata. Spotify retains its branding, artwork, internal corners and controls; the Army window retains the host's frame and corner treatment. There is no automatic playback request. Loading the panel contacts the provider, whose cookies, account state and browser support determine the listening experience.

Army Stereo → panel menu → **Change music** opens a small native Stan Army form. Save validates and canonicalises the link and stores it in the existing device-local owner configuration. Cancel leaves the current source intact; Remove music explicitly clears it. This is prototype configuration, not authenticated owner authorization or server persistence. The existing style editor remains compatible.

**Show full playlist / Compact player** adjusts the window height and uses Spotify's 352px / 152px embed layouts. Ordinary resizing uses the full layout at five rows or taller. Source changes intentionally reload the player; changing size or opening settings preserves the iframe node. The provider frame is not recoloured by Army skins. When the available embed width falls below Spotify's 280px audio layout minimum, a source link is shown instead of a clipped player. Apple Music links remain supported.

References: Spotify's Creating an Embed, Widget Terms of Use, and Troubleshooting documentation (linked above). A custom Web Playback SDK player is outside this implementation.

Validation for this refinement: TypeScript, ESLint, the existing 10 test files, and the production build passed. Browser checks with a clearly labelled provider fixture passed edit/save/cancel/remove, invalid-link rejection, refresh persistence, compact/full sizes, iframe node preservation through settings/resize/minimise, and page overflow at 1440/390/320px. Provider fixtures verify only Stan Army behaviour; full Spotify playback was not certified.

### Responsive surface follow-up

The native iframe now fills the available width and height in expanded windows, with a 352px minimum for the full layout. Spotify's compact view retains a fixed internal height. The earlier compact-only frame snap has been removed so the outer window can align precisely with its neighbours at any height. Grid slots remain intact; expanding to five rows or more restores the fluid playlist surface. Link editing temporarily allows the form and player to scroll together. At mobile widths, the same bounds and narrow-width source-link fallback apply.

Browser geometry checks cover compact/full, wider and taller keyboard resizing, consistent 8px inset, no internal outer-window overflow, mobile fit, and retention of the same iframe node. Screenshots use the actual public Spotify embed; no authenticated playback was tested.


The official playlist embed was inspected at multiple viewport heights. Below 352px of player space it retains a 152px compact internal surface; at 352px it changes to the full playlist layout. The iframe fills the Army window, but Spotify may leave transparent space inside its own compact view at intermediate heights. We do not scale, crop or replace the provider controls to conceal this. Outer window resizing and edge alignment remain continuous and independent of these Spotify breakpoints.
