// Optional isolated Chromium checks; setup and environment options: docs/VALIDATION.md.
import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const base = process.env.BASE_URL || "http://localhost:3000";
const capture = process.env.SCREENSHOT_DIR || "/tmp/stan-army-boards-review";
fs.mkdirSync(capture, { recursive: true });
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
  const errors = [],
    giphy = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (r.url().includes("giphy.com")) giphy.push(r.url());
  });
  await page.goto(`${base}/armies/nova`, { waitUntil: "networkidle" });
  await page.getByLabel("Your post to the Army").fill("Keep my words.");
  for (const action of ["close", "cancel", "escape"]) {
    await page.getByRole("button", { name: "Add a poll", exact: true }).click();
    if (action === "close")
      await page
        .getByRole("button", { name: "Close poll", exact: true })
        .click();
    if (action === "cancel") {
      await page.getByLabel("Choice 1").fill("One");
      await page
        .getByRole("button", { name: "Cancel poll", exact: true })
        .click();
    }
    if (action === "escape") {
      await page.getByLabel("Choice 2").focus();
      await page.keyboard.press("Escape");
    }
    assert.equal(await page.locator(".poll-editor").count(), 0);
    assert.equal(
      await page.getByLabel("Your post to the Army").inputValue(),
      "Keep my words.",
    );
  }
  await page
    .getByRole("button", { name: "Open emoji picker", exact: true })
    .click();
  await page.getByRole("button", { name: "Insert 🔥", exact: true }).click();
  assert.match(
    await page.getByLabel("Your post to the Army").inputValue(),
    /🔥/,
  );
  await page
    .getByRole("button", { name: "Open GIF picker", exact: true })
    .click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".reaction-picker").count(), 0);
  await page
    .getByRole("button", { name: "Open GIF picker", exact: true })
    .click();
  await page
    .locator(".reaction-picker")
    .screenshot({ path: `${capture}/gif-emoji-picker.png`, caret: "initial" });
  await page
    .getByRole("button", { name: "Attach B-side people GIF", exact: true })
    .click();
  await page.locator(".attachment-preview").waitFor();
  await page.getByRole("button", { name: "Post", exact: true }).click();
  assert.equal(
    await page
      .locator(".fan-note-list .fan-note")
      .first()
      .locator(".post-attachment")
      .count(),
    1,
  );
  assert.deepEqual(giphy, []);
  await page
    .getByRole("link", { name: "My Boards", exact: true })
    .first()
    .click();
  await page.getByRole("heading", { name: "My Boards", exact: true }).waitFor();
  await page
    .getByRole("button", { name: "Add s/nova to My Boards", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add com/popmusic to My Boards", exact: true })
    .click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#my-boards .board-card").count(), 2);
  await page
    .locator("#my-boards")
    .getByRole("link", { name: "com/popmusic", exact: true })
    .click();
  await page.getByRole("heading", { name: "com/popmusic", level: 2 }).waitFor();
  assert.equal(
    await page.getByRole("link", { name: /Visit .*Army/ }).count(),
    0,
  );
  await page
    .getByRole("button", { name: "Start a discussion", exact: true })
    .click();
  await page
    .getByLabel("Title", { exact: true })
    .fill("My crossover recommendation");
  await page
    .getByLabel("Your post", { exact: true })
    .fill("A song that brought two Armies together.");
  await page
    .getByRole("button", { name: "Post discussion", exact: true })
    .click();
  const thread = page.locator(".board-thread").first();
  await thread
    .getByRole("button", {
      name: "Upvote: My crossover recommendation",
      exact: true,
    })
    .click();
  assert.equal(await thread.locator(".thread-votes strong").innerText(), "1");
  await thread
    .getByRole("button", { name: "My crossover recommendation", exact: true })
    .click();
  await page.getByLabel("Add a reply").fill("Adding this to my playlist.");
  await page.getByRole("button", { name: "Reply", exact: true }).click();
  await page.getByRole("link", { name: "s/nova", exact: true }).click();
  await page.getByRole("heading", { name: "s/nova", level: 2 }).waitFor();
  assert.equal(
    await page
      .getByText("My crossover recommendation", { exact: true })
      .count(),
    0,
  );
  await page
    .getByRole("link", { name: "Visit Nova Reign’s Army", exact: false })
    .count();
  await page.getByRole("link", { name: "com/popmusic", exact: true }).click();
  await page.getByRole("heading", { name: "com/popmusic", level: 2 }).waitFor();
  assert.equal(
    await page
      .getByText("My crossover recommendation", { exact: true })
      .count(),
    1,
  );
  assert.equal(
    await page
      .getByText("Adding this to my playlist.", { exact: true })
      .count(),
    0,
  ); // reply remains inside collapsed thread
  await page
    .getByRole("button", { name: "My crossover recommendation", exact: true })
    .click();
  assert.equal(
    await page
      .getByText("Adding this to my playlist.", { exact: true })
      .count(),
    1,
  );
  await page.screenshot({
    path: `${capture}/community-board.png`,
    fullPage: true,
    caret: "initial",
  });
  await page
    .getByRole("link", { name: "My Boards", exact: false })
    .first()
    .click();
  await page.getByRole("heading", { name: "My Boards", exact: true }).waitFor();
  await page
    .locator("#my-boards")
    .getByRole("button", {
      name: "Remove com/popmusic from My Boards",
      exact: true,
    })
    .click();
  assert.equal(await page.locator("#my-boards .board-card").count(), 1);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#my-boards .board-card").count(), 1);
  await page.screenshot({
    path: `${capture}/boards-desktop.png`,
    fullPage: true,
    caret: "initial",
  });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const url of ["/boards", "/s/nova", "/com/disco"]) {
      await page.goto(`${base}${url}`, { waitUntil: "networkidle" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${url} overflow ${width}`,
      );
    }
  }
  await page.screenshot({
    path: `${capture}/board-mobile.png`,
    fullPage: true,
    caret: "initial",
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: poll close/cancel/Escape preserve text; emoji insertion and local GIF posting; no GIPHY request; My Boards add/remove/refresh; board-scoped threads/replies/votes across client navigation; 320/390px layouts; no page errors.",
  );
} finally {
  await browser.close();
}
