import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import legacyPosts from "../src/legacy-posts.json" with { type: "json" };
import posts from "../src/posts.json" with { type: "json" };

const redirects = readFileSync(new URL("../dist/client/_redirects", import.meta.url), "utf8");
const livePostPaths = new Set(posts.filter(post => post.body).map(post => `/blog/${post.slug}/`));

test("every old Wix article link is mapped exactly once", () => {
  assert.equal(legacyPosts.length, 404, "the Wix post sitemap listed 404 articles");
  const sources = legacyPosts.map(entry => entry.from);
  assert.equal(new Set(sources).size, sources.length, "duplicate legacy source path");
  for (const { from } of legacyPosts) assert.match(from, /^\/post\/[^\s/]+$/);
});

test("every legacy link lands on a page that exists on the new site", () => {
  for (const { from, to, status } of legacyPosts) {
    assert.ok(to === "/blog/" || livePostPaths.has(to), `${from} points at ${to}, which is not a published article`);
    assert.ok(status === 301 || status === 302, `${from} has status ${status}`);
  }
});

test("the build writes both slash forms of every legacy link before the catch-all", () => {
  const lines = redirects.split("\n");
  const catchAll = lines.indexOf("/post/* /blog/ 301");
  assert.ok(catchAll > 0, "missing /post/* catch-all");
  for (const { from, to, status } of legacyPosts) {
    for (const source of [from, `${from}/`]) {
      const index = lines.indexOf(`${source} ${to} ${status}`);
      assert.ok(index >= 0 && index < catchAll, `missing or misplaced redirect for ${source}`);
    }
  }
  const staticRules = lines.filter(line => line.startsWith("/") && !line.includes("*")).length;
  const dynamicRules = lines.filter(line => line.startsWith("/") && line.includes("*")).length;
  assert.ok(staticRules <= 2000 && dynamicRules <= 100, "Cloudflare Pages redirect limits exceeded");
});
