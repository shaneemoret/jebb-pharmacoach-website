import assert from "node:assert/strict";
import test from "node:test";
import posts from "../src/posts.json" with { type: "json" };

test("normalized legacy articles expose real sections for article navigation", () => {
  const normalized = posts.filter(post => post.formatVersion === "editorial-v1");
  assert.ok(normalized.length > 0, "expected normalized imported articles");
  for (const post of normalized) {
    assert.ok(post.body.some(block => block.type === "h2"), `${post.slug} has no section heading`);
    assert.ok(post.excerpt.length <= 220, `${post.slug} has an overlong excerpt`);
    assert.ok(!post.body.some(block => block.type === "p" && /^(?:[↓↳★✦➨➜➟➡✅✓•·\s]|\uFE0F)+$/u.test(block.text)), `${post.slug} retains a decorative divider`);
  }
});

test("flattened social imports are not mislabeled as standard articles", () => {
  const needsRewrite = posts.filter(post => post.editorialStatus === "needs-editorial-rewrite");
  assert.ok(needsRewrite.length > 0, "expected raw social-style imports to remain in the rewrite queue");
  for (const post of needsRewrite) assert.equal(post.formatVersion, undefined);
});

test("the currently reviewed dermatologist article has editorial landmarks", () => {
  const post = posts.find(item => item.slug === "what-can-a-dermatologist-teach-you-about-succeeding-in-pharmaceutical-sales");
  assert.ok(post);
  assert.ok(post.body.filter(block => block.type === "h2").length >= 5);
  assert.ok(post.body.some(block => block.type === "list"));
});
