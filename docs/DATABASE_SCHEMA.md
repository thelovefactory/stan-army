# Proposed database schema — design only

No database, migrations or backend services are created in Milestone 1. This is a starting model for M2/M3 review, not an applied schema. Use Postgres UUID keys and timestamped records. Auth provider IDs never become the public application identity.

| Entity              | Purpose and key constraints                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| users               | Internal user ID, normalized unique handle, display name, avatar reference, lifecycle status. Auth identities link to this ID.                                       |
| auth_identity_links | Unique `(provider, provider_subject)` mapped to user; privileged verified linking/unlinking only. Avoid duplicating secrets from the auth service.                   |
| artists             | Unique normalized handle, name, bio, genre, owner ID, avatar/banner storage references and publication state. Genuine verification is a separately privileged field. |
| artist_memberships  | Unique `(artist_id, user_id)`; artist-specific owner/editor/moderator/analyst permissions. Global admin privileges are separately administered.                      |
| invitations         | Artist, invited identity, intended membership role, hashed one-time token, expiry and acceptance state. Acceptance is transactional and server-authorized.           |
| enlistments         | Unique `(artist_id, user_id)`, creation time; canonical source for actual enlistment counts.                                                                         |
| artist_links        | Artist, validated provider/type, canonical HTTPS URL, display order. Provider metadata stays distinct from artist-entered content.                                   |
| posts               | Artist, author, body, approved media references, public/enlisted visibility, publish/moderation state.                                                               |
| post_reactions      | Unique `(post_id, user_id, reaction)`; aggregate only from real rows.                                                                                                |
| chat_messages       | Artist room, author, plain-text body, created/edited/deleted times and moderation state. Index `(artist_id, created_at, id)` for cursor pagination.                  |
| chat_reactions      | Unique `(message_id, user_id, reaction)`; permission follows room access.                                                                                            |
| room_pins           | Artist, message or announcement, privileged creator and active period.                                                                                               |
| moderation_actions  | Artist, target user/message, mute/ban/delete action, reason, actor and optional expiry; separate immutable audit evidence.                                           |
| reports             | Reporter, target type/ID, reason, status, resolution and reviewer. Protect reporter identity.                                                                        |
| events              | Artist, title, start/timezone and validated external ticket URL; no invented availability.                                                                           |
| media_assets        | Owner/artist, storage reference, validated type/size, processing/moderation status and retention metadata.                                                           |
| audit_events        | Privileged actor, operation, scoped resource, timestamp and minimal non-secret metadata. Append-only privileged writes.                                              |

## Policy requirements, not UI promises

- Published artist pages and public posts can be read publicly. Drafts and editing are limited to authorized artist membership. A manager accesses only explicitly invited artists; roster access does not grant cross-artist rights.
- Users edit their own allowed profile fields; never roles or verification. Each authenticated fan can create/delete only their own enlistment.
- Enlisted-only post bodies and media must be protected by server checks, RLS and storage access, including direct URL requests. Do not ship protected bodies in hidden client markup.
- Chat writes require the selected membership/enlistment rule, active account and absence of room mute/ban, plus shared rate limits. Pinning and moderation require artist-scoped roles; cross-room access tests are mandatory.
- Privileged service credentials stay server-side. Reports are visible to their reporter and authorized moderators; audit records cannot be altered by normal clients. Retention/export/deletion behavior must be defined before real user data.

## Unresolved before backend implementation

Choose the chat read/write enrollment rule, identity-linking representation compatible with Supabase Auth, ownership transfer policy, data retention windows and deletion/audit balance during M2 design. These do not affect the visual prototype. Billing, poll votes and subscriptions need separate M5 schema review; do not create speculative live billing tables now.
