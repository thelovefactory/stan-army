import test from "node:test";
import assert from "node:assert/strict";
import { nextSnap, SAMPLE_SNAPS, shuffleSnap } from "../src/lib/stan-cam";
import { DEFAULT_DESKTOP, overlaps, packDesktop, parseDesktop, parseOwnerDesktop } from "../src/lib/army-desktop";

test("StanCam browsing wraps and shuffle always chooses another snap when possible",()=>{
  assert.equal(nextSnap(0,3,-1),2);assert.equal(nextSnap(2,3,1),0);
  for(let current=0;current<12;current++)for(const random of [0,.25,.5,.999,1,NaN]){
    const next=shuffleSnap(current,12,random);assert.ok(next>=0&&next<12);assert.notEqual(next,current);
  }
  assert.equal(shuffleSnap(0,1),0);assert.equal(nextSnap(0,0,1),0);
  assert.ok(SAMPLE_SNAPS.every(snap=>snap.src.startsWith("/images/")&&snap.alt.startsWith("Example")));
});

test("old four-panel arrangements acquire StanCam without moving existing windows",()=>{
  const old={version:1,order:["chat","music","feed","board"],minimized:["board"],sizes:{chat:{width:8,height:7},music:{width:4,height:3},feed:{width:12,height:4},board:{width:12,height:3}},positions:{chat:{x:0,y:0},music:{x:8,y:0},feed:{x:0,y:7},board:{x:0,y:11}}};
  const migrated=parseDesktop(JSON.stringify(old));
  for(const id of old.order as (keyof typeof old.positions)[]){assert.deepEqual(migrated.positions![id],old.positions[id]);assert.deepEqual(migrated.sizes[id],old.sizes[id]);}
  assert.deepEqual(migrated.minimized,["board"]);
  assert.deepEqual(migrated.positions!.stancam,{x:8,y:3});assert.equal(migrated.sizes.stancam.height,4);
  const packed=packDesktop(migrated);assert.equal(packed.length,4);
  for(const a of packed)for(const b of packed)if(a.id!==b.id)assert.equal(overlaps(a,b),false);
  assert.deepEqual(parseDesktop(JSON.stringify(migrated)),migrated);
  const owner=parseOwnerDesktop(JSON.stringify({version:1,layout:old,windows:{chat:{surface:"pink"}}}));
  assert.equal(owner.windows.chat.surface,"pink");assert.equal(owner.windows.stancam.surface,"dark");
  assert.deepEqual(owner.layout.positions!.music,old.positions.music);
});

test("new desktops place StanCam directly beneath the stereo",()=>{
  const panels=packDesktop(DEFAULT_DESKTOP),music=panels.find(item=>item.id==="music")!,camera=panels.find(item=>item.id==="stancam")!;
  assert.equal(camera.x,music.x);assert.equal(camera.y,music.y+music.height);assert.equal(camera.width,music.width);
});
