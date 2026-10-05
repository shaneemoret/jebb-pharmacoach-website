import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import posts from "../src/posts.json" with { type: "json" };
import firstOriginals from "../migration/editorial-originals.json" with { type: "json" };
import remainingOriginals from "../migration/editorial-originals-all.json" with { type: "json" };
import reviews from "../migration/editorial-review-manifest.json" with { type: "json" };

const originals = [...firstOriginals, ...remainingOriginals];
const revised = posts.filter(post => post.formatVersion === "editorial-v2");
const blockedCopy = /check the comments|click.{0,20}profile|link in (?:my |the )?bio|\bdm me\b|medrepcollege|six.figure|uncapped commission|650\+|90 days|clients placed|are you ambitious|book (?:a )?(?:call|discovery call|strategy call)|placement rate|average time to (?:hire|hired|placement)|average (?:first.year )?ote|personalized guidance|referral bonus|refer a friend|\$100k (?:med rep|medical sales|pharma)/iu;
const oldTemplate = /A practical guide to|Use the original lesson as a starting point|Start with current openings rather than a generic picture|Practice enough to organize your answer/iu;

test("all 395 editorial drafts were rebuilt from their archived source records", () => {
  assert.equal(originals.length, 395);
  assert.equal(reviews.length, 395);
  assert.equal(revised.length, 395);
  assert.equal(new Set(reviews.map(review => review.slug)).size, 395);
  assert.equal(posts.filter(post => post.editorialStatus === "editorial-draft").length, 0);
  assert.equal(posts.filter(post => post.editorialStatus === "needs-editorial-rewrite").length, 0);
});

test("every revised article is structured, sourced, distinct and ready for author review", () => {
  for (const post of revised) {
    assert.equal(post.editorialStatus, "editorial-review-ready", post.slug);
    assert.equal(post.editorialRevision.authorReview, "pending", post.slug);
    assert.equal(post.modified, "2026-10-02", post.slug);
    assert.ok(post.excerpt.length <= 220, post.slug);
    assert.ok(!/^A practical guide to/i.test(post.excerpt), post.slug);
    assert.ok(["p", "list"].includes(post.body[0].type), post.slug);
    assert.ok(post.body.filter(block => block.type === "h2").length >= 4, post.slug);
    const faqHeading = post.body.findIndex(block => block.type === "h2" && block.text === "Frequently asked questions");
    assert.ok(faqHeading > 0, post.slug);
    assert.equal(post.body.slice(faqHeading + 1).filter(block => block.type === "h3").length, 3, post.slug);
    assert.ok(post.body.some(block => block.runs?.some(run => run.url === post.sources[0].url)), post.slug);
    assert.ok(post.sources[0].url.startsWith("https://"), post.slug);
    assert.ok(!blockedCopy.test(JSON.stringify(post.body)), post.slug);
    assert.ok(!oldTemplate.test(JSON.stringify(post.body)), post.slug);
    assert.ok(!/[🔥💰🏆🎯👋✅❌⚠️🔴🟢]/u.test(JSON.stringify(post.body)), post.slug);
    for (const block of post.body.filter(block => block.type === "p")) {
      assert.ok(block.text.trim().split(/\s+/).length >= 8, `${post.slug} retains a caption fragment: ${block.text}`);
    }
    for (const block of post.body.filter(block => block.type === "list")) assert.ok(block.items.length >= 3, post.slug);
  }
});

test("source provenance, dates, bylines and stable URLs remain intact", () => {
  for (const original of originals) {
    const post = revised.find(item => item.slug === original.slug);
    assert.ok(post, original.slug);
    assert.equal(post.slug, original.slug);
    assert.equal(post.published, original.published);
    assert.equal(post.author, original.author);
    assert.deepEqual(post.legacySource, original.legacySource);
  }
});

test("the rewrite removed large shared body templates", () => {
  const counts = new Map();
  for (const post of revised) {
    for (const block of post.body.filter(item => item.type === "p" && item.text.length >= 80)) {
      counts.set(block.text, (counts.get(block.text) || 0) + 1);
    }
  }
  const repeated = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  assert.ok((repeated[0]?.[1] || 0) <= 10, `paragraph repeated ${repeated[0][1]} times: ${repeated[0][0]}`);
});

test("per-article review manifest records content and delivery checks", () => {
  for (const review of reviews) {
    assert.ok(review.originalWords >= 0, review.slug);
    assert.ok(review.revisedWords >= 300, review.slug);
    assert.ok(review.preservedBlocks >= 5, review.slug);
    assert.ok(review.headings >= 4, review.slug);
    assert.equal(review.faqs, 3, review.slug);
    assert.deepEqual(review.checks, {
      answerFirst: true,
      listsAtLeastThree: true,
      sourceLinked: true,
      distinctExcerpt: true,
      authorReview: "pending",
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
