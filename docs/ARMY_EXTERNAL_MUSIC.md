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
