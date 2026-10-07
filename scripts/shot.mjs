import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const port = 8766;
const base = `http://127.0.0.1:${port}/`;

const server = spawn("python", ["-m", "http.server", String(port)], {
  stdio: "ignore",
  windowsHide: true
});

function stop() {
  if (!server.killed) server.kill();
}

try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Le serveur local n'a pas démarré.")), 8000);
    const probe = async () => {
      try {
        const response = await fetch(base);
        if (response.ok) {
          clearTimeout(timer);
          resolve();
          return;
        }
      } catch {
        /* le serveur démarre encore */
      }
      setTimeout(probe, 200);
    };
    probe();
  });

  await mkdir("shots", { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pages = ["", "boxe-educative.html", "clubs.html", "horaires.html", "essai.html", "avis.html", "faq.html", "contact.html"];

  await page.setViewportSize({ width: 1440, height: 900 });
  for (const path of pages) {
    const errors = [];
    page.removeAllListeners("pageerror");
    page.on("pageerror", (error) => errors.push(String(error)));
    await page.goto(base + path, { waitUntil: "networkidle" });
    const name = (path || "index").replace(".html", "");
    await page.screenshot({ path: `shots/${name}-desktop.png` });
    const active = await page.locator(".nav a.is-active").innerText().catch(() => "");
    console.log(`${name} active=${active} errors=${errors.length}`);
    errors.forEach((error) => console.log("  " + error));
  }

  await page.goto(base + "horaires.html?club=ramonville", { waitUntil: "networkidle" });
  const hoursName = await page.locator("#hours-name").innerText();
  const book = await page.locator("#hours-book").getAttribute("href");
  console.log(`hours preselect=${hoursName} book=${book}`);

  await page.goto(base + "essai.html?club=portet&age=6-12", { waitUntil: "networkidle" });
  const checked = await page.locator("input[name=club]:checked").getAttribute("value");
  const age = await page.locator("input[name=age]:checked").getAttribute("value");
  console.log(`essai preselect club=${checked} age=${age}`);

  await page.locator("#trial-form button[type=submit], #trial-form .btn").first().click();
  const emptyError = await page.locator("#form-error").innerText();
  console.log("empty form:", emptyError.slice(0, 80));
  await page.locator("select[name=slot]").selectOption({ index: 1 });
  await page.locator("input[name=parent]").fill("Martin");
  await page.locator("input[name=phone]").fill("0612345678");
  await page.locator("input[name=email]").fill("parent@example.com");
  await page.locator("#trial-form button[type=submit], #trial-form .btn").first().click();
  const okOn = await page.locator("#form-ok").evaluate((node) => node.classList.contains("is-on"));
  console.log("form ready:", okOn);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({ path: "shots/index-mobile.png" });
  await page.locator(".burger").click();
  await page.screenshot({ path: "shots/index-menu.png" });
  console.log("mobile menu open");

  await browser.close();
} finally {
  stop();
}
