/** Public profile links only. No tokens, post bodies or provider HTML are stored. */
export type SocialPlatform = "instagram" | "x";
export type SocialAccount = {
  platform: SocialPlatform;
  handle: string;
  url: string;
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
export function defaultSocialConfig(armyId: string): SocialConfig {
  return {
    schemaVersion: 1,
    accounts:
      armyId === "army-nova"
        ? [
            socialAccount("https://www.instagram.com/aaaaaaarmii/")!,
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
      if (account && !accounts.some((a) => a.platform === account.platform))
        accounts.push(account);
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
