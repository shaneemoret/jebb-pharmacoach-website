// Pulls Jebb's published posts from the live Wix blog feed into src/posts.json.
// Re-run it whenever he publishes: npm run import:posts
import { writeFileSync, readFileSync, existsSync } from "node:fs";

const FEED = "https://www.thepharmacoach.com/blog-feed.xml";
const OUT = new URL("../src/posts.json", import.meta.url);

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim() : "";
};
const pickAll = (xml, tag) =>
  [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "g"))]
    .map(m => m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim())
    .filter(Boolean);
const attr = (xml, tag, name) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*\\s${name}="([^"]*)"`));
  return m ? m[1] : "";
};
const decode = s => s
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&");
const clean = s => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const slugOf = link => (link.split("/post/")[1] || "").split("?")[0].replace(/\/$/, "");

const res = await fetch(FEED, { headers: { "user-agent": "pharmacoach-site-import" } });
if (!res.ok) throw new Error(`feed responded ${res.status}`);
const xml = await res.text();

const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
const imported = items.map(item => {
  const link = pick(item, "link");
  const published = pick(item, "pubDate");
  return {
    slug: slugOf(link),
    title: clean(pick(item, "title")),
    excerpt: clean(pick(item, "description")),
    author: clean(pick(item, "dc:creator")) || "The Pharma Coach",
    published: published ? new Date(published).toISOString().slice(0, 10) : "",
    tags: pickAll(item, "category").map(clean),
    image: attr(item, "enclosure", "url"),
    canonical: link,
    body: null,
  };
}).filter(post => post.slug && post.title);

// Anything written for this site keeps its local body; feed rows only refresh metadata.
const existing = existsSync(new URL(OUT)) ? JSON.parse(readFileSync(OUT, "utf8")) : [];
const localBodies = new Map(existing.filter(p => p.body).map(p => [p.slug, p]));
const merged = imported.map(post => localBodies.get(post.slug) ?? post);
for (const local of localBodies.values()) {
  if (!merged.some(p => p.slug === local.slug)) merged.push(local);
}
merged.sort((a, b) => (b.published || "").localeCompare(a.published || ""));

writeFileSync(OUT, JSON.stringify(merged, null, 2) + "\n");
console.log(`imported ${imported.length} posts, ${merged.filter(p => p.body).length} hosted locally -> src/posts.json`);
