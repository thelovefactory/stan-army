import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  adjacentItem,
  formatTime,
  itemFor,
  playerItems,
  safeSeek,
} from "../src/lib/player";
import {
  defaultTheme,
  parseTheme,
  playerSkins,
  presets,
  saveProfileTheme,
  storageKey,
  validateTheme,
} from "../src/lib/theme";

test("one catalogue offers separate music/video queues and known safe media sources", () => {
  assert.equal(playerItems.filter((i) => i.mode === "music").length, 2);
  assert.equal(playerItems.filter((i) => i.mode === "video").length, 3);
  assert.equal(new Set(playerItems.map((i) => i.id)).size, playerItems.length);
  for (const item of playerItems) {
    if (item.kind === "embed") {
      assert.equal(new URL(item.src).hostname, "www.youtube-nocookie.com");
      assert.equal(new URL(item.source).hostname, "www.youtube.com");
    } else {
      assert.match(item.src, /^\/(audio|videos)\/[a-z-]+\.(mp3|mp4)$/);
      assert.ok(existsSync("public" + item.src));
    }
  }
  assert.equal(itemFor("javascript:alert(1)").id, "midnight-circuit");
  assert.equal(itemFor("unknown", "video").mode, "video");
});
test("transport selection wraps only within its current mode and seek/time handle unloaded metadata", () => {
  assert.equal(adjacentItem("window-seat", 1).id, "midnight-circuit");
  assert.equal(adjacentItem("midnight-circuit", -1).id, "window-seat");
  assert.equal(adjacentItem("npr-sample", 1).id, "mark");
  assert.equal(adjacentItem("mark", -1).id, "npr-sample");
  assert.equal(safeSeek(-20, 24), 0);
  assert.equal(safeSeek(100, 24), 24);
  assert.equal(safeSeek(12, 24), 12);
  assert.equal(safeSeek(Infinity, 24), 0);
  assert.equal(safeSeek(12, NaN), 0);
  assert.equal(formatTime(24.9), "0:24");
  assert.equal(formatTime(125), "2:05");
  assert.equal(formatTime(NaN), "0:00");
});
test("pre-player v1 themes preserve their customisations and receive only a safe player default", () => {
  const old = structuredClone(presets[1].theme) as unknown as Record<
    string,
    unknown
  >;
  delete old.playerSkin;
  const raw = JSON.stringify(old);
  const migrated = parseTheme(raw);
  assert.equal(migrated.playerSkin, "desktop");
  for (const key of [
    "preset",
    "background",
    "colors",
    "font",
    "panels",
    "decorations",
    "images",
  ] as const)
    assert.deepEqual(migrated[key], old[key]);
  const map = new Map([[storageKey("artist:nova-reign"), raw]]);
  const storage = {
    getItem: (key: string) => map.get(key) || null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
  saveProfileTheme(storage, "army:army-nova", {
    ...migrated,
    playerSkin: "toxic",
  });
  assert.equal(map.get(storageKey("artist:nova-reign")), raw);
  assert.equal(
    parseTheme(map.get(storageKey("army:army-nova"))!).playerSkin,
    "toxic",
  );
});
test("four player skins are enum-only, persist in the existing theme schema, and reject CSS/URL injection", () => {
  assert.equal(Object.keys(playerSkins).length, 4);
  for (const skin of Object.keys(playerSkins)) {
    const result = validateTheme({ ...defaultTheme, playerSkin: skin });
    assert.equal(result.playerSkin, skin);
    assert.equal(parseTheme(JSON.stringify(result)).playerSkin, skin);
  }
  for (const playerSkin of [
    "url(https://evil.test)",
    "desktop hacked",
    "__proto__",
    "<script>",
  ])
    assert.equal(
      validateTheme({ ...defaultTheme, playerSkin }).playerSkin,
      "desktop",
    );
});
