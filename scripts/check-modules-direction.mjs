import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const base = process.env.BASE_URL || "http://localhost:3000";
const captures = process.env.SCREENSHOT_DIR || "/tmp/stan-army-module-review";
fs.mkdirSync(captures, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".sidebar-playlist").count(), 1);
  assert.equal(await page.locator(".army-chat").count(), 1);
  const customise = () =>
    page.getByRole("button", { name: "CUSTOMISE", exact: true }).click();
  await customise();
  const music = page.getByRole("checkbox", {
    name: "Music / Spotify playlist",
    exact: true,
  });
  await music.uncheck();
  assert.equal(await page.locator(".sidebar-playlist").count(), 0);
  assert.equal(await page.locator(".army-chat").count(), 1);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  assert.equal(await page.locator(".sidebar-playlist").count(), 1);
  await customise();
  await music.uncheck();
  await page.getByRole("checkbox", { name: "Gallery", exact: true }).uncheck();
  await page.locator(".preset-glitter-bomb").click();
  assert.equal(await music.isChecked(), false);
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".sidebar-playlist").count(), 0);
  assert.equal(await page.locator(".shoebox-preview").count(), 0);
  assert.equal(
    await page
      .locator('.feed-more-links a[href="/armies/nova/videos"]')
      .count(),
    1,
  );
  await page.getByRole("button", { name: "View clean", exact: true }).click();
  assert.equal(await page.locator(".sidebar-playlist").count(), 0);
  assert.equal(await page.locator(".shoebox-preview").count(), 0);
  await page.getByRole("button", { name: "View custom", exact: true }).click();
  await customise();
  for (const label of [
    "Fan posts",
    "Music / Spotify playlist",
    "Videos",
    "Gallery",
    "Army chat",
    "Announcements",
    "Events & links",
    "Discussion board",
  ])
    await page.getByRole("checkbox", { name: label, exact: true }).uncheck();
  assert.equal(
    await page
      .locator(
        ".living-fan-space,.sidebar-playlist,.army-chat,.fan-media-previews,.army-voices-fold,.discussion-board,#events",
      )
      .count(),
    0,
  );
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await customise();
  await page
    .getByRole("checkbox", { name: "Music / Spotify playlist", exact: true })
    .check();
  await page
    .locator(".theme-editor")
    .screenshot({ path: `${captures}/module-controls.png`, caret: "initial" });
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  assert.equal(await page.locator(".sidebar-playlist").count(), 1);
  await page.goto(`${base}/armies/nova/gallery`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".module-hidden-note").count(), 1);
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  await page.locator(".demo-role select").selectOption("official-artist");
  assert.equal(
    await page.getByRole("button", { name: "CUSTOMISE", exact: true }).count(),
    0,
  );
  await page.goto(`${base}/armies/sienna-blue`, { waitUntil: "networkidle" });
  assert.equal(await page.locator(".sidebar-playlist").count(), 1);
  assert.equal(
    await page
      .locator('.sidebar-playlist a[href="/armies/sienna-blue/room"]')
      .count(),
    1,
  );
  await page.goto(`${base}/create`, { waitUntil: "networkidle" });
  await page.locator("#army-artist").fill("Brie cheese");
  await page
    .locator("#artist-context")
    .fill("The soft French cheese made from cow’s milk.");
  await page.getByRole("button", { name: "Keep going", exact: false }).click();
  await page.locator("#army-address").fill("brie-cheese");
  await page.getByRole("button", { name: "Keep going", exact: false }).click();
  await page
    .locator("#army-welcome")
    .fill("A home for everyone who loves Brie. Bring your crackers.");
  assert.equal(await page.locator("#army-music-link").inputValue(), "");
  await page.getByRole("button", { name: "Keep going", exact: false }).click();
  await page
    .getByRole("button", { name: "Create demo preview", exact: false })
    .click();
  await page.getByText("Local preview complete.", { exact: false }).waitFor();
  await page.screenshot({
    path: `${captures}/non-music-preview.png`,
    fullPage: true,
    caret: "initial",
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: defaults, independent module preview/cancel/save/refresh, preset and clean-view preservation, all-off recovery, mobile layout, direct gallery hiding, official-role boundary, per-Army Spotify, non-music preview without music metadata/link.",
  );
} finally {
  await browser.close();
}
