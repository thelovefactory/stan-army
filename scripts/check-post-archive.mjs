import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const base = process.env.BASE_URL || "http://localhost:3000";
const dir = process.env.SCREENSHOT_DIR || "/tmp/stan-army-post-review";
fs.mkdirSync(dir, { recursive: true });
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
  assert.equal(
    await page
      .locator(".artist-breadcrumb,.founder-love-credit,.fan-media-previews")
      .count(),
    0,
  );
  assert.equal(
    await page.getByRole("link", { name: "Discover", exact: true }).count(),
    1,
  );
  assert.match(
    await page.locator(".army-creator-credit").innerText(),
    /Army by\s+@jess\.wav/,
  );
  for (let n = 1; n <= 8; n++) {
    await page.getByLabel("Your post to the Army").fill(`Archive check ${n}`);
    await page.getByRole("button", { name: "Post", exact: true }).click();
  }
  assert.equal(await page.locator(".fan-note-list .fan-note").count(), 7);
  assert.match(
    await page.locator(".fan-note-list .fan-note").first().innerText(),
    /Archive check 8/,
  );
  assert.equal(
    await page.getByText("Archive check 1", { exact: true }).count(),
    0,
  );
  await page
    .getByRole("link", { name: "View all posts", exact: false })
    .click();
  await page.getByRole("heading", { name: "All posts", exact: true }).waitFor();
  assert.equal(await page.locator(".fan-note-list .fan-note").count(), 12);
  await page.getByText("Archive check 1", { exact: true }).waitFor();
  await page.screenshot({
    path: `${dir}/all-posts.png`,
    fullPage: true,
    caret: "initial",
  });
  await page
    .getByRole("link", { name: "Back to Nova Reign’s Army", exact: false })
    .click();
  await page.getByLabel("Your post to the Army").waitFor();
  assert.equal(await page.locator(".fan-note-list .fan-note").count(), 7);
  assert.match(
    await page.locator(".fan-note-list .fan-note").first().innerText(),
    /Archive check 8/,
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator(".fan-note-list .fan-note").count(), 4);
  await page.screenshot({ path: `${dir}/army-header.png`, caret: "initial" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("link", { name: "View all posts", exact: false })
    .click();
  await page.getByRole("heading", { name: "All posts", exact: true }).waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: seven newest main posts, all twelve retained in archive, order and client-navigation retention, refresh reset, creator identity credit, removed strips/gallery preview, header Discover, mobile archive; no page errors.",
  );
} finally {
  await browser.close();
}
