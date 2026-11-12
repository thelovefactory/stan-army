import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const base = process.env.BASE_URL || "http://localhost:3000";
const dir = process.env.SCREENSHOT_DIR || "/tmp/stan-army-layout-review";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1050 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  async function checkDesktop() {
    const ids = [
      ".nova-identity-compact",
      ".simple-composer",
      ".sidebar-playlist",
      ".feed-controls",
      ".fan-note",
      ".army-chat",
    ];
    const boxes = {};
    for (const id of ids)
      boxes[id] = await page.locator(id).first().boundingBox();
    assert.ok(
      Math.abs(boxes[".simple-composer"].y - boxes[".sidebar-playlist"].y) < 1,
      "column tops align",
    );
    assert.ok(
      boxes[".simple-composer"].y -
        (boxes[".nova-identity-compact"].y +
          boxes[".nova-identity-compact"].height) >=
        23,
      "identity breathes",
    );
    assert.ok(
      Math.abs(boxes[".simple-composer"].x - boxes[".fan-note"].x) < 1,
      "post left edges align",
    );
    assert.ok(
      Math.abs(boxes[".simple-composer"].width - boxes[".fan-note"].width) < 1,
      "post widths align",
    );
    assert.ok(
      Math.abs(boxes[".sidebar-playlist"].x - boxes[".army-chat"].x) < 1,
      "sidebar left edges align",
    );
    assert.ok(
      Math.abs(boxes[".sidebar-playlist"].width - boxes[".army-chat"].width) <
        1,
      "sidebar widths align",
    );
    assert.equal(
      await page
        .locator(".fan-note")
        .first()
        .evaluate((e) => getComputedStyle(e).transform),
      "none",
    );
    return boxes;
  }
  console.log("CLEAN GEOMETRY", JSON.stringify(await checkDesktop()));
  await page.screenshot({ path: `${dir}/clean-desktop.png`, caret: "initial" });
  await page.getByRole("button", { name: "CUSTOMISE", exact: true }).click();
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await page.evaluate(
    (heart) => {
      const key = "stan-army:theme:v1:army:army-nova";
      const t = JSON.parse(localStorage.getItem(key));
      t.background.color = "#dbff00";
      t.background.image = heart;
      t.background.size = "tile";
      t.colors.text = "#000000";
      t.colors.links = "#172b71";
      t.colors.buttons = "#305bff";
      t.colors.borders = "#263d4a";
      t.panels.color = "#25fac4";
      t.panels.corners = "original";
      t.playerSkin = "desktop";
      localStorage.setItem(key, JSON.stringify(t));
    },
    (() => {
      const png = fs.readFileSync("public/gifs/leave-your-mark.png");
      return {
        dataUrl: `data:image/png;base64,${png.toString("base64")}`,
        mime: "image/png",
        bytes: png.length,
        width: png.readUInt32BE(16),
        height: png.readUInt32BE(20),
        animated: false,
      };
    })(),
  );
  await page.reload({ waitUntil: "networkidle" });
  console.log("CUSTOM GEOMETRY", JSON.stringify(await checkDesktop()));
  await page.screenshot({
    path: `${dir}/custom-desktop.png`,
    caret: "initial",
  });
  const before = await page.evaluate(() =>
    localStorage.getItem("stan-army:theme:v1:army:army-nova"),
  );
  for (const width of [1024, 820, 800, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    );
    if (width <= 800) {
      await page.locator(".member-dropdown > summary").click();
      const popup = await page.locator(".member-popover").boundingBox();
      assert.ok(
        popup.x >= 0 && popup.x + popup.width <= width,
        `member popup ${width}`,
      );
      await page.keyboard.press("Escape");
    }
    if (width === 390)
      await page.screenshot({
        path: `${dir}/custom-mobile.png`,
        fullPage: true,
        caret: "initial",
      });
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.getByRole("button", { name: "View clean", exact: true }).click();
  await checkDesktop();
  await page.getByRole("button", { name: "View custom", exact: true }).click();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("stan-army:theme:v1:army:army-nova"),
    ),
    before,
  );
  await page.locator(".member-dropdown > summary").click();
  await page.locator(".member-popover").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: aligned columns/cards, 24px identity spacing, straight card frames, clean/custom, no overflow 320–1440px, original saved customisation unchanged, member popup, reduced motion; no page errors.",
  );
} finally {
  await browser.close();
}
