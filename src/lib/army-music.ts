/** Public provider links only. No scraping, credentials, arbitrary iframe HTML or local audio. */
export const DEFAULT_ARMY_MUSIC = "https://open.spotify.com/playlist/0EO3CxjNLb1gFi9QuPT6YE";
export type ArmyMusicSource = { provider: "spotify" | "apple"; label: string; kind: "playlist" | "artist" | "album" | "track"; url: string; embed: string | null };
export function parseArmyMusic(value: unknown): ArmyMusicSource | null {
  if (typeof value !== "string" || value.length > 1500) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    if (url.hostname === "open.spotify.com") {
      const path = url.pathname.replace(/^\/intl-[a-z-]+(?=\/)/i, "");
      const match = /^\/(playlist|artist|album|track)\/([a-zA-Z0-9]{22})\/?$/.exec(path);
      if (!match) return null;
      const kind = match[1] as ArmyMusicSource["kind"];
      return { provider:"spotify",label:"Spotify",kind,url:`https://open.spotify.com/${kind}/${match[2]}`,embed:`https://open.spotify.com/embed/${kind}/${match[2]}?theme=0` };
    }
    if (url.hostname !== "music.apple.com") return null;
    const match = /^\/([a-z]{2})\/(playlist|artist|album|song)\/([^/]+)\/((?:pl\.)?[a-zA-Z0-9.-]+)\/?$/.exec(url.pathname);
    if (!match || !/^\d+$|^pl\.[a-zA-Z0-9.-]+$/.test(match[4])) return null;
    const kind = match[2] === "song" ? "track" : match[2] as ArmyMusicSource["kind"];
    if (kind === "playlist" && !match[4].startsWith("pl.")) return null;
    if (kind !== "playlist" && !/^\d+$/.test(match[4])) return null;
    const canonical = new URL(`https://music.apple.com${url.pathname.replace(/\/$/, "")}`);
    const track = url.searchParams.get("i");
    if (kind === "album" && track && /^\d+$/.test(track)) canonical.searchParams.set("i",track);
    return {provider:"apple",label:"Apple Music",kind,url:canonical.href,embed:kind === "artist" ? null : canonical.href.replace("https://music.apple.com/", "https://embed.music.apple.com/")};
  } catch { return null; }
}
