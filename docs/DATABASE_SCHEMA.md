# Database design — conceptual only

No database, SQL, migrations, Supabase project or backend endpoints are created in Milestone 1. This document describes proposed future boundaries. UUIDs, normalized memberships and timestamps are assumptions for design review, not deployed contracts.

## Proposed entities
| Entity | Key fields and relationships | Integrity / access requirement |
| --- | --- | --- |
| profiles | internal user UUID, auth subject reference, unique handle, display name, avatar reference, timestamps | Self-edit; private email stays in auth; public view excludes private fields |
| artists | UUID, unique slug, name, bio, genre, location, avatar/banner references, creation time | Anonymous published reads; owner/editor write via explicit grants |
| artist_memberships | artist UUID, user UUID, role (`owner`, `editor`, `moderator`, `manager`), inviter | Unique artist/user; roles server-enforced; last owner cannot be removed |
| artist_invitations | UUID, artist, invitee identity, role, token digest, expiry, inviter, accepted time | Single-use, expiring; explicit acceptance; avoid plaintext invite secrets |
| enlistments | user UUID, artist UUID, joined time | Unique user/artist pair; self insert/delete; no impersonation |
| artist_links | UUID, artist, provider, normalized HTTPS URL, display order | Provider-specific validation; no arbitrary script/embed HTML |
| posts | UUID, artist, author, content, visibility, published time | Public vs enlisted-only enforced in reads; authorized artist editor writes |
| post_reactions | post UUID, user UUID, reaction, timestamp | Unique user/post/reaction; entitled readers only |
| rooms | UUID, artist UUID, pinned message UUID | One persistent room per artist |
| messages | UUID, room, author, body, sent time, moderation state | Bounded body; membership policy, bans and server rate limit |
| message_reactions | message, user, reaction | Unique tuple, authorized room participants |
| room_sanctions | UUID, room, target user, moderator, kind, expiry, reason | Authorized moderator/admin writes, enforced before message creation |
| reports | UUID, reporter, target type/UUID, reason, state, timestamps | Reporter create; restricted moderation read; protect reporter identity |
| events | UUID, artist, title, start time/timezone, venue, validated ticket URL | Artist editors write, published public reads |
| editorial_picks | artist, ordering, curator, active interval | Admin curation only; never paid placement |
| audit_events | actor, artist/target, action, time, safe metadata | Privileged actions recorded server-side, immutable to clients |

`profiles.id` should remain stable across auth-provider changes. A Supabase auth user may initially map one-to-one to it; lifecycle and account-linking details need review. Manager access is per-artist membership, not ownership inferred from an email domain.

## Policy principles and query patterns
- Enable RLS before exposing any table to a public client; default deny writes.
- Never trust a submitted `user_id`, `role`, `artist_id`, published flag or entitlement without a server-side authorization check.
- Public artist/discovery views expose only intended fields. Enlistment counts are aggregate reads; full fan membership visibility needs a privacy decision.
- Enlisted-only post/media access is enforced in database policies and signed storage URLs, not hidden in UI alone.
- Index published artist slugs, genre/location search fields, artist/time posts, room/time messages and artist/user membership pairs. Consider full-text or trigram search only once measured needs justify it.
- Query message history with cursor pagination by `(sent_at, id)`; never subscribe to unbounded history.
- Enlistment uniqueness, grants and reaction uniqueness need database constraints plus tests under concurrent requests.
- Moderation authorization and bans must apply to HTTP writes and realtime channels consistently.

## Later billing and Battleground
Separate plans, subscriptions, entitlements, provider webhook events, polls, poll options and votes are later entities. Entitlements come from verified server-side billing state. Unique fan/poll vote constraints plus abuse controls will prevent duplicates. Provider playback remains individual unless genuinely supported. No billing schema is finalized now.

## Data lifecycle decisions still open
Region, retention periods, chat edit/delete history, minimum user age, public fan visibility, account export/delete behaviour, artist ownership transfer, copyright reporting and anonymous browsing must be agreed before production. Plan deletion cascades carefully: remove private user data while preserving necessary pseudonymized moderation/audit evidence under a documented retention policy.

## Addendum 01 — future presentation persistence
Implemented now: version-1 structured JSON in browser localStorage at `stan-army:theme:v1:artist:<slug>` or `stan-army:theme:v1:fan:<handle>`. Content and membership records are never placed in this theme object. Raw data URLs are a prototype-only asset representation.

Proposed later: `profile_themes` with `profile_kind`, target artist/profile UUID, `schema_version`, validated `settings` JSONB, revision, `updated_by`, and timestamps. Enforce one theme per target, with owner/editor/explicit manager RLS for artists and self-only fan writes. Public readers may retrieve published presentation settings, but must retain their independent clean-view preference. Do not trust an ownership field inside the JSON. Replace data URLs with validated storage asset references after authenticated upload processing; preserve one shared theme schema using a typed asset-reference layer. Migrate v1 settings through explicit version converters and reject unsupported future versions. Keep old settings available for rollback. This is a design only: no table, SQL migration, service or endpoint is created.
