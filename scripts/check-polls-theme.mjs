// Regression checks for polls and clashing saved theme colours.
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
import assert from "node:assert/strict";
function lum(c) {
  let a = c
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number)
    .map((v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(
    `${process.env.BASE_URL || "http://localhost:3000"}/armies/nova`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "Add a poll", exact: true }).click();
  await page.getByLabel("Your post to the Army").fill("Which version wins?");
  await page.getByLabel("Choice 1").fill("Live");
  await page.getByLabel("Choice 2").fill("Studio");
  await page.getByRole("button", { name: "Post", exact: true }).click();
  const poll = page.locator(".fan-poll").first();
  await poll.getByRole("button", { name: "Live", exact: true }).click();
  assert.equal(
    await poll
      .getByRole("button", { name: "Live 100%", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await poll.getByRole("button", { name: "Studio 0%", exact: true }).click();
  assert.equal(
    await poll
      .getByRole("button", { name: "Studio 100%", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("button", { name: "CUSTOMISE", exact: true }).click();
  await page.locator(".preset-glitter-bomb").click();
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await page.evaluate(() => {
    const key = "stan-army:theme:v1:army:army-nova";
    const t = JSON.parse(localStorage.getItem(key));
    t.colors.text = "#000000";
    t.background.color = "#eaff00";
    t.panels.color = "#16131b";
    localStorage.setItem(key, JSON.stringify(t));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page
    .getByLabel("Your post to the Army")
    .fill("Readable with my custom theme.");
  const styles = await page
    .locator("#fan-mark")
    .evaluate((e) => ({
      color: getComputedStyle(e).color,
      bg: getComputedStyle(e).backgroundColor,
      placeholder: getComputedStyle(e, "::placeholder").color,
      opacity: getComputedStyle(e, "::placeholder").opacity,
    }));
  const ratio =
    (Math.max(lum(styles.color), lum(styles.bg)) + 0.05) /
    (Math.min(lum(styles.color), lum(styles.bg)) + 0.05);
  assert.ok(ratio >= 4.5, JSON.stringify(styles));
  assert.equal(styles.placeholder, styles.color);
  assert.equal(styles.opacity, "1");
  await page
    .locator(".simple-composer")
    .screenshot({ path: "/tmp/stan-army-poll-composer.png", caret: "initial" });
  await page.setViewportSize({ width: 320, height: 740 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.getByRole("button", { name: "Add a poll", exact: true }).click();
  await page.getByLabel("Choice 1").fill("One");
  await page.getByLabel("Choice 2").fill(" one ");
  assert.equal(
    await page.getByRole("button", { name: "Post", exact: true }).isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Remove poll", exact: true }).click();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: poll creation/vote/change/duplicate rejection/removal, hostile custom theme contrast " +
      ratio.toFixed(2) +
      ":1, opaque readable placeholder, 320px no overflow; no page errors.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
