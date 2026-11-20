# Visual review checklist

Start with `/army/nova`. The first review is about visual direction and community experience, not production readiness. Desktop-first with fully usable mobile layout. Original logo integration remains pending asset recovery.

## Review scenarios (manual, pending browser availability)

1. At 1440×1000 and 390×844, review landing headline, imagery, CTAs, artist cards and footer; check no horizontal overflow at 320 px.
2. Discovery: search “London”; select a mismatched genre; confirm empty state and Reset filters. Switch Most Stanned and check descending demo counts. Favourites must say editorial, never paid.
3. Artist: STAN toggles once and toggles back without double counts. Share copies the room URL or presents it when clipboard is unavailable. Focus room hides hero/feed and retains music/chat. Post reaction toggles locally.
4. Chat: send nonblank text, confirm it appears as `@you.demo` with a timestamp; blank submit is disabled. Send `<script>alert(1)</script>` and verify it appears as literal text. Refresh and verify local messages clear.
5. Spotify: before clicking Load no provider iframe is loaded. After click, check the official sample embed and the direct-link fallback. Deny network and verify the direct URL remains visible. No automatic audio or synchronization claims.
6. Wizard: blank name/bad handle fails; valid identity advances. Select JPG/PNG/WebP under 5 MB and see local preview; reject unsupported/oversized files. Type bio, select genre, reject spoofed/insecure provider links, accept a supported HTTPS link, go Back and retain values. Finish explicitly says not saved/published. Edit remains possible.
7. Tab through navigation, STAN/share, focus toggle, player, chat and wizard. Check visible focus, accessible control names, mobile menu state, focus movement after wizard step and reduced-motion preference.
8. Visit an unknown artist handle for a 404. Review empty and error UI. Check all four demo rooms have the correct identity.

## Feedback to collect

Does it feel like an artist’s own corner of the internet? Is music/chat prominent enough? Is the nostalgia balanced with readability? Are the primary STAN and invitation actions clear? Is the distinction between demo and live features obvious? Capture desktop/mobile screenshots after the browser route is available. No backend implementation until this review.
