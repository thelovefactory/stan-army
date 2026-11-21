import test from "node:test";
import assert from "node:assert/strict";
import { edgeScrollSpeed, resizeRect } from "../src/lib/army-grid-geometry";
import { DEFAULT_DESKTOP, resizePanel, placePanel, parseDesktop, packDesktop, swapPanelSlots, setPanelMinimized } from "../src/lib/army-desktop";

const source={x:500,y:160,width:416,height:248};
test("a resize can align exactly to a neighbouring bottom between old grid steps",()=>{
  const box=resizeRect(source,[{x:68,y:0,width:416,height:410}],0,3);
  assert.equal(box.y+box.height,410);
  const layout=placePanel(DEFAULT_DESKTOP,"music",{x:8,y:0},{width:4,height:3});
  const next=resizePanel(layout,"music",{width:4,height:(box.height+16)/88});
  const actual=packDesktop(next).find(item=>item.id==="music")!;
  assert.ok(Math.abs(actual.height*88-16-box.height)<.1);
  assert.deepEqual(parseDesktop(JSON.stringify(next)),next);
});
test("resizing follows the pointer outside the edge magnet, instead of rounding to 44px",()=>{
  const box=resizeRect(source,[],7,13);
  assert.equal(box.width,423);assert.equal(box.height,261);
  assert.equal(resizeRect(source,[{x:0,y:0,width:200,height:410}],0,30).height,278);
});
test("left and right resizing align edges and preserve the opposite anchor",()=>{
  const left=resizeRect(source,[{x:440,y:0,width:40,height:100}],-9,0,true);
  assert.equal(left.x,496); // adjacent right edge 480 + 16px gutter
  assert.equal(left.x+left.width,source.x+source.width);
  const right=resizeRect(source,[{x:950,y:0,width:100,height:100}],15,0);
  assert.equal(right.x+right.width,934);
  assert.equal(right.x,source.x);
});
test("an untouched axis does not jump to a nearby alignment",()=>{
  const box=resizeRect(source,[{x:0,y:0,width:200,height:410}],8,0);
  assert.equal(box.height,source.height);
});
test("fine dimensions persist across moves, swaps and restoration without re-quantising",()=>{
  let layout=resizePanel(DEFAULT_DESKTOP,"chat",{width:3.3125,height:3.0234375});
  layout=placePanel(layout,"chat",{x:6.125,y:12.1875});
  assert.equal(layout.sizes.chat.width,3.3125);
  assert.equal(layout.sizes.chat.height,3.0234375);
  assert.deepEqual(parseDesktop(JSON.stringify(layout)),layout);
});


test("edge scrolling never fights a drag moving away from that edge",()=>{
  assert.equal(edgeScrollSpeed(830,850,-1),0);
  assert.equal(edgeScrollSpeed(20,850,1),0);
  assert.equal(edgeScrollSpeed(20,850,0),0);
  assert.ok(edgeScrollSpeed(20,850,-1)<0);
  assert.ok(edgeScrollSpeed(830,850,1)>0);
  assert.equal(edgeScrollSpeed(400,850,-1),0);
  assert.equal(edgeScrollSpeed(-1,850,-1),0);
});
