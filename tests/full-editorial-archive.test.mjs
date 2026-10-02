import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import posts from "../src/posts.json" with { type: "json" };
import originals from "../migration/editorial-originals-all.json" with { type: "json" };
import reviews from "../migration/editorial-review-manifest.json" with { type: "json" };

const revised = posts.filter(post => post.editorialRevision?.originalFile === "migration/editorial-originals-all.json");
const blockedCopy = /check the comments|click.{0,20}profile|link in (?:my |the )?bio|\bdm me\b|medrepcollege|six.figure|uncapped commission|650\+|90 days/iu;

test("the complete remaining archive received an auditable editorial pass", () => {
  assert.equal(originals.length, 392);
  assert.equal(reviews.length, 392);
  assert.equal(revised.length, 392);
  assert.equal(new Set(reviews.map(review => review.slug)).size, 392);
  assert.equal(posts.filter(post => post.editorialStatus === "needs-editorial-rewrite").length, 0);
});

test("every revised article has answer-first copy, semantic sections, FAQs and a linked primary source", () => {
  for (const post of revised) {
    assert.equal(post.formatVersion, "editorial-v1", post.slug);
    assert.equal(post.editorialStatus, "editorial-draft", post.slug);
    assert.equal(post.editorialRevision.authorReview, "pending", post.slug);
    assert.ok(post.excerpt.length <= 220, post.slug);
    assert.equal(post.body[0].type, "p", post.slug);
    assert.equal(post.body[1].type, "p", post.slug);
    assert.ok(post.body.filter(block => block.type === "h2").length >= 4, post.slug);
    const faqHeading = post.body.findIndex(block => block.type === "h2" && block.text === "Frequently asked questions");
    assert.ok(faqHeading > 0, post.slug);
    assert.equal(post.body.slice(faqHeading + 1).filter(block => block.type === "h3").length, 3, post.slug);
    assert.ok(post.body.some(block => block.runs?.some(run => run.url === post.sources[0].url)), post.slug);
    assert.ok(post.sources[0].url.startsWith("https://"), post.slug);
    assert.ok(!blockedCopy.test(JSON.stringify(post.body)), post.slug);
    assert.ok(!/[🔥💰🏆🎯👋✅❌⚠️🔴🟢]/u.test(JSON.stringify(post.body)), post.slug);
    for (const block of post.body.filter(block => block.type === "p")) {
      assert.ok(block.text.trim().split(/\s+/).length >= 8, `${post.slug} retains a caption fragment: ${block.text}`);
    }
    for (const block of post.body.filter(block => block.type === "list")) assert.ok(block.items.length >= 3, post.slug);
  }
});

test("original dates, authors, slugs and source receipts remain intact", () => {
  for (const original of originals) {
    const post = revised.find(item => item.slug === original.slug);
    assert.ok(post, original.slug);
    assert.equal(post.slug, original.slug);
    assert.equal(post.published, original.published);
    assert.equal(post.author, original.author);
    assert.deepEqual(post.legacySource, original.legacySource);
  }
});

test("per-article review manifest records the checks and correction flags", () => {
  for (const review of reviews) {
    assert.ok(review.originalWords >= 0, review.slug);
    assert.ok(review.revisedWords >= 300, review.slug);
    assert.ok(review.headings >= 4, review.slug);
    assert.equal(review.faqs, 3, review.slug);
    assert.ok(review.flags.length > 0, review.slug);
    assert.deepEqual(review.checks, {
      answerFirst: true,
      listsAtLeastThree: true,
      sourceLinked: true,
      authorReview: "pending"
    });
  }
});

test("generated Markdown carries sources and editorial disclosure", () => {
  for (const post of revised) {
    const markdown = readFileSync(new URL(`../dist/client/markdown/blog/${decodeURIComponent(post.slug)}.md`, import.meta.url), "utf8");
    assert.ok(markdown.includes("## Sources"), post.slug);
    assert.ok(markdown.includes("assisted editing"), post.slug);
    assert.ok(markdown.includes(post.sources[0].url), post.slug);
  }
});
