import test from "node:test";
import assert from "node:assert/strict";
import { applyDesktopPreset, changeStyle, createStyleHistory, DESKTOP_PRESETS, redoStyle, readableDesktopColour, sameDesktopStyle, undoStyle } from "../src/lib/army-style-editor";
import { parseOwnerDesktop, resizePanel, setPanelMinimized } from "../src/lib/army-desktop";
import { contrast } from "../src/lib/theme";
import heart from "../src/lib/demo-heart.json";

test("theme changes preserve the host layout, personal slots and hidden windows", () => {
  const owner = parseOwnerDesktop(null);
  owner.layout = setPanelMinimized(resizePanel(owner.layout, "chat", {width:8,height:6}, true), "music", true);
  const snapshot = JSON.stringify(owner);
  for (const preset of DESKTOP_PRESETS) {
    const changed = applyDesktopPreset(owner,preset.id);
    assert.deepEqual(changed.layout,owner.layout);
    assert.deepEqual(parseOwnerDesktop(JSON.stringify(changed)),changed);
    changed.windows.chat.customSurface="#ffffff";
    assert.equal(JSON.stringify(owner),snapshot);
  }
});

test("style history restores exact looks, discards redo branches, and bounds undo memory", () => {
  const initial=parseOwnerDesktop(null);
  let history=createStyleHistory(initial);
  history=changeStyle(history,applyDesktopPreset(initial,"leopard"));
  history=changeStyle(history,applyDesktopPreset(initial,"acid"));
  history=undoStyle(history);
  assert.ok(sameDesktopStyle(history.present,applyDesktopPreset(initial,"leopard")));
  history=redoStyle(history);
  assert.ok(sameDesktopStyle(history.present,applyDesktopPreset(initial,"acid")));
  history=undoStyle(history);
  history=changeStyle(history,applyDesktopPreset(initial,"afterhours"));
  assert.equal(history.future.length,0);
  assert.equal(redoStyle(history),history);
  for(let i=0;i<70;i++)history=changeStyle(history,{...history.present,accent:i%2 ? "#aabbcc" : "#ccbbaa"});
  assert.equal(history.past.length,40);
  assert.deepEqual(initial,parseOwnerDesktop(null));
});

test("custom colours, header styles and raster backgrounds validate independently of roles and CSS", () => {
  const initial=parseOwnerDesktop(null);
  const owner=parseOwnerDesktop(JSON.stringify({...initial,room:{colour:"#ABCDEF",image:heart,fit:"tile",position:"bottom",dim:500},header:{colour:"url(evil)",typeface:"chunky"},accent:"<style>",corners:"round",frame:"classic",windows:{chat:{surface:"custom",customSurface:"#ABC123",colour:"custom",customAccent:"url(evil)"}},role:"admin"}));
  assert.equal(owner.room.colour,"#abcdef");assert.equal(owner.room.dim,85);
  assert.equal(owner.room.image?.animated,true);assert.equal(owner.room.position,"bottom");
  assert.equal(owner.header.colour,initial.header.colour);assert.equal(owner.header.typeface,"chunky");
  assert.equal(owner.accent,initial.accent);assert.equal(owner.windows.chat.customSurface,"#abc123");
  assert.equal(owner.windows.chat.customAccent,"#a7f3d0");assert.equal("role" in owner,false);
  assert.deepEqual(parseOwnerDesktop(JSON.stringify(owner)),owner);
  for(const background of ["#000000","#ffffff","#abc123","#ffff00","#ff00ff","#777777","#767676","#787878"])
    assert.ok(contrast(readableDesktopColour("#f3f4f3",background),background)>=4.5);
  const invalid=parseOwnerDesktop(JSON.stringify({...initial,room:{image:{...heart,dataUrl:"https://example.com/payload.svg"}},windows:{chat:{surface:"custom",customSurface:"url(evil)"}}}));
  assert.equal(invalid.room.image,null);assert.equal(invalid.windows.chat.customSurface,"#151718");
});

test("legacy appearance migrates without altering the saved layout or shared theme preferences", () => {
  const old={version:1,look:"electric",participation:"pink",layout:parseOwnerDesktop(null).layout,windows:{chat:{colour:"blue",skin:"leopard",surface:"mint",typeface:"mono"}}};
  const migrated=parseOwnerDesktop(JSON.stringify(old));
  assert.equal(migrated.look,"electric");assert.equal(migrated.windows.chat.surface,"mint");
  assert.deepEqual(migrated.layout,old.layout);assert.equal(migrated.header.colour,"#111614");
  assert.equal(migrated.room.image,null);assert.equal(migrated.corners,"soft");
  const geometryOnly={...migrated,layout:resizePanel(migrated.layout,"feed",{width:4,height:4})};
  assert.ok(sameDesktopStyle(migrated,geometryOnly));
});
