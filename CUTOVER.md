# Production cutover gate

This development build must not receive production DNS until Jebb explicitly approves the cutover and the following Wix dependencies are mapped and tested.

## Required parity checks

- 397 published posts and their canonical URLs
- 16 products, checkout routes and commerce history
- 12 bookable services and calendar behavior
- forms, submissions, notifications and consent records
- member accounts, protected content and password/reset flows
- Velo/custom-code functions and integrations
- full redirect map, analytics pixels and search-console ownership
- Cloudflare preview QA on desktop and mobile
- rollback plan retaining the Wix origin until post-cutover verification passes

## Agent-readiness surfaces included in this preview

- `robots.txt` with Content-Signal directives
- `llms.txt`
- `/index.md` Markdown alternative
- HTTP `Link` header declaration through `_headers`

DNS-AID belongs at the DNS layer and remains pending Jebb's Cloudflare-zone setup. It cannot be proven from this source repository alone.
