import test from "node:test";
import assert from "node:assert/strict";
import {
  filterArmies,
  armies,
  artists,
  armyBySlug,
  armyPath,
  armyAddress,
  legacyArmy,
  initialArmyDraft,
  validateArmyDraft,
  suggestedAddress,
  canAdminArmy,
  canModerateArmy,
  canPublishOfficial,
  validateOfficialRequest,
} from "../src/lib/data";
test("discovery combines search, genre, location, ordering and favourites on Armies", () => {
  assert.deepEqual(
    filterArmies({
      search: " NOVA ",
      genre: "Alternative R&B",
      city: "Bristol, UK",
      collection: "New armies",
    }).map((v) => v.army.slug),
    ["nova"],
  );
  assert.equal(
    filterArmies({
      search: "nova",
      genre: "Electronic",
      city: "Everywhere",
      collection: "New armies",
    }).length,
    0,
  );
  assert.equal(
    filterArmies({
      search: "",
      genre: "All genres",
      city: "Everywhere",
      collection: "New armies",
    }).length,
    armies.length,
  );
  assert.equal(
    filterArmies({
      search: "",
      genre: "All genres",
      city: "Everywhere",
      collection: "Most stanned",
    })[0].army.id,
    "army-atlas",
  );
  assert.ok(
    filterArmies({
      search: "",
      genre: "All genres",
      city: "Everywhere",
      collection: "Our favourites",
    }).every((v) => v.army.favourite),
  );
});
test("Nova artist, founder and Army are independent, with a canonical local path and legacy alias", () => {
  const v = armyBySlug("nova")!;
  assert.equal(v.artist.officialHandle, "novareign");
  assert.equal(v.founder.handle, "jess.wav");
  assert.equal(v.army.slug, "nova");
  assert.equal(armyPath(v.army), "/armies/nova");
  assert.equal(armyAddress(v.army), "nova.stan.army");
  assert.equal(legacyArmy("nova-reign")?.army.id, v.army.id);
  assert.equal(legacyArmy("unknown"), undefined);
  assert.equal(new Set(armies.map((a) => a.artistId)).size, armies.length);
  assert.equal(new Set(armies.map((a) => a.slug)).size, armies.length);
});
test("official artist and representative permissions never imply community ownership or moderation", () => {
  for (const id of ["demo-nova", "demo-rep"]) {
    assert.ok(canPublishOfficial(id, "artist-nova"));
    assert.equal(canAdminArmy(id, "army-nova"), false);
    assert.equal(canModerateArmy(id, "army-nova"), false);
    assert.equal(canPublishOfficial(id, "artist-sienna"), false);
  }
  assert.ok(canAdminArmy("fan-jess", "army-nova"));
  assert.ok(canModerateArmy("fan-jess", "army-nova"));
  assert.equal(canPublishOfficial("fan-jess", "artist-nova"), false);
  assert.equal(canAdminArmy("fan-jess", "army-atlas"), false);
});
test("fan-led wizard blocks canonical duplicates even when typed rather than selected", () => {
  assert.ok(validateArmyDraft(initialArmyDraft, 0));
  assert.match(
    validateArmyDraft({ ...initialArmyDraft, artistName: " Nova Reign " }, 0)!,
    /already has/,
  );
  const echo = artists.find((a) => a.id === "artist-echo")!;
  assert.equal(
    validateArmyDraft(
      { ...initialArmyDraft, artistId: echo.id, artistName: echo.name },
      0,
    ),
    null,
  );
  assert.ok(
    validateArmyDraft({ ...initialArmyDraft, artistName: "Unlisted" }, 0),
  );
  assert.equal(
    validateArmyDraft(
      {
        ...initialArmyDraft,
        artistName: "Unlisted",
        artistContext: "Bristol synth-pop trio, public catalogue pending",
      },
      0,
    ),
    null,
  );
});
test("Army addresses reject invalid, reserved, conflicting and official-looking claims", () => {
  for (const address of [
    "-nova",
    "nova-",
    "a.b",
    "A_B",
    "api",
    "nova",
    "official-nova",
    "a".repeat(64),
  ])
    assert.ok(validateArmyDraft({ ...initialArmyDraft, address }, 1), address);
  assert.equal(
    validateArmyDraft({ ...initialArmyDraft, address: "echo-valentine" }, 1),
    null,
  );
  assert.ok(
    validateArmyDraft({ ...initialArmyDraft, address: "echo-valentine" }, 1, [
      "echo-valentine",
    ]),
  );
  assert.equal(suggestedAddress("Écho Valentine!"), "echo-valentine");
  assert.ok(validateArmyDraft(initialArmyDraft, 2));
  assert.equal(
    validateArmyDraft(
      { ...initialArmyDraft, welcome: "We are fans making a home together." },
      2,
    ),
    null,
  );
});
test("official request validates evidence without granting privileges", () => {
  const request = {
    artistId: "artist-nova",
    kind: "representative" as const,
    handle: "nova.team",
    evidenceUrl: "https://example.com/team",
    details:
      "I represent this artist; public authority would need independent platform review.",
  };
  assert.equal(validateOfficialRequest(request), null);
  for (const evidenceUrl of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:secret@example.com",
  ])
    assert.ok(validateOfficialRequest({ ...request, evidenceUrl }));
  assert.ok(validateOfficialRequest({ ...request, details: "Trust me" }));
  assert.ok(validateOfficialRequest({ ...request, artistId: "unknown" }));
  assert.equal(canAdminArmy("demo-rep", "army-nova"), false);
});

test("fan welcome preserves optional safe music-link behaviour and rejects unsafe URLs", () => {
  const draft = {
    ...initialArmyDraft,
    welcome: "Come share the songs that brought us here.",
  };
  assert.equal(validateArmyDraft(draft, 2), null);
  assert.equal(
    validateArmyDraft(
      { ...draft, musicLink: "https://bandcamp.com/discover" },
      2,
    ),
    null,
  );
  for (const musicLink of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:secret@example.com",
    "bad link",
  ])
    assert.ok(validateArmyDraft({ ...draft, musicLink }, 2));
});
