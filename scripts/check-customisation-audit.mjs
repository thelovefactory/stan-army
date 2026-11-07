import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const base = process.env.BASE_URL || "http://localhost:3000",
  dir = process.env.SCREENSHOT_DIR || "/tmp/stan-army-customisation-review";
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
function luminance(rgb) {
  return rgb
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number)
    .map((v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function ratio(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1050 },
      reducedMotion: "reduce",
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const style = async (selector, property) =>
    page
      .locator(selector)
      .first()
      .evaluate((e, p) => getComputedStyle(e)[p], property);
  const open = () =>
    page.getByRole("button", { name: "CUSTOMISE", exact: true }).click();
  const colour = async (label, value) =>
    page
      .getByLabel(label, { exact: false })
      .and(page.locator('input[type="color"]'))
      .evaluate((e, v) => {
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        ).set.call(e, v);
        e.dispatchEvent(new Event("input", { bubbles: true }));
        e.dispatchEvent(new Event("change", { bubbles: true }));
      }, value);
  const range = async (value) =>
    page
      .getByLabel("Secondary panel opacity", { exact: false })
      .evaluate((e, v) => {
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        ).set.call(e, String(v));
        e.dispatchEvent(new Event("input", { bubbles: true }));
        e.dispatchEvent(new Event("change", { bubbles: true }));
      }, value);
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  await open();
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await page.evaluate(() => {
    const key = "stan-army:theme:v1:army:army-nova",
      t = JSON.parse(localStorage.getItem(key));
    delete t.participationColor;
    t.panels.color = "#25fac4";
    t.colors.text = "#000000";
    localStorage.setItem(key, JSON.stringify(t));
  });
  const old = await page.evaluate(() =>
    localStorage.getItem("stan-army:theme:v1:army:army-nova"),
  );
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(37, 250, 196)",
  );
  assert.equal(
    await style(".army-chat", "backgroundColor"),
    "rgb(37, 250, 196)",
  );
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("stan-army:theme:v1:army:army-nova"),
    ),
    old,
  );
  await open();
  assert.equal(
    await page.getByRole("checkbox", { name: "Gallery", exact: true }).count(),
    0,
  );
  assert.equal(
    await page.getByLabel("Background sizing", { exact: false }).isDisabled(),
    true,
  );
  const boardBefore = await style(".board-header", "backgroundColor"),
    eventsBefore = await style(".events-panel", "backgroundColor"),
    playerBefore = await style(".sidebar-playlist", "backgroundColor");
  await colour("Participation Colour", "#ff1493");
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(255, 20, 147)",
  );
  assert.equal(
    await style(".army-chat", "backgroundColor"),
    "rgb(255, 20, 147)",
  );
  assert.equal(await style(".board-header", "backgroundColor"), boardBefore);
  assert.equal(await style(".events-panel", "backgroundColor"), eventsBefore);
  assert.equal(
    await style(".sidebar-playlist", "backgroundColor"),
    playerBefore,
  );
  await colour("Secondary panel background", "#303045");
  assert.equal(
    await style(".board-header", "backgroundColor"),
    "rgb(48, 48, 69)",
  );
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(255, 20, 147)",
  );
  await colour("Page & panel text", "#000000");
  await colour("Links", "#aaffee");
  await colour("Primary buttons", "#0073e6");
  await colour("Panel borders", "#ffaa00");
  await colour("Decorative accents", "#00ff00");
  for (const selector of [
    ".simple-composer .composer-actions > button",
    ".chat-compose > button",
    ".identity-actions > .button",
  ])
    assert.equal(await style(selector, "backgroundColor"), "rgb(0, 115, 230)");
  for (const border of ["solid", "dashed", "dotted", "double"]) {
    await page
      .getByLabel("Panel border style", { exact: false })
      .selectOption(border);
    assert.equal(await style(".events-panel", "borderTopStyle"), border);
    assert.equal(
      await style(".events-panel", "borderTopWidth"),
      border === "double" ? "3px" : "1px",
    );
  }
  for (const [corner, expected] of [
    ["square", "0px"],
    ["round", "30px"],
    ["wonky", "8px"],
    ["original", "15px"],
  ]) {
    await page
      .getByLabel("Panel corners", { exact: false })
      .selectOption(corner);
    assert.equal(
      await style(".simple-composer", "borderTopLeftRadius"),
      expected,
    );
    assert.equal(
      await style(".chat-compose > button", "borderTopLeftRadius"),
      "10px",
    );
  }
  await range(0);
  assert.match(await style(".events-panel", "backgroundColor"), /, 0\)$/);
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(255, 20, 147)",
  );
  await range(100);
  assert.equal(
    await style(".events-panel", "backgroundColor"),
    "rgb(48, 48, 69)",
  );
  await page
    .getByLabel("Heading & decorative font", { exact: false })
    .selectOption("scene-headline");
  assert.match(await style(".artist-identity h1", "fontFamily"), /Impact/);
  assert.match(await style("#fan-mark", "fontFamily"), /Arial/);
  assert.match(await style("#chat-draft", "fontFamily"), /Arial/);
  await colour("Background colour", "#dbff00");
  await page
    .getByLabel("Background image or GIF", { exact: false })
    .setInputFiles("public/gifs/leave-your-mark.png");
  for (const [mode, size, repeat] of [
    ["cover", "cover", "no-repeat"],
    ["contain", "contain", "no-repeat"],
    ["tile", "auto", "repeat"],
    ["natural", "auto", "no-repeat"],
  ]) {
    await page
      .getByLabel("Background sizing", { exact: false })
      .selectOption(mode);
    assert.equal(await style(".profile-canvas", "backgroundSize"), size);
    assert.equal(await style(".profile-canvas", "backgroundRepeat"), repeat);
  }
  for (const [position, expected] of [
    ["center", "50% 50%"],
    ["top", "50% 0%"],
    ["bottom", "50% 100%"],
    ["left", "0% 50%"],
    ["right", "100% 50%"],
  ]) {
    await page
      .getByLabel("Background position", { exact: false })
      .selectOption(position);
    assert.equal(
      await style(".profile-canvas", "backgroundPosition"),
      expected,
    );
  }
  for (const scroll of ["fixed", "scroll"]) {
    await page
      .getByLabel("Wallpaper scroll", { exact: false })
      .selectOption(scroll);
    assert.equal(
      await style(".profile-canvas", "backgroundAttachment"),
      scroll,
    );
  }
  for (const decoration of [
    "hearts",
    "stars",
    "flames",
    "butterflies",
    "pixels",
    "none",
  ]) {
    await page
      .getByLabel("Original CSS sticker set", { exact: false })
      .selectOption(decoration);
    assert.equal(
      await page.locator(`.theme-decorations.decoration-${decoration}`).count(),
      1,
    );
  }
  await page.getByLabel("Add a little glitter", { exact: false }).check();
  assert.equal(await page.locator(".theme-decorations.has-glitter").count(), 1);
  await page
    .getByLabel("Animate decorations & uploaded GIFs", { exact: false })
    .uncheck();
  await page
    .getByLabel("Animate decorations & uploaded GIFs", { exact: false })
    .check();
  assert.equal(await page.locator(".profile-canvas.theme-still").count(), 1);
  await page
    .getByLabel("Header image", { exact: false })
    .setInputFiles("public/gifs/leave-your-mark.png");
  await page.locator(".has-custom-banner").waitFor();
  assert.match(
    await style(".has-custom-banner", "backgroundImage"),
    /data:image\/png/,
  );
  await page
    .getByLabel("Profile image", { exact: false })
    .setInputFiles("public/gifs/bside-people.png");
  await page.locator('.artist-avatar img[src^="data:image/png"]').waitFor();
  assert.match(
    await page.locator(".artist-avatar img").getAttribute("src"),
    /^data:image\/png/,
  );
  const wallpaper = await style(".profile-canvas", "backgroundImage");
  await page
    .locator(".asset-input")
    .filter({ hasText: "Header image" })
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  assert.equal(await page.locator(".has-custom-banner").count(), 0);
  assert.equal(await style(".profile-canvas", "backgroundImage"), wallpaper);
  await page
    .locator(".asset-input")
    .filter({ hasText: "Profile image" })
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  await page
    .locator(".asset-input")
    .filter({ hasText: "Background image or GIF" })
    .getByRole("button", { name: "Remove", exact: true })
    .click();
  assert.equal(await style(".profile-canvas", "backgroundImage"), "none");
  assert.equal(
    await page.getByLabel("Background sizing", { exact: false }).isDisabled(),
    true,
  );
  await page
    .getByRole("button", {
      name: "Try our original animated pixel-heart GIF",
      exact: false,
    })
    .click();
  assert.equal(await style(".profile-canvas", "backgroundImage"), "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".profile-canvas.theme-motion").waitFor();
  assert.notEqual(await style(".profile-canvas", "backgroundImage"), "none");
  await page
    .getByLabel("Animate decorations & uploaded GIFs", { exact: false })
    .uncheck();
  assert.equal(await style(".profile-canvas", "backgroundImage"), "none");
  await page
    .getByLabel("Animate decorations & uploaded GIFs", { exact: false })
    .check();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".profile-canvas.theme-still").waitFor();
  for (const skin of ["desktop", "y2k", "minimal", "toxic"]) {
    await page.locator("#army-player-skin").selectOption(skin);
    assert.equal(
      await page.locator(`.sidebar-playlist.playlist-${skin}`).count(),
      1,
    );
  }
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(37, 250, 196)",
  );
  for (const [id, colourValue] of [
    ["blank-canvas", "#ffffff"],
    ["glitter-bomb", "#ff1493"],
    ["scene-queen", "#ffff00"],
  ]) {
    await open();
    await page.locator(`.preset-${id}`).click();
    await colour("Participation Colour", colourValue);
    if (id === "scene-queen") {
      await colour("Background colour", "#dbff00");
      await page
        .getByLabel("Background image or GIF", { exact: false })
        .setInputFiles("public/gifs/leave-your-mark.png");
      await page
        .getByLabel("Background sizing", { exact: false })
        .selectOption("tile");
    }

    await page.getByRole("button", { name: "Save theme", exact: true }).click();
    await page.reload({ waitUntil: "networkidle" });
    const expectedParticipation = {
      "#ffffff": "rgb(255, 255, 255)",
      "#ff1493": "rgb(255, 20, 147)",
      "#ffff00": "rgb(255, 255, 0)",
    }[colourValue];
    await page.waitForFunction(
      (expected) =>
        getComputedStyle(document.querySelector(".simple-composer"))
          .backgroundColor === expected,
      expectedParticipation,
    );
    const pc = await style(".simple-composer", "backgroundColor");
    assert.equal(await style(".army-chat", "backgroundColor"), pc);
    for (const selector of ["#fan-mark", "#chat-draft"])
      assert.ok(ratio(await style(selector, "color"), pc) >= 4.5);
    assert.ok(
      ratio(await style(".army-chat .panel-title h2 > svg", "color"), pc) >= 3,
    );
    assert.ok(
      ratio(await style(".army-chat .mint-text > svg", "color"), pc) >= 3,
    );

    if (id === "blank-canvas") {
      const note = page.locator(".fan-note").first();
      await note.locator("footer button").nth(1).click();
      await page
        .getByLabel("Reply to jess.wav", { exact: true })
        .fill("Easy to reply here.");
      assert.equal(
        await style(".note-replies form > button", "backgroundColor"),
        await style(".identity-actions > .button", "backgroundColor"),
      );
      await page
        .getByRole("button", { name: "Send local reply", exact: true })
        .click();
      await page.getByText("Easy to reply here.", { exact: true }).waitFor();
    }
    const actions = page.locator(".board-header-actions").first();
    for (const el of await actions.locator("button,a").all()) {
      assert.equal(
        await el.evaluate((e) => getComputedStyle(e).backgroundColor),
        "rgba(0, 0, 0, 0)",
      );
      assert.equal(
        await el.evaluate((e) => getComputedStyle(e).borderTopWidth),
        "0px",
      );
    }
    const boxes = await Promise.all(
      (await actions.locator("button,a").all()).map((el) => el.boundingBox()),
    );
    assert.ok(
      Math.max(...boxes.map((b) => b.y)) - Math.min(...boxes.map((b) => b.y)) <
        1,
      "actions align",
    );
    await page.screenshot({
      path: `${dir}/${id}-desktop.png`,
      caret: "initial",
    });
    await page
      .locator(".discussion-board .board-header")
      .screenshot({ path: `${dir}/${id}-board-actions.png`, caret: "initial" });
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${id} mobile ${width}`,
      );
      assert.match(await style("#fan-mark", "fontFamily"), /Arial/);
      assert.ok(
        ratio(
          await style("#chat-draft", "color"),
          await style(".army-chat", "backgroundColor"),
        ) >= 4.5,
      );
      if (width === 390)
        await page.screenshot({
          path: `${dir}/${id}-mobile.png`,
          fullPage: true,
          caret: "initial",
        });
    }
    await page.setViewportSize({ width: 1440, height: 1050 });
  }
  await page.getByRole("button", { name: "+ My Boards", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Saved to My Boards", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page
    .getByRole("button", { name: "Start a discussion", exact: true })
    .click();
  await page.getByLabel("Title", { exact: true }).fill("Still easy to join in");
  await page
    .getByLabel("Your post", { exact: true })
    .fill("Same interaction, different atmosphere.");
  await page
    .getByRole("button", { name: "Post discussion", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Still easy to join in", exact: true })
    .waitFor();
  await page.getByRole("link", { name: "Open board", exact: false }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  assert.notEqual(
    await page
      .getByRole("link", { name: "Open board", exact: false })
      .evaluate((e) => getComputedStyle(e).outlineStyle),
    "none",
  );
  await page.getByRole("link", { name: "Open board", exact: false }).click();
  await page.getByRole("heading", { name: "s/nova", level: 2 }).waitFor();
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  const saved = await page.evaluate(() =>
    localStorage.getItem("stan-army:theme:v1:army:army-nova"),
  );
  await page.getByRole("button", { name: "View clean", exact: true }).click();
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    await style(".army-chat", "backgroundColor"),
  );
  await page.getByRole("button", { name: "View custom", exact: true }).click();
  assert.equal(
    await page.evaluate(() =>
      localStorage.getItem("stan-army:theme:v1:army:army-nova"),
    ),
    saved,
  );
  await open();
  await page
    .getByRole("checkbox", { name: "Events & links", exact: true })
    .uncheck();
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await open();
  await page
    .getByRole("button", { name: "Reset appearance", exact: false })
    .click();
  assert.equal(
    await page
      .getByLabel("Participation Colour", { exact: false })
      .inputValue(),
    "#161619",
  );
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#events").waitFor({ state: "detached" });
  assert.equal(await page.locator("#events").count(), 0);
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(22, 22, 25)",
  );
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    for (const action of await page
      .locator(".board-header-actions")
      .first()
      .locator("button,a")
      .all())
      assert.ok((await action.boundingBox()).height >= 44);
  }
  await page.screenshot({
    path: `${dir}/mobile.png`,
    fullPage: true,
    caret: "initial",
  });

  await page.setViewportSize({ width: 1440, height: 1050 });
  for (const [slug, pc] of [
    ["sienna-blue", "#ff1493"],
    ["atlas-noir", "#ffff00"],
  ]) {
    await page.goto(`${base}/armies/${slug}`, { waitUntil: "networkidle" });
    assert.equal(
      await style(".army-chat", "backgroundColor"),
      "rgb(22, 22, 25)",
    );
    await open();
    await colour("Participation Colour", pc);
    await page
      .getByLabel("Panel corners", { exact: false })
      .selectOption("round");
    await page.getByRole("button", { name: "Save theme", exact: true }).click();
    assert.equal(
      await style(".sidebar-playlist", "borderTopLeftRadius"),
      "30px",
    );
    assert.ok(
      ratio(
        await style("#chat-draft", "color"),
        await style(".army-chat", "backgroundColor"),
      ) >= 4.5,
    );
    assert.match(await style("#chat-draft", "fontFamily"), /Arial/);
  }
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  assert.equal(
    await style(".simple-composer", "backgroundColor"),
    "rgb(22, 22, 25)",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all editable control families, legacy migration, participation isolation/contrast, predictable panel controls, stable input fonts, uploads, six decoration sets, skins, save/cancel/refresh/reset, clean/reduced motion, minimal board actions/functionality/focus and mobile targets; no page errors.",
  );
} finally {
  await browser.close();
}
