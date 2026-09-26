# Post-Wix measurement and search recovery

This branch restores the existing GA4 measurement ID `G-CE0YM7TDCH`; it does not create a new property or deploy itself.

## Changes

- One shared analytics loader across all 29 published routes, with explicit opt-in, withdrawal, sanitized page URLs, and production-host gating. No production GA hits from local, Pages, or GitHub previews.
- Page views and named booking/application/guide/program click events. These are **intent events**, not completed leads, bookings, or purchases. The external destination needs its own verified instrumentation before end-to-end conversion tracking can be claimed.
- Generated sitemap, slash-consistent apex canonical URLs, per-page metadata, social cards, and initial HTML Organization/Person/BlogPosting/FAQ data where applicable.
- Exact permanent redirects for known page aliases and form handoffs; preserve all 404 existing article mappings and their intentionally temporary guide destinations.
- Worker-level www-to-apex redirect preserving path/query, noindex on Pages previews, useful non-indexable 404 page, corrected Markdown alternate response headers.
- Existing social profiles retained and linked consistently; no social accounts changed.

## Verification

Production build and all 38 Node tests pass locally. Coverage includes consent gating, duplicate initialization, preview isolation, withdrawal, page URL sanitization, honest click naming, all sitemap/canonical/schema pairs, aliases, hostname redirects, preview noindex, migration pages, all legacy article mappings, and release guard.

Browser QA: homepage desktop (1280 × 720), phone (390 × 844), consent dismissal, About page, and generated Academy page. Baseline images are the unchanged `dbfedea` main build; after images are the proposed build. No contacts, bookings, or payments were submitted.

### Before / after desktop

![Before desktop](before-desktop.jpg)

![After desktop](after-desktop.jpg)

### Before / after phone

![Before phone](before-phone.jpg)

![After phone](after-phone.jpg)

## Required after approval and normal GitHub deployment

1. Verify production Actions success and matching merge commit in `/version.json` (`source: github-actions`).
2. Check apex/www, aliases, existing article redirects, robots, sitemap, canonical/OG/schema and actual 404 status over HTTPS.
3. Inspect actual GA network requests after opt-in: correct measurement ID, one page view per load, expected CTA events; confirm delivery in Realtime/DebugView without submitting a real booking/payment.
4. Submit the canonical apex sitemap to the existing Search Console property if it is not already present. Reinspect current pages; historical indexing counts will lag deployment.
5. Complete external form/booking/purchase instrumentation under its own authorized deployment route; verify successful outcomes and transaction deduplication before marking key events.

## References

- [Google consent setup](https://developers.google.com/tag-platform/security/guides/consent)
- [Google tag API](https://developers.google.com/tag-platform/gtagjs/reference)
- [Cloudflare Pages redirect behavior](https://developers.cloudflare.com/pages/configuration/redirects/)

Do not merge before the PR checks pass and Jebb approves this change, per repository `AGENTS.md`.
