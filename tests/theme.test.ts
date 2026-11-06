import test from "node:test";
import assert from "node:assert/strict";
import {
  contrast,
  defaultTheme,
  loadProfileTheme,
  saveProfileTheme,
  MAX_TOTAL_ASSET_BYTES,
  parseTheme,
  presets,
  readableColor,
  storageKey,
  validateTheme,
  validAsset,
} from "../src/lib/theme";
import heart from "../src/lib/demo-heart.json";

test("all six presets validate, remain independent, and round-trip as versioned JSON", () => {
  assert.equal(presets.length, 6);
  assert.equal(new Set(presets.map((p) => p.id)).size, 6);
  for (const preset of presets) {
    const roundTrip = parseTheme(JSON.stringify(preset.theme));
    assert.deepEqual(roundTrip, preset.theme);
    const saved = validateTheme(preset.theme);
    saved.colors.text = "#123456";
    assert.notEqual(preset.theme.colors.text, saved.colors.text);
  }
});
test("theme input rejects free CSS, unknown enum values, URL injection and unsupported versions", () => {
  const result = validateTheme({
    ...defaultTheme,
    font: "Arial; background:url(https://tracker.test)",
    background: {
      color: "red;position:fixed",
      image: { dataUrl: "https://tracker.test/a.gif" },
      size: "999999px",
      position: "absolute",
      attachment: "sticky",
    },
    panels: {
      opacity: -50,
      border: "url(x)",
      corners: "999px",
      color: "var(--x)",
    },
    colors: { text: "url(https://tracker.test)" },
  });
  assert.equal(result.font, "original");
  assert.equal(result.background.image, null);
  assert.equal(result.background.size, "cover");
  assert.equal(result.background.color, defaultTheme.background.color);
  assert.equal(result.panels.opacity, 0);
  assert.equal(result.panels.border, "solid");
  assert.equal((result as unknown as Record<string, unknown>).css, undefined);
  assert.deepEqual(
    validateTheme({ ...defaultTheme, schemaVersion: 999 }),
    defaultTheme,
  );
  assert.deepEqual(parseTheme("{bad json"), defaultTheme);
  assert.deepEqual(parseTheme("null"), defaultTheme);
});
test("raster assets reject SVG, external URLs, oversized and forged metadata, preserve GIF animation", () => {
  const gif = validAsset(heart);
  assert.ok(gif);
  assert.equal(gif.animated, true);
  assert.deepEqual(validAsset({ ...heart, animated: false }), gif);
  assert.equal(validAsset({ ...heart, mime: "image/svg+xml" }), null);
  assert.equal(
    validAsset({ ...heart, dataUrl: "https://example.com/test.gif" }),
    null,
  );
  assert.equal(
    validAsset({
      ...heart,
      dataUrl: "data:image/gif;base64,R0lGODlh);background:url(x)",
    }),
    null,
  );
  assert.equal(validAsset({ ...heart, bytes: heart.bytes + 1 }), null);
  assert.equal(validAsset({ ...heart, width: 4097 }), null);
  assert.equal(validAsset({ ...heart, mime: "image/png" }), null);
  assert.ok(
    validAsset(
      parseTheme(
        JSON.stringify({
          ...defaultTheme,
          background: { ...defaultTheme.background, image: heart },
        }),
      ).background.image,
    ),
  );
});
test("combined asset budget is enforced after storage restore", () => {
  // A signature-matched raster with a large payload demonstrates aggregate-budget rejection.
  const bytes = 400000;
  const payload = Buffer.concat([
    Buffer.from("GIF89a"),
    Buffer.alloc(bytes - 6),
  ]);
  const asset = {
    ...heart,
    dataUrl: `data:image/gif;base64,${payload.toString("base64")}`,
    bytes,
  };
  assert.ok(asset.bytes * 3 > MAX_TOTAL_ASSET_BYTES);
  assert.ok(validAsset(asset));
  const result = validateTheme({
    ...defaultTheme,
    background: { ...defaultTheme.background, image: asset },
    images: { banner: asset, avatar: asset },
  });
  assert.equal(result.background.image, null);
  assert.equal(result.images.banner, null);
  assert.equal(result.images.avatar, null);
});
test("readability fallbacks exceed 4.5:1 even for deliberately clashing colours", () => {
  for (const bg of ["#ffffff", "#000000", "#808080", "#ff00ff", "#bada55"]) {
    assert.ok(contrast(readableColor(bg, bg), bg) >= 4.5);
  }
  assert.equal(readableColor("#ffffff", "#000000"), "#ffffff");
});
test("artist and fan theme storage is isolated by profile and content stays outside schema", () => {
  assert.notEqual(
    storageKey("artist:nova-reign"),
    storageKey("artist:atlas-noir"),
  );
  assert.notEqual(
    storageKey("artist:nova-reign"),
    storageKey("fan:nova-reign"),
  );
  const result = validateTheme({
    ...defaultTheme,
    messages: ["evil"],
    role: "manager",
    artistId: "another-artist",
    css: "body{display:none}",
    html: "<script/>",
  });
  assert.deepEqual(result, defaultTheme);
});

test("saved artist and fan settings survive store reloads; cancellation drafts cannot mutate saved settings", () => {
  const map = new Map<string, string>();
  const storage = {
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
    getItem: (key: string) => map.get(key) || null,
  };
  const selected = structuredClone(presets[1].theme);
  selected.background.image = validAsset(heart);
  saveProfileTheme(storage, "artist:nova-reign", selected);
  saveProfileTheme(storage, "fan:jess-wav", presets[4].theme);
  assert.deepEqual(loadProfileTheme(storage, "artist:nova-reign"), selected);
  assert.equal(
    loadProfileTheme(storage, "fan:jess-wav").preset,
    "digital-dream",
  );
  assert.deepEqual(
    loadProfileTheme(storage, "artist:atlas-noir"),
    defaultTheme,
  );
  const unsaved = loadProfileTheme(storage, "artist:nova-reign");
  unsaved.colors.text = "#000000";
  assert.notEqual(
    loadProfileTheme(storage, "artist:nova-reign").colors.text,
    unsaved.colors.text,
  );
  saveProfileTheme(storage, "artist:nova-reign", defaultTheme);
  assert.deepEqual(
    loadProfileTheme(storage, "artist:nova-reign"),
    defaultTheme,
  );
  assert.throws(
    () =>
      saveProfileTheme(
        {
          setItem: () => {
            throw new Error("Quota exceeded");
          },
        },
        "artist:nova-reign",
        selected,
      ),
    /Quota exceeded/,
  );
  assert.deepEqual(
    loadProfileTheme(
      {
        getItem: () => {
          throw new Error("Storage denied");
        },
      },
      "fan:jess-wav",
    ),
    defaultTheme,
  );
});
