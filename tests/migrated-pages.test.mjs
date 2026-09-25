import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const routes = ["academy", "free-medical-sales-training", "apply-for-pharmaceutical-sales-career-coaching", "application"];

for (const route of routes) {
  test(`${route} has a generated branded page`, () => {
    const html = readFileSync(new URL(`../dist/client/${route}/index.html`, import.meta.url), "utf8");
    assert.match(html, /THE PHARMA COACH/);
    assert.match(html, /migrated-pages\.css/);
    assert.match(html, /<link rel="canonical" href="https:\/\/thepharmacoach\.com\//);
    assert.doesNotMatch(html, /TODO|Lorem ipsum|href="#"/);
  });
}

test("migrated routes are in the sitemap", () => {
  const sitemap = readFileSync(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");
  for (const route of routes.filter(route => route !== "application")) assert.match(sitemap, new RegExp(`https://thepharmacoach\\.com/${route}`));
  assert.doesNotMatch(sitemap, /https:\/\/thepharmacoach\.com\/application</);
});
