import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import worker from '../public/_worker.js';

const output = new URL('../dist/client/', import.meta.url);
const read = name => readFileSync(new URL(name, output), 'utf8');
const urls = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

test('every sitemap URL has matching canonical, one analytics loader and valid schema', () => {
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.length >= 29);
  for (const url of urls) {
    assert.ok(url.startsWith('https://thepharmacoach.com/'));
    assert.ok(url.endsWith('/'), url);
    const pathname = new URL(url).pathname.slice(1);
    const html = read(pathname + 'index.html');
    assert.deepEqual([...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map(m => m[1]), [url]);
    assert.equal((html.match(/src="\/analytics.js"/g) || []).length, 1, url);
    assert.ok(html.includes(`property="og:url" content="${url}"`));
    assert.match(html, /property="og:image" content="https:\/\/thepharmacoach.com\//);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    assert.equal(blocks.length, 1);
    const schema = JSON.parse(blocks[0][1]);
    assert.equal(schema['@graph'][0]['@type'], 'Organization');
    assert.equal(schema['@graph'][0].sameAs.length, 3);
    const markdown = html.match(/rel="alternate" type="text\/markdown" href="([^"]+)"/)[1];
    assert.ok(existsSync(new URL(markdown.slice(1), output)), markdown);
  }
});

test('About and blog index have distinct initial metadata; 404 never presents homepage', () => {
  assert.match(read('about/index.html'), /<title>About The Pharma Coach/);
  assert.match(read('blog/index.html'), /<title>Pharmaceutical Sales Career Advice/);
  assert.match(read('404.html'), /name="robots" content="noindex"/);
  assert.doesNotMatch(read('404.html'), /id="root"|analytics.js/);
});

test('aliases and form handoffs have server-side permanent redirects', () => {
  const redirects = read('_redirects');
  for (const [from, to] of [
    ['fast-track-academy', '/academy/'], ['medical-sales-faq', '/faq/'],
    ['application', 'https://medrepcollege.com/apply-for-med-rep-college-now'],
    ['free-medical-sales-training', 'https://medrepcollege.com/access'],
    ['pharmaceutical-sales-strategy-call', 'https://medrepcollege.com/secure-your-spot'],
  ]) for (const suffix of ['', '/']) assert.ok(redirects.includes(`/${from}${suffix} ${to} 301`));
});

test('www canonical redirect preserves path and campaign parameters without fetching assets', async () => {
  const result = await worker.fetch(new Request('https://www.thepharmacoach.com/about/?utm_source=test'), {
    ASSETS: { fetch: () => { throw new Error('must redirect first'); } },
  });
  assert.equal(result.status, 301);
  assert.equal(result.headers.get('Location'), 'https://thepharmacoach.com/about/?utm_source=test');
});

test('Cloudflare preview HTML and Markdown are noindex', async () => {
  const env = { ASSETS: { fetch: async () => new Response('content') } };
  for (const accept of ['text/html', 'text/markdown']) {
    const result = await worker.fetch(new Request('https://preview.example.pages.dev/about/', { headers: { Accept: accept } }), env);
    assert.equal(result.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  }
  const result = await worker.fetch(new Request('https://thepharmacoach.com/about/'), env);
  assert.equal(result.headers.get('X-Robots-Tag'), null);
  assert.match(result.headers.get('Link'), /\/markdown\/about.md/);
});
