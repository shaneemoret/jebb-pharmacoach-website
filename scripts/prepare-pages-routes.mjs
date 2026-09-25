#!/usr/bin/env node
import { appendFileSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "client");
const shell = path.join(dist, "index.html");
const posts = JSON.parse(readFileSync(path.join(root, "src", "posts.json"), "utf8"));
const about = JSON.parse(readFileSync(path.join(root, "src", "about.json"), "utf8"));
const migratedPages = JSON.parse(readFileSync(path.join(root, "src", "migrated-pages.json"), "utf8"));
const legacyPosts = JSON.parse(readFileSync(path.join(root, "src", "legacy-posts.json"), "utf8"));
const legacyRedirects = [
  ["free-medical-sales-training", "https://medrepcollege.com/access", "Free interview guide"],
  ["apply-for-pharmaceutical-sales-career-coaching", "https://medrepcollege.com/apply-for-med-rep-college-now", "Coaching application"],
  ["application", "https://medrepcollege.com/apply-for-med-rep-college-now", "Coaching application"],
];

for (const route of ["about", "blog", ...posts.map(({ slug }) => `blog/${slug}`)]) {
  const routeDirectory = path.join(dist, ...route.split("/"));
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(shell, path.join(routeDirectory, "index.html"));
}

const escapeHtml = value => String(value).replace(/[&"<>]/g, char => ({
  "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;",
})[char]);

const appStylesheet = readFileSync(shell, "utf8").match(/<link rel="stylesheet"[^>]*>/)?.[0] || "";

