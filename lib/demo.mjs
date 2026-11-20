export function filterArtists(artists, query, genre, collection) {
  const needle = query.trim().toLowerCase();
  const found = artists.filter(
    (a) =>
      `${a.name} ${a.handle} ${a.genre} ${a.city}`
        .toLowerCase()
        .includes(needle) &&
      (genre === "All sounds" || a.genre === genre) &&
      (collection !== "Our Favourites" || a.favourite),
  );
  return collection === "Most Stanned"
    ? [...found].sort((a, b) => b.stans - a.stans)
    : collection === "New Artists"
      ? [...found].reverse()
      : found;
}
export function safeMusicUrl(value) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      [
        "open.spotify.com",
        "www.youtube.com",
        "youtube.com",
        "youtu.be",
        "soundcloud.com",
        "music.apple.com",
        "bandcamp.com",
      ].some(
        (host) =>
          url.hostname === host ||
          (host === "bandcamp.com" && url.hostname.endsWith(".bandcamp.com")),
      )
    );
  } catch {
    return false;
  }
}
export function validHandle(value) {
  return /^[a-z0-9][a-z0-9-]{2,23}$/.test(value);
}
