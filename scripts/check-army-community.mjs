// Optional browser checks. See docs/VALIDATION.md for setup; no app dependency.
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
import path from "node:path";
import fs from "node:fs";
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const screenshotDir = process.env.SCREENSHOT_DIR || "/tmp/stan-army-review";
fs.mkdirSync(screenshotDir, { recursive: true });
import assert from "node:assert/strict";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const spotify = [];
  page.on("request", (r) => {
    if (r.url().includes("open.spotify.com/embed")) spotify.push(r.url());
  });
  await page.goto(`${baseUrl}/armies/nova`, { waitUntil: "networkidle" });
  assert.equal(await page.getByText("Look what we’re").count(), 0);
  assert.equal(
    await page.locator(".living-sidebar .sidebar-playlist").count(),
    1,
  );
  assert.equal(await page.locator(".living-sidebar > #army-room").count(), 1);
  assert.equal(spotify.length, 0);
  await page.locator(".member-dropdown > summary").click();
  await page.locator(".member-popover").waitFor({ state: "visible" });
  await page
    .getByRole("button", { name: "Meet fictional fan lucid.lou" })
    .click();
  assert.match(await page.locator(".orbit-person").innerText(), /lucid.lou/);
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".member-dropdown").getAttribute("open"),
    null,
  );
  await page
    .getByLabel("Your post to the Army")
    .fill("Browser check: this is our corner.");
  await page.getByRole("button", { name: "Post", exact: true }).click();
  assert.match(
    await page.locator(".fan-note-list .fan-note").first().innerText(),
    /Browser check/,
  );
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles(path.join(process.cwd(), "public/images/room.jpg"));
  await page.locator(".attachment-preview img").waitFor();
  await page.getByRole("button", { name: "Post", exact: true }).click();
  assert.equal(
    await page
      .locator(".fan-note-list .fan-note")
      .first()
      .locator(".post-attachment img")
      .count(),
    1,
  );
  await page.getByRole("button", { name: "Start a discussion" }).click();
  await page
    .getByLabel("Title", { exact: true })
    .fill("Can we make a fan zine?");
  await page
    .getByLabel("Your post", { exact: true })
    .fill("I have a notebook and a lot of feelings.");
  await page
    .getByRole("button", { name: "Post discussion", exact: true })
    .click();
  let first = page.locator(".board-thread").first();
  assert.match(await first.innerText(), /Can we make a fan zine/);
  await first
    .getByRole("button", {
      name: "Upvote: Can we make a fan zine?",
      exact: true,
    })
    .click();
  assert.equal(await first.locator(".thread-votes strong").innerText(), "1");
  await first
    .getByRole("button", { name: "Can we make a fan zine?", exact: true })
    .click();
  await page.getByLabel("Add a reply").fill("I’m in!");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  assert.match(await first.innerText(), /I’m in!/);
  await page.getByRole("button", { name: "Top", exact: true }).click();
  assert.match(
    await page.locator(".board-thread").first().innerText(),
    /Which Nova bridge/,
  );
  await page.getByRole("button", { name: "Load Spotify", exact: true }).click();
  assert.match(
    await page
      .locator('iframe[title="Army Spotify playlist"]')
      .getAttribute("src"),
    /0EO3CxjNLb1gFi9QuPT6YE/,
  );
  await page
    .getByRole("button", { name: "Unload Spotify", exact: true })
    .click();
  assert.equal(await page.locator("iframe").count(), 0);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByText("Browser check: this is our corner.").count(),
    0,
  );
  await page.screenshot({
    path: path.join(screenshotDir, "nova-desktop.png"),
    fullPage: true,
    caret: "initial",
  });
  await page.locator("#discussions").screenshot({
    path: path.join(screenshotDir, "nova-board.png"),
    caret: "initial",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/armies/nova`, { waitUntil: "networkidle" });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "mobile overflow",
  );
  await page.locator(".member-dropdown > summary").click();
  const box = await page.locator(".member-popover").boundingBox();
  assert.ok(box.x >= 0 && box.x + box.width <= 390, "dropdown fits mobile");
  await page.keyboard.press("Escape");
  const music = await page.locator(".sidebar-player").boundingBox();
  const feed = await page.locator(".living-primary").boundingBox();
  assert.ok(music.y < feed.y, "compact mobile music precedes feed");
  await page.screenshot({
    path: path.join(screenshotDir, "nova-mobile.png"),
    fullPage: true,
    caret: "initial",
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: desktop/mobile layout, no overflow, members + Escape, text/image posts, new thread, voting, replies, sorting, Spotify consent/unload, refresh reset; no page errors.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
