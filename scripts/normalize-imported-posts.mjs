#!/usr/bin/env node
// Restore semantic structure that was flattened when legacy Wix articles were
// imported. This changes presentation metadata only; it does not rewrite or
// add claims.
import { readFileSync, writeFileSync } from "node:fs";

const postsUrl = new URL("../src/posts.json", import.meta.url);
const posts = JSON.parse(readFileSync(postsUrl, "utf8"));

const divider = /^(?:[↓↳★✦➨➜➟➡✅✓•·\s]|\uFE0F)+$/u;
const bullet = /^(?:↳|★|✦|➨|➜|➟|➡️?|✅|✓|•)\s*/u;
const numbered = /^(\d+)[.)]\s+/;
const smallWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "is", "of", "on", "or", "the", "to", "with", "your"]);

function isHeading(text) {
  const clean = text.trim();
  const words = clean.split(/\s+/);
  if (clean.length < 8 || clean.length > 95 || words.length < 2 || words.length > 14) return false;
  if (/https?:|www\.|[@#]|[+＝=]|[.!…]$/.test(clean) || /[👋🔥💰]/u.test(clean)) return false;
  if (/^(?:read|click|watch|follow|comment|send|share|book|apply)\b/i.test(clean)) return false;

  const meaningful = words
    .map(word => word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ""))
    .filter(word => word && !smallWords.has(word.toLowerCase()));
  if (meaningful.length < 2) return false;
  const titleWords = meaningful.filter(word => /^[A-Z0-9]/.test(word));
  return titleWords.length / meaningful.length >= 0.72;
}

function conciseExcerpt(value) {
  const clean = value.replace(/[↓↳★✦➨➜➡✅✓]+/gu, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= 220) return clean;
  const shortened = clean.slice(0, 207).replace(/\s+\S*$/, "").replace(/[,:;\s]+$/, "");
  return `${shortened}…`;
}

function normalizeBody(body) {
  const output = [];

  for (let index = 0; index < body.length; index += 1) {
    const block = body[index];
    if (block.type !== "p") {
      output.push(block);
      continue;
    }

    const text = block.text.trim();
    if (!text || divider.test(text)) continue;

    if (bullet.test(text)) {
      const items = [];
      while (index < body.length && body[index].type === "p" && bullet.test(body[index].text.trim())) {
        items.push(body[index].text.trim().replace(bullet, "").trim());
        index += 1;
      }
      index -= 1;
      output.push({ type: "list", items, ordered: false });
      continue;
    }

    if (numbered.test(text)) {
      const items = [];
      while (index < body.length && body[index].type === "p" && numbered.test(body[index].text.trim())) {
        items.push(body[index].text.trim().replace(numbered, "").trim());
        index += 1;
      }
      index -= 1;
      output.push({ type: "list", items, ordered: true });
      continue;
    }

    output.push(isHeading(text) ? { type: "h2", text } : block);
  }

  return output;
}

let changed = 0;
let headings = 0;
let lists = 0;

const normalized = posts.map(post => {
  if (!post.body) return post;
  if (post.formatVersion === "editorial-v1") {
    const body = normalizeBody(post.body);
    const sectionCount = body.filter(block => block.type === "h2").length;
    if (sectionCount >= 2) return { ...post, excerpt: conciseExcerpt(post.excerpt || ""), body, editorialStatus: "archive-normalized" };
    const { formatVersion: _formatVersion, ...rest } = post;
    return { ...rest, editorialStatus: "needs-editorial-rewrite" };
  }
  if (post.body.some(block => block.type === "h2")) {
    return { ...post, editorialStatus: post.source ? "standard-v1" : "archive-structured" };
  }
  const body = normalizeBody(post.body);
  headings += body.filter(block => block.type === "h2").length;
  lists += body.filter(block => block.type === "list").length;
  changed += 1;
  const sectionCount = body.filter(block => block.type === "h2").length;
  return {
    ...post,
    excerpt: conciseExcerpt(post.excerpt || ""),
    body,
    ...(sectionCount >= 2 ? { formatVersion: "editorial-v1", editorialStatus: "archive-normalized" } : { editorialStatus: "needs-editorial-rewrite" }),
  };
});

const serialized = JSON.stringify(normalized, null, 2).replace(/[\u007f-\uffff]/g, character => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
writeFileSync(postsUrl, `${serialized}\n`);
console.log(`Normalized ${changed} legacy articles: ${headings} section headings and ${lists} lists restored.`);
