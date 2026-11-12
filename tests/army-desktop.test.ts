import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_DESKTOP, DESKTOP_COLUMNS, OWNER_DESKTOP_KEY, PANEL_IDS, PERSONAL_DESKTOP_KEY,
  chatFirstDesktop, movePanel, overlaps, packDesktop, parseDesktop, parseOwnerDesktop,
  canMovePanelRow, movePanelRow, resizePanel, validateDesktop, placePanel, setPanelMinimized, swapPanelSlots,
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
  assert.deepEqual(packed.map(({id, x, y}) => [id, x, y]), [["feed", 0, 0], ["chat", 8, 0], ["music", 8, 4], ["board", 0, 7], ["stancam", 8, 7]]);
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
  assert.deepEqual(layout.order, ["chat", "feed", "music", "board", "stancam"]);
  assert.deepEqual(layout.minimized, ["music"]);
  assert.deepEqual(layout.sizes.chat, {width: 4, height: 8});
  assert.deepEqual(layout.sizes.feed, DEFAULT_DESKTOP.sizes.feed);
  assert.deepEqual(layout.sizes.board, {width: 12, height: 3});
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
    const order = PANEL_IDS.map((_, n) => PANEL_IDS[(n + index) % PANEL_IDS.length]);
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
  assert.equal(unsafe.look, "black"); assert.equal(unsafe.participation, "mint");
});


test("dropping windows exchanges their exact footprints without moving unrelated panels", () => {
  const before = packDesktop(DEFAULT_DESKTOP);
  const next = swapPanelSlots(DEFAULT_DESKTOP, "chat", "board");
  const after = assertPacked(next);
  const chat = after.find((item) => item.id === "chat")!;
  const board = after.find((item) => item.id === "board")!;
  const oldChat = before.find((item) => item.id === "chat")!;
  const oldBoard = before.find((item) => item.id === "board")!;
  assert.deepEqual({...chat, id:"board"}, oldBoard);
  assert.deepEqual({...board, id:"chat"}, oldChat);
  assert.deepEqual(after.find((item) => item.id === "feed"), before.find((item) => item.id === "feed"));
  assert.deepEqual(after.find((item) => item.id === "music"), before.find((item) => item.id === "music"));
  assert.deepEqual(parseDesktop(JSON.stringify(next)), next);
});

test("a shared divider trades width while the resized window stays under the pointer", () => {
  const resized = resizePanel(DEFAULT_DESKTOP, "chat", {width:8,height:4}, true);
  const after = assertPacked(resized);
  assert.deepEqual(after.find((item) => item.id === "chat"), {id:"chat",x:4,y:0,width:8,height:4});
  assert.deepEqual(after.find((item) => item.id === "feed"), {id:"feed",x:0,y:0,width:4,height:7});
  assert.equal(after.find((item) => item.id === "board")!.y,7);
  const small = resizePanel(resized,"chat",{width:4,height:3});
  assert.equal(assertPacked(small).find((item)=>item.id==="chat")!.y,0);
});

test("minimising preserves neighbour positions and restoring into an occupied space keeps everyone visible", () => {
  const hidden = setPanelMinimized(DEFAULT_DESKTOP,"chat",true);
  const before = assertPacked(hidden);
  assert.deepEqual(before.find((item)=>item.id==="feed"),packDesktop(DEFAULT_DESKTOP).find((item)=>item.id==="feed"));
  const filled = placePanel(hidden,"music",{x:8,y:0},{width:4,height:3});
  const restored = setPanelMinimized(filled,"chat",false);
  assert.equal(assertPacked(restored).length,PANEL_IDS.length);
  assert.deepEqual(packDesktop(restored).find((item)=>item.id==="music"),packDesktop(filled).find((item)=>item.id==="music"));
});

