import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import posts from '../src/posts.json' with { type: 'json' };
import manifest from '../migration/wix-archive-manifest.json' with { type: 'json' };
import redirects from '../src/legacy-posts.json' with { type: 'json' };
const dist = fileURLToPath(new URL('../dist/client/', import.meta.url));
const consolidated = new Set(redirects.filter(entry => entry.decision === 'seo-consolidated').map(entry => entry.from.slice('/post/'.length)));

test('all 404 unique source URLs have recovered bodies or preserved existing articles', () => {
  assert.equal(manifest.length, 404);
  assert.equal(new Set(manifest.map(row => row.slug)).size, 404);
  assert.equal(manifest.filter(row => row.status === 'restored-original').length, 384);
  assert.equal(manifest.filter(row => row.status === 'existing-post-preserved').length, 20);
  assert.ok(!manifest.some(row => row.status === 'needs-source-recovery'));
});

test('every recovered source resolves to its own article, metadata, Markdown and sitemap entry', () => {
  const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  for (const row of manifest) {
    const post = posts.find(post => post.slug === row.slug);
    const redirect = redirects.find(entry => entry.from === '/post/' + row.slug);
    if (consolidated.has(row.slug)) {
      assert.equal(post, undefined, row.slug);
      assert.ok(redirect.to.startsWith('/blog/'), row.slug);
      assert.ok(!sitemap.includes(`/blog/${row.slug}/`), row.slug);
      continue;
    }
    assert.ok(post?.body?.length, row.slug);
    assert.equal(redirect?.to, '/blog/' + row.slug + '/');
    const html = readFileSync(path.join(dist, 'blog', decodeURIComponent(row.slug), 'index.html'), 'utf8');
    assert.ok(html.includes(`href="https://thepharmacoach.com/blog/${row.slug}/"`), row.slug);
    assert.ok(sitemap.includes(`/blog/${row.slug}/`), row.slug);
    const markdown = readFileSync(path.join(dist, 'markdown/blog', decodeURIComponent(row.slug) + '.md'), 'utf8');
    assert.ok(markdown.includes(post.title), row.slug);
    if (row.status === 'restored-original') {
      assert.equal(post.legacySource.textVerified, true);
      assert.equal(post.legacySource.sha256, row.sourceSha256);
      if (post.editorialRevision) {
        const originalFile = post.editorialRevision.originalFile || 'migration/editorial-originals.json';
        const originals = JSON.parse(readFileSync(new URL(`../${originalFile}`, import.meta.url), 'utf8'));
        const original = originals.find(item => item.slug === post.slug);
        assert.equal(original?.legacySource.sha256, row.sourceSha256);
        assert.equal(original.editorialStatus, 'needs-editorial-rewrite');
        assert.equal(post.editorialStatus, 'editorial-draft');
        assert.equal(post.formatVersion, 'editorial-v1');
      } else {
        assert.equal(post.editorialStatus, 'needs-editorial-rewrite');
        assert.equal(post.formatVersion, undefined);
      }
      assert.match(post.published, /^\d{4}-\d{2}-\d{2}$/);
      for (const block of post.body) {
        for (const run of [...(block.runs || []), ...(block.richItems || []).flat()]) {
          if (run.url) assert.match(run.url, /^(https?:|mailto:|tel:|\/assets\/blog-archive\/)/);
        }
        if (block.type === 'image' || block.type === 'video') assert.match(block.url, /^\/assets\/blog-archive\//);
      }
    }
  }
});
