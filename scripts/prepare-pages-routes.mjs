#!/usr/bin/env node
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "client");
const shell = path.join(dist, "index.html");
const posts = JSON.parse(readFileSync(path.join(root, "src", "posts.json"), "utf8"));
const about = JSON.parse(readFileSync(path.join(root, "src", "about.json"), "utf8"));

for (const route of ["about", "blog", ...posts.map(({ slug }) => `blog/${slug}`)]) {
  const routeDirectory = path.join(dist, ...route.split("/"));
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(shell, path.join(routeDirectory, "index.html"));
}

const markdownDirectory = path.join(dist, "markdown");
mkdirSync(path.join(markdownDirectory, "blog"), { recursive: true });

const sections = (heading, entries) => [
  `## ${heading}`,
  "",
  ...entries.flatMap((entry) => [
    `### ${entry.name}`,
    "",
    entry.body,
    ...(entry.price ? ["", `Price: ${entry.price}`] : []),
    ...(entry.url ? ["", `[Details](${entry.url})`] : []),
    "",
  ]),
];

const aboutMarkdown = [
  `# ${about.headline}`,
  "",
  about.valueProp,
  "",
  ...sections("What The Pharma Coach does", about.services),
  ...sections("What makes The Pharma Coach different", about.differentiators),
  "## Who uses The Pharma Coach",
  "",
  ...about.icp.map((item) => `- ${item}`),
  "",
  ...sections("How coaching works", about.how),
  "## Key facts",
  "",
  ...about.keyFacts.map(([name, value]) => `- **${name}:** ${value}`),
  "",
  "Results vary. Hiring, earnings, and placement examples are not guarantees.",
  "",
].join("\n");
writeFileSync(path.join(markdownDirectory, "about.md"), aboutMarkdown);

const blogIndex = [
  "# Articles to help you land a pharma sales rep job.",
  "",
  "Practical pieces from Jebb on resumes, interviews and the moves that get candidates in front of hiring managers.",
  "",
  ...posts.flatMap((post) => [
    `## [${post.title}](/blog/${post.slug})`,
    "",
    post.excerpt,
    "",
  ]),
].join("\n");
writeFileSync(path.join(markdownDirectory, "blog.md"), blogIndex);

function blockToMarkdown(block) {
  if (block.type === "p") return block.text;
  if (block.type === "h2") return `## ${block.text}`;
  if (block.type === "h3") return `### ${block.text}`;
  if (block.type === "list") return block.items.map((item) => `- ${item}`).join("\n");
  throw new Error(`Unsupported blog block type: ${block.type}`);
}

for (const post of posts) {
  if (!post.body) continue;
  const markdown = [
    `# ${post.title}`,
    "",
    post.excerpt,
    "",
    `By ${post.author} · ${post.published}`,
    "",
    ...post.body.flatMap((block) => [blockToMarkdown(block), ""]),
    ...(post.source?.url ? [`[Original source](${post.source.url})`, ""] : []),
  ].join("\n");
  writeFileSync(path.join(markdownDirectory, "blog", `${post.slug}.md`), markdown);
}

console.log(`Prepared ${posts.length + 2} Cloudflare Pages routes.`);
