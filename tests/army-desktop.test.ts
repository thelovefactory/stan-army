import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_DESKTOP, DESKTOP_COLUMNS, OWNER_DESKTOP_KEY, PANEL_IDS, PERSONAL_DESKTOP_KEY,
  chatFirstDesktop, movePanel, overlaps, packDesktop, parseDesktop, parseOwnerDesktop,
  resizePanel, validateDesktop,
} from "../src/lib/army-desktop";
import type { DesktopLayout } from "../src/lib/army-desktop";

function assertPacked(layout: DesktopLayout) {
  const packed = packDesktop(layout);
  assert.equal(packed.length, PANEL_IDS.length - layout.minimized.length);
  for (const item of packed) {
    assert.ok(item.x >= 0 && item.y >= 0);
    assert.ok(item.x + item.width <= DESKTOP_COLUMNS);
    for (const other of packed) if (item.id !== other.id) assert.equal(overlaps(item, other), false);
  }
  return packed;
}

test("desktop starts with a larger feed, usable chat, stereo and a separate board without overlaps", () => {
  const packed = assertPacked(DEFAULT_DESKTOP);
  assert.deepEqual(packed.map(({id, x, y}) => [id, x, y]), [["feed", 0, 0], ["chat", 8, 0], ["music", 8, 4], ["board", 0, 7]]);
  assert.deepEqual(packDesktop(DEFAULT_DESKTOP), packed);
});

test("chat-first trades space with discussions and resizing reflows neighbours without mutating defaults", () => {
  const before = structuredClone(DEFAULT_DESKTOP);
  const chatFirst = chatFirstDesktop();
  const packed = assertPacked(chatFirst);
  const chat = packed.find((item) => item.id === "chat")!;
  const board = packed.find((item) => item.id === "board")!;
  assert.equal(chat.width, 8);
  assert.equal(board.width, 4);
  assert.equal(chat.y, board.y);
  const wide = resizePanel(chatFirst, "chat", {width: 12, height: 7});
  assertPacked(wide);
  assert.ok(packDesktop(wide).find((item) => item.id === "board")!.y >= 7);
  const moved = movePanel(wide, "board", 0);
  assert.equal(assertPacked(moved)[0].id, "board");
  assert.deepEqual(DEFAULT_DESKTOP, before);
});

test("minimized panels are packed out and return predictably without changing their saved size", () => {
  const layout = {...structuredClone(DEFAULT_DESKTOP), minimized: ["feed" as const]};
  const packed = assertPacked(layout);
  assert.ok(packed.every((item) => item.id !== "feed"));
  assert.deepEqual(layout.sizes.feed, DEFAULT_DESKTOP.sizes.feed);
  assert.deepEqual(packDesktop({...layout, minimized: []}), packDesktop(DEFAULT_DESKTOP));
  assert.deepEqual(packDesktop({...layout, minimized: [...PANEL_IDS]}), []);
});

test("stored layouts reject foreign IDs, styling, forged roles and unsafe geometry while preserving all known panels", () => {
  const layout = validateDesktop({version: 1, order: ["chat", "chat", "<script>", "bogus"], minimized: ["music", "music", "bogus"], role: "host", css: "url(evil)", sizes: {
    chat: {width: -100, height: 9000}, feed: {width: "100%", height: NaN}, music: {width: Infinity, height: 2.3}, board: {width: 100000, height: -30},
  }});
  assert.deepEqual(layout.order, ["chat", "feed", "music", "board"]);
  assert.deepEqual(layout.minimized, ["music"]);
  assert.deepEqual(layout.sizes.chat, {width: 4, height: 8});
  assert.deepEqual(layout.sizes.feed, DEFAULT_DESKTOP.sizes.feed);
  assert.deepEqual(layout.sizes.board, {width: 12, height: 2});
  assert.equal(JSON.stringify(layout).includes("host"), false);
  assert.equal(JSON.stringify(layout).includes("evil"), false);
  assertPacked(layout);
  for (const raw of [null, "{", "null", '{"version":2}', "x".repeat(9000)]) assert.deepEqual(parseDesktop(raw), DEFAULT_DESKTOP);
  const copy = parseDesktop(null); copy.order.reverse();
  assert.equal(DEFAULT_DESKTOP.order[0], "feed");
});

test("many width/height combinations remain bounded and collision-free after reordering", () => {
  for (let index = 0; index < 180; index++) {
    const sizes = Object.fromEntries(PANEL_IDS.map((id, n) => [id, {width: 4 + (index * 7 + n * 3) % 9, height: 2 + (index * 5 + n) % 7}]));
    const order = PANEL_IDS.map((_, n) => PANEL_IDS[(n + index) % 4]);
    assertPacked(validateDesktop({version: 1, order, sizes, minimized: []}));
  }
});

test("owner appearance and personal layout are separate, versioned and cannot supply permissions or executable styles", () => {
  assert.notEqual(PERSONAL_DESKTOP_KEY, OWNER_DESKTOP_KEY);
  const owner = parseOwnerDesktop(JSON.stringify({version: 1, role: "host", look: "chrome", participation: "pink", layout: chatFirstDesktop()}));
  assert.equal(owner.look, "chrome");
  assert.equal(owner.participation, "pink");
  assert.deepEqual(parseDesktop(null, owner.layout), owner.layout);
  assert.deepEqual(parseDesktop(JSON.stringify(DEFAULT_DESKTOP), owner.layout), DEFAULT_DESKTOP);
  assert.deepEqual(parseOwnerDesktop(JSON.stringify(owner)), owner);
  assert.equal(JSON.stringify(owner).includes("role"), false);
  const unsafe = parseOwnerDesktop('{"version":1,"look":"url(evil)","participation":"<script>"}');
  assert.equal(unsafe.look, "electric"); assert.equal(unsafe.participation, "mint");
});
