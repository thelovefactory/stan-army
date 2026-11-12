import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultSocialConfig,
  parseSocialConfig,
  socialAccount,
  socialStorageKey,
  socialPost,
  MAX_SOCIAL_POSTS,
  instagramGallerySource,
  getGallerySource,
  gallerySourceUrl,
} from "../src/lib/social-channels";
import { defaultTheme, validateTheme, parseTheme } from "../src/lib/theme";

test("public profiles canonicalise without permitting executable or foreign URLs", () => {
  assert.deepEqual(socialAccount("https://www.x.com/InDiscoWeTrust"), {
    platform: "x",
    handle: "indiscowetrust",
    url: "https://x.com/indiscowetrust",
  });
  assert.equal(
    socialAccount("https://instagram.com/aaaaaaarmii/")?.url,
    "https://www.instagram.com/aaaaaaarmii/",
  );
  assert.equal(socialAccount("https://twitter.com/stans")?.platform, "x");
  for (const url of [
    "javascript:alert(1)",
    "http://x.com/test",
    "https://x.com.evil.test/user",
    "https://x.com@evil.test/user",
    "https://evil.test/x.com/user",
    "https://user:pass@x.com/stan",
    "https://x.com:8443/stan",
    "https://instagram.com/p/abc",
    "https://x.com/stan/status/123",
    "https://instagram.com/reel/abc",
    "https://x.com/stan?pixel=secret",
    "https://x.com/stan#fragment",
    "https://x.com/thisusernameistoolong",
    "https://instagram.com/%3Cscript%3E",
    "https://x.com/home",
    "<iframe src=x>",
    "https://instagram.com/",
  ])
    assert.equal(socialAccount(url), null, url);
});
test("per-Army link configuration is bounded, isolated and stores no post content or tokens", () => {
  const nova = defaultSocialConfig("army-nova");
  assert.equal(nova.accounts.length, 2);
  assert.deepEqual(defaultSocialConfig("army-brie").accounts, []);
  nova.accounts.pop();
  assert.equal(defaultSocialConfig("army-nova").accounts.length, 2);
  assert.notEqual(socialStorageKey("army-nova"), socialStorageKey("army-brie"));
  assert.deepEqual(
    parseSocialConfig(
      JSON.stringify({ schemaVersion: 1, accounts: [] }),
      "army-nova",
    ).accounts,
    [],
  );
  const parsed = parseSocialConfig(
    JSON.stringify({
      schemaVersion: 1,
      token: "secret",
      accounts: [
        {
          url: "https://x.com/stan",
          platform: "instagram",
          handle: "<script>",
          text: "fake post",
        },
        { url: "https://x.com/duplicate" },
        { url: "https://instagram.com/brie/" },
        { url: "https://evil.test/" },
      ],
    }),
    "army-nova",
  );
  assert.deepEqual(
    parsed.accounts.map((a) => a.platform),
    ["x", "instagram"],
  );
  assert.equal(parsed.accounts[0].handle, "stan");
  assert.equal(JSON.stringify(parsed).includes("secret"), false);
  assert.equal(JSON.stringify(parsed).includes("fake post"), false);
  assert.deepEqual(
    parseSocialConfig(JSON.stringify(parsed), "army-nova"),
    parsed,
  );
  for (const raw of [
    "{",
    "null",
    '{"schemaVersion":2}',
    '{"schemaVersion":1,"accounts":"bad"}',
  ])
    assert.deepEqual(parseSocialConfig(raw, "army-nova").accounts, []);
});
test("Outside the Army is additive to v1 themes and survives clean/reset-compatible configuration", () => {
  const legacy = structuredClone(defaultTheme) as unknown as Record<
    string,
    unknown
  >;
  delete legacy.outsideArmy;
  const modules = { ...defaultTheme.modules };
  delete (modules as Partial<typeof modules>).outside;
  legacy.modules = { ...modules, chat: false };
  const restored = validateTheme(legacy);
  assert.equal(restored.modules.outside, true);
  assert.equal(restored.modules.chat, false);
  assert.deepEqual(restored.outsideArmy, { accent: null, treatment: "panel" });
  const changed = validateTheme({
    ...restored,
    modules: { ...restored.modules, outside: false },
    outsideArmy: { accent: "#ff009d", treatment: "outline" },
  });
  assert.equal(changed.modules.outside, false);
  assert.deepEqual(changed.outsideArmy, {
    accent: "#ff009d",
    treatment: "outline",
  });
  assert.deepEqual(parseTheme(JSON.stringify(changed)), changed);
  const unsafe = validateTheme({
    ...restored,
    outsideArmy: { accent: "url(https://evil.test)", treatment: "<script>" },
  });
  assert.equal(unsafe.outsideArmy.accent, defaultTheme.colors.accent);
  assert.equal(unsafe.outsideArmy.treatment, "panel");
});