test("repeated spatial swaps and resizes never lose panels or create collisions", () => {
  let layout=structuredClone(DEFAULT_DESKTOP);
  for(let i=0;i<100;i++) {
    layout=swapPanelSlots(layout,PANEL_IDS[i%PANEL_IDS.length],PANEL_IDS[(i+1)%PANEL_IDS.length]);
    layout=resizePanel(layout,PANEL_IDS[i%PANEL_IDS.length],{width:4+(i*3)%9,height:3+i%6},i%2===0);
    assertPacked(layout);
    layout=parseDesktop(JSON.stringify(layout));
    assert.equal(assertPacked(layout).length,PANEL_IDS.length);
  }
});

test("per-window skins are validated separately from geometry and old owner preferences migrate safely", () => {
  const old=parseOwnerDesktop(JSON.stringify({version:1,look:"chrome",participation:"pink",layout:DEFAULT_DESKTOP}));
  assert.equal(old.look,"chrome"); assert.equal(old.windows.chat.skin,"solid");
  const next=parseOwnerDesktop(JSON.stringify({...old,windows:{chat:{skin:"leopard",colour:"blue"},feed:{skin:"url(evil)",colour:"<script>"}}}));
  assert.deepEqual(next.windows.chat,{skin:"leopard",colour:"blue",surface:"dark",typeface:"sans",customSurface:"#151718",customAccent:"#a7f3d0"});
  assert.equal(next.windows.feed.skin,"solid");
  assert.equal(JSON.stringify(next).includes("evil"),false);
  assert.deepEqual(next.layout,old.layout);
  const styled=parseOwnerDesktop(JSON.stringify({...next,windows:{chat:{colour:"pink",skin:"grid",surface:"mint",typeface:"chunky"},feed:{surface:"url(evil)",typeface:"<style>"}}}));
  assert.equal(styled.windows.chat.surface,"mint");
  assert.equal(styled.windows.chat.typeface,"chunky");
  assert.equal(styled.windows.feed.surface,"dark");
  assert.equal(styled.windows.feed.typeface,"sans");
  assert.equal(parseOwnerDesktop(null).look,"black");
  assert.deepEqual(styled.layout,next.layout);
});

test("row moves exchange a wide panel with both neighbours while direct swaps remain individual",()=>{
  const layout=validateDesktop({version:1,order:["feed","board","chat","music"],minimized:[],sizes:{feed:{width:8,height:5},board:{width:4,height:5},chat:{width:12,height:6},music:{width:12,height:3}},positions:{feed:{x:0,y:0},board:{x:8,y:0},chat:{x:0,y:5},music:{x:0,y:11}}});
  const moved=movePanelRow(layout,"chat",-1), slots=assertPacked(moved);
  assert.deepEqual(slots.find(item=>item.id==="chat"),{id:"chat",x:0,y:0,width:12,height:6});
  assert.equal(slots.find(item=>item.id==="feed")!.y,6);assert.equal(slots.find(item=>item.id==="board")!.y,6);
  assert.equal(slots.find(item=>item.id==="music")!.y,11);
  assert.deepEqual(moved.sizes,layout.sizes);
  assert.deepEqual(packDesktop(movePanelRow(moved,"chat",1)).sort((a,b)=>a.id.localeCompare(b.id)),packDesktop(layout).sort((a,b)=>a.id.localeCompare(b.id)));
  const swapped=swapPanelSlots(layout,"chat","feed");assert.equal(packDesktop(swapped).find(item=>item.id==="board")!.y,0);assert.equal(swapped.sizes.chat.width,8);
});

test("connected rows keep unequal-height neighbours together and safely stop at boundaries",()=>{
  const before=packDesktop(DEFAULT_DESKTOP), moved=movePanelRow(DEFAULT_DESKTOP,"board",-1);
  assertPacked(moved);assert.equal(canMovePanelRow(moved,"board",-1),false);
  assert.equal(movePanelRow(moved,"board",-1),moved);
  const restored=movePanelRow(moved,"board",1);assertPacked(restored);
  for(const old of before)assert.deepEqual(packDesktop(restored).find(item=>item.id===old.id),old);
  let repeated=restored;
  for(let i=0;i<60;i++){repeated=movePanelRow(repeated,PANEL_IDS[i%PANEL_IDS.length],i%2 ? -1 : 1);assertPacked(repeated);assert.equal(packDesktop(repeated).length,PANEL_IDS.length);}
});
