import test from "node:test";
import assert from "node:assert/strict";
import { filterArtists, safeMusicUrl, validHandle } from "../lib/demo.mjs";

const artists = [
  {
    name: "NOVA",
    handle: "nova",
    genre: "Soul",
    city: "London",
    stans: 10,
    favourite: true,
  },
  {
    name: "MILO",
    handle: "milo",
    genre: "Electronic",
    city: "Berlin",
    stans: 30,
    favourite: false,
  },
  {
    name: "SOL",
    handle: "sol",
    genre: "Soul",
    city: "Lisbon",
    stans: 20,
    favourite: true,
  },
];
test("discovery combines case-insensitive search, genre and editorial collection", () => {
  assert.deepEqual(
    filterArtists(artists, "  LONDON  ", "Soul", "Our Favourites").map(
      (a) => a.handle,
    ),
    ["nova"],
  );
  assert.equal(
    filterArtists(artists, "Berlin", "Electronic", "Our Favourites").length,
    0,
  );
  assert.equal(
    filterArtists(artists, "unknown", "All sounds", "New Artists").length,
    0,
  );
});
test("Most Stanned sorts without changing the source, New Artists reverses seed order", () => {
  assert.deepEqual(
    filterArtists(artists, "", "All sounds", "Most Stanned").map(
      (a) => a.handle,
    ),
    ["milo", "sol", "nova"],
  );
  assert.equal(artists[0].handle, "nova");
  assert.deepEqual(
    filterArtists(artists, "", "All sounds", "New Artists").map(
      (a) => a.handle,
    ),
    ["sol", "milo", "nova"],
  );
});
test("provider validation accepts official HTTPS URLs and optional empty values", () => {
  for (const url of [
    "",
    "https://open.spotify.com/artist/123",
    "https://www.youtube.com/watch?v=abc",
    "https://youtu.be/abc",
    "https://soundcloud.com/artist",
    "https://music.apple.com/album/123",
    "https://artist.bandcamp.com/album/example",
  ])
    assert.equal(safeMusicUrl(url), true, url);
});
test("provider validation rejects executable, insecure and impersonated URLs", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://open.spotify.com/track/123",
    "https://open.spotify.com.evil.example/track/123",
    "https://evilbandcamp.com/",
    "https://youtube.com@evil.example/",
    "not a url",
    "data:text/html,hello",
    "https://evil.example/?spotify.com",
  ])
    assert.equal(safeMusicUrl(url), false, url);
});
test("handles enforce length, URL-safe characters and starting character", () => {
  for (const handle of ["nova", "milo-blue", "abc123", "a".repeat(24)])
    assert.equal(validHandle(handle), true, handle);
  for (const handle of [
    "",
    "ab",
    "-nova",
    "NOVA",
    "nova blue",
    "nova/blue",
    "a".repeat(25),
    "💿💿💿",
  ])
    assert.equal(validHandle(handle), false, handle);
});
