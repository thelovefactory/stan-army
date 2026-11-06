import test from "node:test";
import assert from "node:assert/strict";
import {
  validateMark,
  safeNoteStyle,
  fanNotes,
  memories,
  memoryById,
  fanVideoStudies,
} from "../src/lib/fan-space";
import { readFileSync, existsSync } from "node:fs";
test("fan contributions reject blank, too-short and oversized notes; free text is kept as text", () => {
  for (const text of ["", "  ", "a", "x".repeat(501)])
    assert.ok(validateMark(text));
  assert.equal(validateMark("  hi  "), null);
  assert.equal(validateMark("x".repeat(500)), null);
  assert.equal(validateMark("<script>not executable markup</script>"), null); // React renders this as text, never HTML.
});
test("contribution style is restricted independently of arbitrary user text", () => {
  assert.equal(safeNoteStyle("scrapbook"), "scrapbook");
  assert.equal(safeNoteStyle("photo"), "photo");
  for (const value of [
    "<style>",
    "note hacked",
    "url(https://x.test)",
    "__proto__",
  ])
    assert.equal(safeNoteStyle(value), "note");
});
test("gallery IDs resolve only to approved original/stock content; unknown query parameters cannot supply an image URL", () => {
  assert.equal(memoryById("https://tracker.test/image"), undefined);
  assert.equal(memoryById("<script>"), undefined);
  assert.ok(memoryById("bside-print"));
  assert.equal(new Set(memories.map((m) => m.id)).size, memories.length);
  for (const memory of memories)
    if (memory.image) assert.ok(memory.image.startsWith("/images/"));
  assert.equal(new Set(fanNotes.map((n) => n.id)).size, fanNotes.length);
});
test("local video studies are real MP4 files with no third-party URL or missing clip", () => {
  for (const study of fanVideoStudies) {
    assert.match(study.src, /^\/videos\/[a-z-]+\.mp4$/);
    const path = "public" + study.src;
    assert.ok(existsSync(path));
    const bytes = readFileSync(path);
    assert.equal(bytes.subarray(4, 8).toString(), "ftyp");
    assert.ok(bytes.length < 1024 * 1024);
  }
});