function renderMigratedPage(page) {
  const canonical = `https://thepharmacoach.com/${page.slug}`;
  const facts = page.facts.map(([value, label]) => `<div class="migrated-fact"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("");
  const sections = (page.sections || []).map((section, index) => {
    const details = section.items
      ? `<ul class="migrated-list">${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : `<div class="migrated-steps">${section.steps.map(([number, title, text]) => `<article class="migrated-step"><b>${escapeHtml(number)}</b><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("")}</div>`;
    return `<section class="migrated-section${index % 2 ? " migrated-section--mist" : ""}">
      <h2>${escapeHtml(section.heading)}</h2>
      <div class="migrated-section__body"><p>${escapeHtml(section.body)}</p>${details}</div>
    </section>`;
  }).join("\n");
  const faqs = page.faqs
    ? `<section class="migrated-section migrated-section--faq"><h2>Questions, answered.</h2><div class="migrated-faq">${page.faqs.map(([question, answer]) => `<article><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join("")}</div></section>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.title)} | The Pharma Coach</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(page.title)} | The Pharma Coach" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    ${appStylesheet}
    <link rel="stylesheet" href="/migrated-pages.css" />
    <link rel="alternate" type="text/markdown" href="/markdown/${escapeHtml(page.slug)}.md" />
    <script src="/migrated-pages.js" defer></script>
  </head>
  <body>
    <header class="migration-header">
      <a class="migration-wordmark" href="/">THE PHARMA COACH</a>
      <nav class="migration-nav" aria-label="Primary navigation">
        <a href="/#programs">Programs</a><a href="/blog/">Career advice</a><a href="/faq/">FAQ</a><a href="/about/">About</a><a href="https://medrepcollege.com/apply-for-med-rep-college-now">Apply</a><a class="migration-nav__cta" href="https://medrepcollege.com/secure-your-spot">Schedule a call</a>
      </nav>
      <details class="migration-menu"><summary>Menu</summary><nav aria-label="Mobile navigation"><a href="/#programs">Programs</a><a href="/blog/">Career advice</a><a href="/faq/">FAQ</a><a href="/about/">About</a><a href="https://medrepcollege.com/apply-for-med-rep-college-now">Apply</a><a href="https://medrepcollege.com/secure-your-spot">Schedule a call</a></nav></details>
    </header>
    <main>
      <section class="migrated-hero">
        <div class="migrated-hero__copy"><p class="migrated-kicker">${escapeHtml(page.kicker)}</p><h1>${escapeHtml(page.headline)}</h1><p class="migrated-hero__lead">${escapeHtml(page.lead)}</p></div>
        <div class="migrated-hero__media"><img src="${escapeHtml(page.image)}" alt="${escapeHtml(page.imageAlt)}" /></div>
      </section>
      <section class="migrated-facts" aria-label="Page highlights">${facts}</section>
      ${sections}
      ${faqs}
      <section class="migrated-cta"><div><h2>${escapeHtml(page.cta.heading)}</h2><p>${escapeHtml(page.cta.body)}</p></div><a class="migrated-button" href="${escapeHtml(page.cta.url)}">${escapeHtml(page.cta.label)} →</a></section>
    </main>
    <footer class="migration-footer"><div><strong>THE PHARMA COACH</strong><p>Pharmaceutical-sales career coaching for professionals ready to reposition their experience and compete. Results vary; hiring, earnings, and placement examples are not guarantees.</p></div><nav aria-label="Footer"><a href="/academy/">Fast Track</a><a href="/mastermind-accelerator/">Mastermind</a><a href="/vip-signature-access/">VIP</a><a href="/faq/">FAQ</a><a href="/blog/">Career advice</a><a href="https://medrepcollege.com/access">Free guide</a><a href="https://medrepcollege.com/apply-for-med-rep-college-now">Apply</a><a href="mailto:Jebb@ThePharmaCoach.com">Contact</a></nav></footer>
  </body>
</html>`;
}

for (const page of migratedPages) {
  for (const route of [page.slug, ...(page.aliases || [])]) {
    const routeDirectory = path.join(dist, route);
    mkdirSync(routeDirectory, { recursive: true });
    writeFileSync(path.join(routeDirectory, "index.html"), renderMigratedPage(page));
  }
}

for (const [route, destination, label] of legacyRedirects) {
  const routeDirectory = path.join(dist, route);
  mkdirSync(routeDirectory, { recursive: true });
  writeFileSync(path.join(routeDirectory, "index.html"), `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(label)} | The Pharma Coach</title><link rel="canonical" href="${escapeHtml(destination)}" /><meta http-equiv="refresh" content="0; url=${escapeHtml(destination)}" /><script>window.location.replace(${JSON.stringify(destination)});</script></head><body><p>This form remains on Med Rep College. <a href="${escapeHtml(destination)}">Continue to ${escapeHtml(label)}</a>.</p></body></html>`);
}

// Each static article route needs its own initial HTML metadata for sharing and crawlers.
for (const post of posts) {
  const url = `https://thepharmacoach.com/blog/${post.slug}`;
  const title = `${post.title} | The Pharma Coach`;
  const image = new URL(post.image || "/assets/source/4310ea7e87b3a0cc-decoded.png", "https://thepharmacoach.com/").href;
  const articleShell = readFileSync(shell, "utf8")
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(post.excerpt)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(post.excerpt)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, '<meta property="og:type" content="article" />')
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${escapeHtml(image)}" />`)
    .replace(/<link rel="alternate"[^>]*>/, `<link rel="alternate" type="text/markdown" href="/markdown/blog/${post.slug}.md" />`)
    .replace("  </head>", `    <link rel="canonical" href="${escapeHtml(post.canonical || url)}" />\n    <meta property="og:url" content="${escapeHtml(url)}" />\n  </head>`);
  writeFileSync(path.join(dist, "blog", post.slug, "index.html"), articleShell);
}

const markdownDirectory = path.join(dist, "markdown");
mkdirSync(path.join(markdownDirectory, "blog"), { recursive: true });

for (const page of migratedPages) {
  const markdown = [
    `# ${page.title}`,
    "",
    page.lead,
    "",
    ...page.facts.map(([value, label]) => `- **${value}:** ${label}`),
    "",
    ...(page.sections || []).flatMap(section => [
      `## ${section.heading}`,
      "",
      section.body,
      "",
      ...(section.items || []).map(item => `- ${item}`),
      ...(section.steps || []).map(([number, title, text]) => `${number}. **${title}:** ${text}`),
      "",
    ]),
    ...(page.faqs || []).flatMap(([question, answer]) => [
      `## ${question}`,
      "",
      answer,
      "",
    ]),
    `## ${page.cta.heading}`,
    "",
    page.cta.body,
    "",
    `[${page.cta.label}](${page.cta.url})`,
    "",
    "Results vary. Hiring, earnings, and placement examples are not guarantees.",
    "",
  ].join("\n");
  writeFileSync(path.join(markdownDirectory, `${page.slug}.md`), markdown);
}

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
  if (block.type === "list") return block.items.map((item, index) => `${block.ordered ? `${index + 1}.` : "-"} ${item}`).join("\n");
  if (block.type === "quote") return `> ${block.text}`;
  if (block.type === "link") return `[${block.text}](${block.url})`;
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

// Old Wix article links (/post/<slug>) point at their new home. Cloudflare matches the exact
// path, so each link is listed with and without a trailing slash. 302 marks a temporary home
// that moves when the planned guide ships; 301 is the permanent destination.
const legacyRedirectLines = legacyPosts.flatMap(({ from, to, status }) => [`${from} ${to} ${status}`, `${from}/ ${to} ${status}`]);
appendFileSync(path.join(dist, "_redirects"), [
  "",
  "# Legacy Wix blog links, generated from src/legacy-posts.json",
  ...legacyRedirectLines,
  "/blog/categories/* /blog/ 301",
  "/blog/tags/* /blog/ 301",
  "/blog/hashtags/* /blog/ 301",
  "/blog/page/* /blog/ 301",
  "/post/* /blog/ 301",
  "",
].join("\n"));

console.log(`Prepared ${legacyPosts.length} legacy article redirects.`);
console.log(`Prepared ${posts.length + migratedPages.length + legacyRedirects.length + 2} Cloudflare Pages routes.`);
