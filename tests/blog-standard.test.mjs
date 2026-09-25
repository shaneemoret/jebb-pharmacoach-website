import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import posts from "../src/posts.json" with { type: "json" };
import { prepareArticleBlocks } from "../src/blogBlocks.js";

const blogSource = await readFile(new URL("../src/Blog.jsx", import.meta.url), "utf8");
const articleStyles = await readFile(new URL("../src/article.css", import.meta.url), "utf8");
const standard = await readFile(new URL("../BLOG_STANDARD.md", import.meta.url), "utf8");

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

test("every blog route inherits the branded visual and approved author headshot", () => {
  assert.equal(posts.length, 22, "unexpected post count; review the complete library when it changes");
  assert.match(blogSource, /<BlogVisual post=\{post\} \/>/);
  assert.match(blogSource, /<BlogVisual post=\{post\} size="feature" \/>/);
  assert.ok(!blogSource.includes("<img src={post.image}"), "legacy images must not bypass the branded thumbnail system");
  assert.equal((blogSource.match(/jebb-headshot-owner\.png/g) || []).length, 2, "only the byline and author bio should use the approved headshot");
  assert.ok(!blogSource.includes("blog-visual__topline"), "thumbnail topline must stay removed");
  assert.ok(!blogSource.includes("blog-visual__footer"), "thumbnail footer and portrait must stay removed");
  assert.ok(!blogSource.includes("post__guide"), "temporary interview-guide rail must stay removed");
  assert.match(blogSource, /className="post__authorname" href=\{`\$\{BASE\}about`\}/);
  assert.match(articleStyles, /object-position:\s*50% 0/);
});

test("rendered article lists always contain at least three items", () => {
  for (const post of posts) {
    const blocks = prepareArticleBlocks(post.body || []);
    for (const block of blocks.filter(item => item.type === "list")) {
      assert.ok(block.items.length >= 3, `${post.slug} renders an orphan list`);
    }
  }
});

test("the repository carries a durable blog standard for future agents", () => {
  for (const requirement of [
    "Every post must use the shared `BlogVisual` component",
    "`jebb-headshot-owner.png`",
    "Desktop and mobile visual QA",
    "needs-editorial-rewrite",
    "at least three meaningful items",
    "one-word fragments",
  ]) assert.ok(standard.includes(requirement), `BLOG_STANDARD.md is missing: ${requirement}`);
});
