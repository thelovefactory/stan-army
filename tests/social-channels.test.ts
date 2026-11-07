import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultSocialConfig,
  parseSocialConfig,
  socialAccount,
  socialStorageKey,
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
