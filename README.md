# The Pharma Coach website rebuild

Responsive React/Vite reconstruction of the public The Pharma Coach homepage using its real visual identity, copy, imagery and outbound conversion routes.

## Local development

```bash
npm install
npm run dev
```

## Build and verification

```bash
npm run build
npm run test:sites
```

The `main` branch is the production source of truth. Every push to `main` is built, tested, and deployed to the existing `jebb-pharmacoach-website` Cloudflare Pages project by `.github/workflows/cloudflare-pages.yml`. Cloudflare deployments remain available as rollback targets, and each production deployment is tied to the Git commit recorded by GitHub Actions.

The separate `pages.yml` workflow publishes the GitHub Pages development preview. Commerce, bookings, forms, members, and other remaining parity lanes are tracked in `CUTOVER.md`.

## Blog publishing

Read and follow [`BLOG_STANDARD.md`](./BLOG_STANDARD.md) before adding, importing, rewriting, or changing a blog post. The automated blog-standard test is a release gate, not a substitute for editorial and responsive visual QA.
