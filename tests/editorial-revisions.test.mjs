import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import posts from '../src/posts.json' with {type:'json'};
import originals from '../migration/editorial-originals.json' with {type:'json'};

test('three editorial revisions retain source provenance while satisfying article structure', () => {
  assert.equal(originals.length, 3);
  for (const original of originals) {
    const post = posts.find(p => p.slug === original.slug);
    assert.equal(post.published, original.published);
    assert.equal(post.author, original.author);
    assert.deepEqual(post.legacySource, original.legacySource);
    assert.equal(post.editorialRevision.authorReview, 'pending');
    assert.notDeepEqual(post.body, original.body);
    assert.ok(post.excerpt.length <= 220);
    let parent;
    let faqCount = 0;
    for (const block of post.body) {
      if (block.type === 'h2') parent = block.text;
      if (block.type === 'h3') {
        assert.ok(parent, 'subheading must have parent');
        if (parent === 'Frequently asked questions') faqCount++;
      }
      if (block.type === 'p') assert.ok(block.text.split(/\s+/).length >= 12, 'remove caption fragments');
    }
    assert.equal(faqCount, 3);
    assert.ok(post.body.some(b => b.runs?.some(r => r.url?.startsWith('https://www.bls.gov/'))));
    assert.ok(!JSON.stringify(post.body).match(/check the comments|click.{0,12}profile|650\+|90 days|<><>/i));
    const markdown = readFileSync(new URL(`../dist/client/markdown/blog/${post.slug}.md`, import.meta.url), 'utf8');
    assert.ok(markdown.includes('## Sources'));
    assert.ok(markdown.includes('AI-assisted editing'));
  }
});

test('source reimport preserves editorial revisions', () => {
  const importer = readFileSync(new URL('../scripts/restore-wix-archive.py', import.meta.url), 'utf8');
  assert.ok(importer.includes("and not by_slug[slug].get('editorialRevision')"));
});
