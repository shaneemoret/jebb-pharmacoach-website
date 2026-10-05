#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(root, "src", "posts.json");
const manifestPath = path.join(root, "migration", "blog-media-manifest.json");
const posts = JSON.parse(readFileSync(postsPath, "utf8"));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const media = new Map(manifest.filter(item => item.kind === "image").map(item => [item.local, item]));
const headlineText = value => String(value || "").replace(/\s*—\s*/g, ": ").replace(/\s+/g, " ").trim();

let dimensionsAdded = 0;
let altTextAdded = 0;
let headlineMarksRemoved = 0;

for (const post of posts) {
  for (const field of ["title", "excerpt"]) {
    const next = headlineText(post[field]);
    if (next !== post[field]) {
      post[field] = next;
      headlineMarksRemoved += 1;
    }
  }
  for (const block of post.body || []) {
    if (block.type === "h2" || block.type === "h3") {
      const next = headlineText(block.text);
      if (next !== block.text) {
        block.text = next;
        headlineMarksRemoved += 1;
      }
    }
    if (block.type !== "image") continue;
    const item = media.get(block.url);
    if (item?.pixels && (!block.width || !block.height)) {
      [block.width, block.height] = item.pixels;
      dimensionsAdded += 1;
    }
    if (!String(block.text || "").trim()) {
      block.text = `Supporting image for ${post.title}`;
      altTextAdded += 1;
    }
  }
}

writeFileSync(postsPath, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Hardened ${posts.length} posts: ${dimensionsAdded} image dimensions, ${altTextAdded} alt labels, ${headlineMarksRemoved} headline punctuation fixes.`);
