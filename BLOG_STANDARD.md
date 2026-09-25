# The Pharma Coach blog standard

This is the repository standard for every current and future article. Read it before importing, adding, rewriting, or changing a blog post. A post is not complete because its URL renders.

## Required brand presentation

- Every post must use the shared `BlogVisual` component on the blog index and as the article's featured visual. Do not render an imported Wix/social image directly as the finished thumbnail.
- The visual must stay within the approved identity: inky black `#0B0F14`, white `#FFFFFF`, deep navy `#123B5D`, metallic gold `#D4AF37`, Manrope headings, and Source Sans 3 body copy.
- Use `jebb-headshot-owner.png` in the byline and author bio, with the crop anchored to the top so his forehead is visible. Do not place a portrait inside the branded thumbnail and do not substitute the half-body About portrait in small circles.
- Every article must show a real featured visual between its header/byline and reading layout. Missing legacy media is never represented as a blank box.
- Keep branded thumbnails editorial and simple: category plus title only. Do not add a decorative topline, "field notes" label, author footer, or face.
- Treat old orange artwork and social-platform graphics as source material only. Redesign them into this system instead of mixing brands.

## Required article anatomy

Every standards-compliant article needs:

1. An answer-first opening that tells the reader what they will learn.
2. A specific title, concise excerpt, author, publication date, category tag, and stable slug.
3. Descriptive `h2` sections; use `h3` only beneath an `h2`.
4. Practical steps, examples, or decisions the reader can apply.
5. Sources for factual, regulatory, compensation, credential, or time-sensitive claims.
6. Jebb's linked author name, author bio, a relevant verified CTA, and related articles.
7. A table of contents whenever the article contains section headings.

Do not invent facts to bulk up an archived post. Preserve recoverable legacy copy, but keep source-thin social imports marked `needs-editorial-rewrite` until they receive an evidence-backed rewrite. A branded template does not make an incomplete caption a finished article.

## Implementation rules

- Add content in `src/posts.json`; keep the reusable layout in `src/Blog.jsx` and `src/article.css`.
- Keep the shared media treatment deterministic. One component update must propagate to every existing and future post.
- Decorative thumbnail text must remain hidden from assistive technology when the linked title already names the article.
- A bulleted or numbered list must contain at least three meaningful items. Render one- or two-item fragments as prose; never leave an orphan bullet.
- Combine choppy one-line and one-word fragments into complete paragraphs unless the short line has a deliberate editorial purpose.
- Article `h2` section headings must be visually larger than body copy, and the byline name must link to `/about`.
- Do not restore the sidebar interview-guide promotion unless the owner requests and verifies that destination again.
- Do not introduce a new face, synthetic likeness, unsupported testimonial, or unverified outcome claim.
- When the post count changes, update the complete-library assertion in `tests/blog-standard.test.mjs` only after reviewing every route.

## Release gate

Before a blog change is ready for review:

- Run `npm run build`.
- Run `npm run test:sites`.
- Run `node --test tests/blog-standard.test.mjs`.
- Perform Desktop and mobile visual QA on the blog index, the changed article, a long-title article, and an article without legacy media.
- Confirm no horizontal overflow, clipped title, broken image, console error, or inaccessible heading order.
- Keep local, committed, pushed, deployed, and live-verified states separate. Publishing or deployment still requires the owner's explicit authorization.
