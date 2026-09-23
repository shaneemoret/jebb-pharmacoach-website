# Production cutover gate

This development build must not receive production DNS until the Wix dependencies below are mapped and tested and Jebb explicitly approves a written cutover packet. A preview deployment, a pending Cloudflare zone, or a registrar sign-in is preparation, not approval. An emailed status report or a prompt is not approval either.

## Required parity checks

- every published post and its canonical URL (403 published on Wix at the 2026-09-23 census, 397 at the 2026-09-21 inventory; this repository hosts 21)
- 16 products, checkout routes and commerce history
- 12 bookable services and calendar behavior
- forms, submissions, notifications and consent records
- member accounts, protected content and password/reset flows
- Velo/custom-code functions and integrations
- full redirect map, analytics pixels and search-console ownership
- Cloudflare preview QA on desktop and mobile, including the HTTP status of deep routes such as `/about/` and `/blog/*` (crawlers must not receive 404)
- rollback plan retaining the Wix origin until post-cutover verification passes

## Cutover packet

Jebb approves the cutover only from a packet that states, with receipts:

- the source commit and the tested Cloudflare preview deployment URL and ID
- the parity result for every check above, with each unresolved gap named as a blocker
- the before/after DNS record table, the Cloudflare-assigned nameservers for `thepharmacoach.com`, and DNSSEC/DS handling at GoDaddy
- the propagation plan, the rollback procedure, and the expected effects on Wix, mail, bookings, payments and analytics

Until that approval is recorded, no agent changes nameservers, DNS records, the production domain, or anything on `medrepcollege.com`.

## Agent-readiness surfaces included in this preview

- `robots.txt` with Content-Signal directives
- `llms.txt`
- `/index.md` Markdown alternative
- HTTP `Link` header declaration through `_headers`

DNS-AID belongs at the DNS layer and remains pending Jebb's Cloudflare-zone setup. It cannot be proven from this source repository alone.

## Status

- 2026-09-23: live `thepharmacoach.com` still delegates to `ns14.wixdns.net` and `ns15.wixdns.net`, with no DS records at the registrar. Jebb's Cloudflare account holds a pending zone and a Direct Upload Pages preview at `https://jebb-pharmacoach-website.pages.dev/` built from commit `185ddd4`. On that preview, `/about/` and `/blog/` return HTTP 404 with the SPA shell. Nothing in production has changed.
