import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const routes = [
  "academy",
  "fast-track-academy",
  "mastermind-accelerator",
  "pricing-plans/pharmaceutical-sales-interview-help",
  "vip-signature-access",
  "pharmaceutical-sales-vip-mentorship",
  "faq",
  "medical-sales-faq",
];

const legacyFormRoutes = [
  ["free-medical-sales-training", "https://medrepcollege.com/access"],
  ["apply-for-pharmaceutical-sales-career-coaching", "https://medrepcollege.com/apply-for-med-rep-college-now"],
  ["application", "https://medrepcollege.com/apply-for-med-rep-college-now"],
];

for (const route of routes) {
  test(`${route} has a generated branded page`, () => {
    const html = readFileSync(new URL(`../dist/client/${route}/index.html`, import.meta.url), "utf8");
    assert.match(html, /THE PHARMA COACH/);
    assert.match(html, /migrated-pages\.css/);
    assert.match(html, /<link rel="canonical" href="https:\/\/thepharmacoach\.com\//);
    assert.doesNotMatch(html, /TODO|Lorem ipsum|href="#"/);
  });
}

test("primary migrated routes are in the sitemap", () => {
  const sitemap = readFileSync(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8");
  for (const route of ["academy", "mastermind-accelerator", "vip-signature-access", "faq"]) {
    assert.match(sitemap, new RegExp(`https://thepharmacoach\\.com/${route}`));
  }
  for (const [route] of legacyFormRoutes) {
    assert.doesNotMatch(sitemap, new RegExp(`https://thepharmacoach\\.com/${route}`));
  }
});

for (const [route, destination] of legacyFormRoutes) {
  test(`${route} sends the form journey to Med Rep College`, () => {
    const html = readFileSync(new URL(`../dist/client/${route}/index.html`, import.meta.url), "utf8");
    assert.ok(html.includes(destination));
    assert.match(html, /window\.location\.replace/);
    assert.doesNotMatch(html, /migrated-pages\.css/);
  });
}
