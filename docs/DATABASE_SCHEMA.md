# Database design — fan-led model (conceptual only)

No database, migrations, SQL, Supabase service or API endpoints are created. The following is a proposed persistent model, revised from the original artist-owned-page design. UUIDs and timestamps are design assumptions.

| Entity | Proposed responsibilities and relationships | Integrity / access boundary |
| --- | --- | --- |
| users / profiles | Stable internal user ID, auth subject, unique personal handle, public profile and privacy settings | Self-edit; provider linking requires verified control; private data excluded from public views |
| artists | Catalogue identity, name, disambiguation, public artist references | Not inherently a user, community owner or verified account |
| artist_catalogue_refs | Artist, provider, provider artist ID, review provenance | Unique reviewed provider identity where appropriate; catalogue presence does not verify a user |
| armies | Artist, unique community address, historical founder user, community welcome, lifecycle state | One canonical Army per artist; unique reserved-aware address; public published reads |
| army_memberships | Army, user, community role, granted-by/at, status | Unique Army/user; owner/admin/moderator/member permissions independent of artist verification |
| army_invitations | Army, recipient, role, expiry, token digest and acceptance | Explicit scoped grants; single-use expiring invitation; protect last owner |
| artist_relationships | User, artist, artist/representative type, verification state, approved scopes, review record, expiry/revocation | Official status only after review; portable across platform; no implicit Army grant |
| verification_requests | Applicant, artist, relationship claim, evidence references, review state | Restricted evidence access; no public sensitive documents; never grant on payment |
| handle_reservations / identity_disputes | Sensitive user identities, claims, reviewer decisions and appeal history | Prevent impersonation; separate from fan community stewardship |
| army_links | Army, validated provider URL and ordering | Fan steward edits; provider-aware embeds, safe fallback |
| army_announcements | Army, community author, body, timestamps/pin state | Explicit fan admin publishing/pinning permission |
| official_announcements | Artist, optional Army context, author relationship, content, timestamp | Verified scoped relationship required; displayed distinctly from community pins |
| posts / reactions | Army, author, content, visibility; reaction tuples | Role/access rules and unique reactions; no UI-only visibility protection |
| rooms / messages | One room per Army; author, body, timestamps and moderation state | Membership policy, sanctions and rate limits apply before writes/delivery |
| reports / sanctions | Reporter, target, scoped moderator/reviewer, reasons, actions and appeal | Protect reporter identity; audit restricted actions |
| events | Army, organiser user/type, venue/time/timezone, validated ticket link | Fan event must not imply artist appearance; official events need authorized provenance |
| editorial_picks | Army, curator, ordering and active interval | Editorial/organic only; paid campaigns cannot modify this ranking |
| profile_themes | Target Army or fan user, schema version, settings JSONB, revision, updater and timestamps | One record per target; Army grant or self-only fan update; settings contain no authorization fields |
| stewardship_reviews / transfers | Army, current/recipient stewards, consent, notices, reviewer decision, continuity assessment, appeal | No automatic transfer; preserve founder attribution and history |
| audit_events | Actor, target, action, timestamp and safe metadata | Privileged changes recorded server-side; immutable to clients |

## Confirmed identity and permission rules
Community ownership is a membership/grant concept. Historical founding attribution is distinct from current administrative stewardship. Artist verification is a user/artist relationship. An Army address is a community identifier, not an artist's official handle. These relationships must not collapse into one slug, account flag or subscription record.

Artist/representative verification never automatically grants Army ownership, theme edit rights, community pin control or moderation. A fan founder is not authorized to publish as the artist merely by founding an Army. Explicit separate grants can coexist, but authorization must check the capability relevant to each operation. Official relationship revocation must stop future official writes without deleting community history or transferring ownership.

Creation requires transactional artist/address uniqueness, conflict review and duplicate-resolution redirects. No public claim should be finalized from a display-name match alone. Subdomain aliases should reference stable Army IDs. A duplicate merge or stewardship transfer must preserve membership/history references and provide an audited, reviewed process.

## Stewardship continuity
Inactivity is not abandonment; active moderators and continuing care matter. Use notices, platform review, continuity planning, documented decisions and appeal. The 90-day/30-day examples remain provisional and are not implemented as timers or policy enforcement. Voluntary transfer needs owner consent and recipient acceptance; no automated ownership transfer, paid takeover or artist takeover is permitted.

## Future financial entities — not implemented
`army_plans`, `army_subscriptions`, `army_entitlements`, `funding_contributions`, `campaigns`, `campaign_approvals`, `budget_ledger`, `placements`, `performance_reports`, `refunds` and provider webhook records should be separate domains. Entitlements attach to an Army, while payer identity and contributor consent are separate. Professional tools may attach to a verified organisation/user relationship without acquiring the Army. Final pooled-funding, credit and refund models remain undecided. No billing schema is finalized.

## Security, indexing and lifecycle
Enable RLS with default-deny mutations. Authenticate actors server-side; never trust submitted user IDs, dropdown roles or JSON ownership flags. Index canonical artist/address lookup, Army/user membership, room/time message cursors, and announcement/post timelines. Constrain last-owner transitions, idempotent enlistment and unique reactions. Use signed storage access for entitled media.

Define regions, retention, export/deletion, evidence protection, minimum age, public membership visibility, abuse/copyright operations and audit retention before production. Verified identity is not a copyright licence. Auth linking, representative authority and official media rights need separate proofs.

## Local theme migration implemented now
The browser reads `stan-army:theme:v1:army:<stableArmyId>`, falling back to the explicitly mapped `stan-army:theme:v1:artist:<legacySlug>` only when the new key is absent. The schema remains v1 because presentation fields did not change; only the target identity changes. Old keys are retained. New-key saves are validated; storage failure never deletes an old theme. Fan keys stay unchanged. Future storage processing should replace inline image data with reviewed asset references while retaining explicit schema migration and rollback support.
