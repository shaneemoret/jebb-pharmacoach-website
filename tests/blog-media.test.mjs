import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import posts from '../src/posts.json' with { type: 'json' };
import media from '../migration/blog-media-manifest.json' with { type: 'json' };
const root = fileURLToPath(new URL('../', import.meta.url));

test('blog runtime content has no Wix hosting dependency', () => {
  assert.doesNotMatch(JSON.stringify(posts), /https?:\/\/[^\s"/]*(?:wixstatic|parastorage|wixsite|wix)\.com/i);
  for (const post of posts) {
    for (const block of post.body) {
      if (['image', 'video'].includes(block.type)) {
        assert.ok(block.url.startsWith('/assets/blog-archive/'), post.slug);
        assert.ok(media.some(row => row.local === block.url), block.url);
      }
    }
    const markdown = readFileSync(path.join(root, 'dist/client/markdown/blog', decodeURIComponent(post.slug) + '.md'), 'utf8');
    assert.doesNotMatch(markdown, /https?:\/\/[^\s"/]*(?:wixstatic|parastorage|wixsite|wix)\.com/i);
  }
});

test('every former Wix media reference has a verified Git-tracked-ready build asset', () => {
  assert.equal(media.length, 846);
  assert.equal(new Set(media.map(row => row.original)).size, 846);
  const unique = new Map(media.map(row => [row.local, row]));
  for (const [local, row] of unique) {
    const source = path.join(root, 'public', local);
    const built = path.join(root, 'dist/client', local);
    assert.ok(row.bytes > 0 && row.bytes < 25 * 1024 * 1024, local);
    assert.equal(statSync(source).size, row.bytes);
    for (const file of [source, built]) {
      assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), row.sha256, file);
    }
  }
});

test('original video embeds play from this site instead of linking to Wix', () => {
  const videos = posts.flatMap(post => post.body.filter(block => block.type === 'video'));
  assert.equal(videos.length, 27);
  for (const video of videos) assert.match(video.url, /^\/assets\/blog-archive\/[a-f0-9]+\.mp4$/);
});
