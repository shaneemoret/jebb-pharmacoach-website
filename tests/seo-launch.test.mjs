import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist', 'client');
const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const htmlFor = url => readFileSync(path.join(dist, decodeURIComponent(new URL(url).pathname), 'index.html'), 'utf8');
const attribute = (html, pattern) => html.match(pattern)?.[1];

test('every canonical route has crawlable, unique first-response metadata and content', () => {
  assert.equal(urls.length, 414);
  const titles = new Set();
  const descriptions = new Set();
  for (const url of urls) {
    const html = htmlFor(url);
    const title = attribute(html, /<title>(.*?)<\/title>/);
    const description = attribute(html, /<meta name="description" content="([^"]+)"/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${url} must have one H1`);
    assert.doesNotMatch(html, /<div id="root"><\/div>/, `${url} must include useful initial HTML`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
    assert.ok(title && description, `${url} needs title and description`);
    assert.doesNotMatch(`${title} ${description}`, /—/, `${url} has an em dash in search copy`);
    assert.ok(!titles.has(title), `duplicate title: ${title}`);
    assert.ok(!descriptions.has(description), `duplicate description: ${description}`);
    titles.add(title);
    descriptions.add(description);
    assert.match(html, /<meta property="og:image" content="https:\/\/thepharmacoach\.com\/assets\/source\/social-share-default\.jpg">/);
    assert.match(html, /<meta property="og:image:width" content="1200">/);
    assert.match(html, /<meta property="og:image:height" content="630">/);
    for (const image of html.match(/<img\b[^>]*>/g) || []) {
      assert.match(image, /\balt="[^"]*"/, `${url} image needs alt text`);
      assert.match(image, /\bwidth="[^"]+"/, `${url} image needs width`);
      assert.match(image, /\bheight="[^"]+"/, `${url} image needs height`);
    }
    for (const script of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) assert.doesNotThrow(() => JSON.parse(script[1]), `${url} has invalid JSON-LD`);
    if (new URL(url).pathname !== '/') assert.match(html, /"@type":"BreadcrumbList"/, `${url} needs breadcrumb schema`);
  }
});

test('blog index links every article and article payload is route-specific', () => {
  const index = htmlFor('https://thepharmacoach.com/blog/');
  const articleUrls = urls.filter(url => new URL(url).pathname.startsWith('/blog/') && new URL(url).pathname !== '/blog/');
  for (const url of articleUrls) assert.match(index, new RegExp(`href="${new URL(url).pathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  for (const url of articleUrls.slice(0, 12)) assert.match(htmlFor(url), /id="blog-post-data"/);
});

test('robots, redirects, share image, and JavaScript bundle meet launch constraints', () => {
  const robots = readFileSync(path.join(dist, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/thepharmacoach\.com\/sitemap\.xml/i);
  const redirects = readFileSync(path.join(dist, '_redirects'), 'utf8');
  assert.doesNotMatch(redirects, /wix(?:site|static)?\.com/i);
  const share = path.join(dist, 'assets', 'source', 'social-share-default.jpg');
  assert.ok(statSync(share).size > 10_000);
  const blogChunk = readdirSync(path.join(dist, 'assets')).find(file => /^Blog-.*\.js$/.test(file));
  assert.ok(blogChunk, 'Blog chunk missing');
  assert.ok(statSync(path.join(dist, 'assets', blogChunk)).size < 100_000, 'Blog JavaScript should not contain the entire article archive');
});