test("selected previews validate source URLs and account ownership where encoded", () => {
  const instagram = socialAccount("https://instagram.com/stan/")!;
  const x = socialAccount("https://x.com/stan")!;
  assert.equal(socialPost("https://instagram.com/p/Abc_123/", instagram), "https://www.instagram.com/p/Abc_123/");
  assert.equal(socialPost("https://www.instagram.com/reel/Abc-123/", instagram), "https://www.instagram.com/reel/Abc-123/");
  assert.equal(socialPost("https://twitter.com/STAN/status/12345", x), "https://x.com/stan/status/12345");
  for (const url of ["https://x.com/other/status/123", "https://x.com/stan/status/123?tracking=1", "https://x.com/stan/status/abc", "https://x.com/stan", "https://x.com.evil.test/stan/status/123", "javascript:alert(1)", "https://user:pass@x.com/stan/status/123", "https://instagram.com/p/abc/"]) {
    assert.equal(socialPost(url, x), null, url);
  }
  assert.equal(socialPost("https://instagram.com/p/abc/?tracking=1", instagram), null);
  assert.equal(socialPost("https://instagram.com/stan/", instagram), null);
  assert.equal(socialPost("https://evil.test/p/abc/", instagram), null);
});

test("selected post links survive refresh, are bounded and never restore arbitrary embed data", () => {
  const raw = JSON.stringify({schemaVersion: 1, accounts: [{url: "https://x.com/stan", posts: ["https://x.com/stan/status/1", "https://x.com/stan/status/1", "https://evil.test/", "https://x.com/other/status/2"], html: "<script>bad</script>"}]});
  const config = parseSocialConfig(raw, "army-nova");
  assert.deepEqual(config.accounts[0].posts, ["https://x.com/stan/status/1"]);
  assert.deepEqual(parseSocialConfig(JSON.stringify(config), "army-nova"), config);
  assert.equal(JSON.stringify(config).includes("<script>"), false);
  const many = parseSocialConfig(JSON.stringify({schemaVersion: 1, accounts: [{url: "https://x.com/stan", posts: Array.from({length: 30}, (_, i) => `https://x.com/stan/status/${i + 1}`)}]}), "army-nova");
  assert.equal(many.accounts[0].posts?.length, MAX_SOCIAL_POSTS);
});

test("Nova's old test-profile links receive individual previews without overriding explicit choices", () => {
  const legacy = JSON.stringify({schemaVersion: 1, accounts: [{url: "https://instagram.com/aaaaaaarmii/"}]});
  const restored = parseSocialConfig(legacy, "army-nova");
  assert.equal(restored.accounts[0].posts?.length, 2);
  assert.deepEqual(restored.accounts[0].posts, defaultSocialConfig("army-nova").accounts[0].posts);
  const cleared = JSON.stringify({schemaVersion: 1, accounts: [{url: "https://instagram.com/aaaaaaarmii/", posts: []}]});
  assert.deepEqual(parseSocialConfig(cleared, "army-nova").accounts[0].posts, []);
  const other = JSON.stringify({schemaVersion: 1, accounts: [{url: "https://instagram.com/brie/"}]});
  assert.equal(parseSocialConfig(other, "army-nova").accounts[0].posts, undefined);
  assert.equal(parseSocialConfig(legacy, "army-brie").accounts[0].posts, undefined);
});


test("gallery sources accept public usernames and hashtags without credentials or executable URLs", () => {
  assert.deepEqual(instagramGallerySource("@aaaaaaarmii"), {kind: "account", value: "aaaaaaarmii"});
  assert.deepEqual(instagramGallerySource("https://www.instagram.com/BRIE/"), {kind: "account", value: "brie"});
  assert.deepEqual(instagramGallerySource("#Brie"), {kind: "hashtag", value: "brie"});
  assert.deepEqual(instagramGallerySource("#café"), {kind: "hashtag", value: "café"});
  for (const input of ["#", "#two words", "#<script>", "https://evil.test/brie/", "https://x.com/brie", "javascript:alert(1)", "#brie?token=secret", "@@brie", "https://instagram.com/brie/?token=secret"]) {
    assert.equal(instagramGallerySource(input), null, input);
  }
  assert.equal(gallerySourceUrl(instagramGallerySource("#Brie")!), "https://www.instagram.com/explore/tags/brie/");
  assert.equal(gallerySourceUrl(instagramGallerySource("@Brie")!), "https://www.instagram.com/brie/");
});

test("gallery preferences preserve legacy links and explicit removal without inventing a connected feed", () => {
  const legacy = defaultSocialConfig("army-nova");
  assert.deepEqual(getGallerySource(legacy), {kind: "account", value: "aaaaaaarmii"});
  const saved = parseSocialConfig(JSON.stringify({...legacy, gallerySource: {kind: "hashtag", value: "Brie", token: "secret", connected: true}}), "army-nova");
  assert.deepEqual(getGallerySource(saved), {kind: "hashtag", value: "brie"});
  assert.deepEqual(saved.accounts, legacy.accounts);
  assert.equal(JSON.stringify(saved).includes("secret"), false);
  assert.equal(JSON.stringify(saved).includes("connected"), false);
  assert.deepEqual(parseSocialConfig(JSON.stringify(saved), "army-nova"), saved);
  const removed = parseSocialConfig(JSON.stringify({...legacy, gallerySource: null}), "army-nova");
  assert.equal(getGallerySource(removed), null);
  assert.deepEqual(removed.accounts, legacy.accounts);
  assert.equal(getGallerySource(defaultSocialConfig("army-brie")), null);
  assert.equal(getGallerySource(parseSocialConfig(JSON.stringify({...legacy, gallerySource: {kind: "hashtag", value: "<script>"}}), "army-nova")), null);
});
