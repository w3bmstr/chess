const { chromium } = require("playwright");

(async () => {
  const errors = [];
  const warns = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", msg => {
    const text = msg.text();
    if (msg.type() === "error") errors.push(text);
    if (msg.type() === "warning" || text.includes("Board3D:")) warns.push(text);
  });

  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.click("#start-playing");
  await page.waitForSelector("#btn-toggle-3d", { timeout: 10000 });
  await page.click("#btn-toggle-3d");

  await page.evaluate(() => {
    const fn = window.apply3DRenderStyle || globalThis.apply3DRenderStyle;
    if (typeof fn === "function") fn("staunton");
  });

  await page.waitForFunction(
    () => window.Board3D && window.Board3D._stauntonGeometryCache && window.Board3D._stauntonGeometryCache.size >= 6,
    null,
    { timeout: 45000 }
  );

  for (const style of ["staunton-ivory", "staunton-bronze", "staunton"]) {
    await page.evaluate(s => {
      const fn = window.apply3DRenderStyle || globalThis.apply3DRenderStyle;
      if (typeof fn === "function") fn(s);
    }, style);
  }

  const result = await page.evaluate(() => ({
    cacheSize: window.Board3D._stauntonGeometryCache.size,
    cacheKeys: Array.from(window.Board3D._stauntonGeometryCache.keys()).sort(),
    board3dStyle: document.body.dataset.board3dStyle || "",
    board3dDisplay: document.getElementById("board-3d-container")?.style.display || "",
    missingPieces: Array.from(window.Board3D._stauntonMissingPieces || []),
    assetsUnavailable: Boolean(window.Board3D._stauntonAssetsUnavailable)
  }));

  console.log("STL_CHECK:" + JSON.stringify({ result, errors, warns }));
  await browser.close();
})();
