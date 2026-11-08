/** Public profile and selected-post links only. No tokens, post bodies or provider HTML are stored. */
export type SocialPlatform = "instagram" | "x";
export type SocialAccount = {
  platform: SocialPlatform;
  handle: string;
  url: string;
  /** Owner-selected public post URLs, newest first; never fetched post bodies. */
  posts?: string[];
};
export type SocialConfig = { schemaVersion: 1; accounts: SocialAccount[] };
export const MAX_SOCIAL_ACCOUNTS = 2;
export function socialAccount(value: unknown): SocialAccount | null {
  if (typeof value !== "string" || value.length > 240) return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      url.search ||
      url.hash
    )
      return null;
    const host = url.hostname.toLowerCase();
    const platform = ["instagram.com", "www.instagram.com"].includes(host)
      ? "instagram"
      : ["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(host)
        ? "x"
        : null;
    if (!platform) return null;
    const match = url.pathname.match(/^\/([A-Za-z0-9_.]+)\/?$/);
    if (!match) return null;
    const handle = match[1].toLowerCase();
    if (
      platform === "instagram"
        ? !/^[a-z0-9_](?:[a-z0-9_.]{0,28}[a-z0-9_])?$/.test(handle)
        : !/^[a-z0-9_]{1,15}$/.test(handle)
    )
      return null;
    if (
      [
        "p",
        "reel",
        "reels",
        "stories",
        "explore",
        "accounts",
        "direct",
        "about",
        "settings",
        "home",
        "intent",
        "share",
        "i",
        "search",
        "login",
        "signup",
        "privacy",
        "tos",
        "help",
      ].includes(handle)
    )
      return null;
    return {
      platform,
      handle,
      url:
        platform === "instagram"
          ? `https://www.instagram.com/${handle}/`
          : `https://x.com/${handle}`,
    };
  } catch {
    return null;
  }
}
/** Canonical, bounded public-post links only; no embed HTML or tracking queries. */
export function socialPost(value: unknown, account: SocialAccount): string | null {
  if (typeof value !== "string" || value.length > 240) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash) return null;
    if (account.platform === "instagram") {
      if (!["instagram.com", "www.instagram.com"].includes(url.hostname)) return null;
      const match = url.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]{1,80})\/?$/);
      return match ? `https://www.instagram.com/${match[1]}/${match[2]}/` : null;
    }
    if (!["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname)) return null;
    const match = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/status\/([0-9]{1,25})\/?$/);
    return match && match[1].toLowerCase() === account.handle
      ? `https://x.com/${account.handle}/status/${match[2]}` : null;
  } catch {
    return null;
  }
}
export const MAX_SOCIAL_POSTS = 12;
// Manually selected from the supplied public profile embed; not a synchronised feed.
const novaInstagramPosts = [
  "https://www.instagram.com/p/DfH7u8RqpCh/",
  "https://www.instagram.com/p/DdjE56sq0Qy/",
];
export function defaultSocialConfig(armyId: string): SocialConfig {
  return {
    schemaVersion: 1,
    accounts:
      armyId === "army-nova"
        ? [
            {
              ...socialAccount("https://www.instagram.com/aaaaaaarmii/")!,
              posts: [...novaInstagramPosts],
            },
            socialAccount("https://x.com/indiscowetrust")!,
          ]
        : [],
  };
}
export function parseSocialConfig(
  raw: string | null,
  armyId: string,
): SocialConfig {
  if (raw === null) return defaultSocialConfig(armyId);
  try {
    const value = JSON.parse(raw);
    if (!value || value.schemaVersion !== 1 || !Array.isArray(value.accounts))
      return { schemaVersion: 1, accounts: [] };
    const accounts: SocialAccount[] = [];
    for (const item of value.accounts.slice(0, 20)) {
      const account = socialAccount(item?.url);
      if (account && !accounts.some((a) => a.platform === account.platform)) {
        if (item.posts === undefined && armyId === "army-nova" && account.url === "https://www.instagram.com/aaaaaaarmii/") {
          account.posts = [...novaInstagramPosts];
        }
        if (Array.isArray(item.posts)) {
          account.posts = [...new Set<string>(item.posts.slice(0, MAX_SOCIAL_POSTS)
            .map((post: unknown) => socialPost(post, account))
            .filter((post: string | null): post is string => post !== null))];
        }
        accounts.push(account);
      }
    }
    return {
      schemaVersion: 1,
      accounts: accounts.slice(0, MAX_SOCIAL_ACCOUNTS),
    };
  } catch {
    return { schemaVersion: 1, accounts: [] };
  }
}
export function socialStorageKey(armyId: string) {
  return `stan-army:social:v1:${armyId}`;
}
