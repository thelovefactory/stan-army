import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_ARMY_MUSIC, parseArmyMusic } from "../src/lib/army-music";
import { parseOwnerDesktop } from "../src/lib/army-desktop";
import { applyDesktopPreset } from "../src/lib/army-style-editor";

test("public music links yield only canonical provider embeds, never arbitrary frames",()=>{
  const spotify=parseArmyMusic(DEFAULT_ARMY_MUSIC+"?si=tracking")!;
  assert.equal(spotify.url,DEFAULT_ARMY_MUSIC);assert.match(spotify.embed!,/^https:\/\/open.spotify.com\/embed\/playlist\//);
  assert.equal(parseArmyMusic("https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02")?.kind,"artist");
  assert.equal(parseArmyMusic("https://open.spotify.com/intl-de/album/06HL4z0CvFAxyc27GXpf02")?.kind,"album");
  const apple=parseArmyMusic("https://music.apple.com/gb/album/example/123456?i=654321&tracking=bad")!;
  assert.equal(apple.embed,"https://embed.music.apple.com/gb/album/example/123456?i=654321");
  assert.equal(parseArmyMusic("https://music.apple.com/us/playlist/example/pl.abcdef123")?.kind,"playlist");
  const artist=parseArmyMusic("https://music.apple.com/us/artist/example/123456")!;
  assert.equal(artist.embed,null);assert.equal(artist.provider,"apple");
  for(const value of ["javascript:alert(1)","https://open.spotify.com.evil.test/playlist/06HL4z0CvFAxyc27GXpf02","https://user:password@open.spotify.com/playlist/06HL4z0CvFAxyc27GXpf02","http://open.spotify.com/playlist/06HL4z0CvFAxyc27GXpf02","https://open.spotify.com:8080/playlist/06HL4z0CvFAxyc27GXpf02","https://open.spotify.com/embed/track/06HL4z0CvFAxyc27GXpf02","https://music.apple.com/us/album/bad/not-an-id","https://example.com/audio.mp3","<iframe src='https://example.com'>"])
    assert.equal(parseArmyMusic(value),null,value);
});

test("music configuration migrates separately from styling and preserves explicit removal",()=>{
  assert.equal(parseOwnerDesktop(null).music,DEFAULT_ARMY_MUSIC);
  const empty=parseOwnerDesktop(JSON.stringify({...parseOwnerDesktop(null),music:null}));assert.equal(empty.music,null);
  assert.equal(applyDesktopPreset(empty,"leopard").music,null);
  const custom=parseOwnerDesktop(JSON.stringify({...empty,music:"https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02?si=tracking"}));
  assert.equal(custom.music,"https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02");
  assert.equal(applyDesktopPreset(custom,"acid").music,custom.music);
  assert.deepEqual(parseOwnerDesktop(JSON.stringify(custom)),custom);
  assert.equal(parseOwnerDesktop(JSON.stringify({...empty,music:"https://evil.test"})).music,null);
});
