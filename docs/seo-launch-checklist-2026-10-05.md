# Jebb SEO launch checklist

Audit date: October 5, 2026  
Scope: The Pharma Coach GitHub and Cloudflare site, including all 414 canonical sitemap URLs  
Release state: implemented and locally verified on `codex/jebb-seo-hardening-oct05`; awaiting review, merge, Cloudflare deployment, and public verification

## Applied and verified in the build

1. **Server-rendered content:** all 414 canonical pages now include useful headings and body content in the first HTML response. The 410 empty SPA shells are removed.
2. **Complete sitemap:** 414 canonical pages are generated from the published route inventory.
3. **robots.txt:** crawling is open and the sitemap is declared.
4. **Indexability:** canonical pages have no `noindex`; GitHub preview builds remain `noindex`.
5. **Self canonicals:** every sitemap page points its canonical tag to itself.
6. **Real 404:** the custom page remains `noindex`, returns through the Cloudflare 404 route, and links to the blog, programs, and About page.
7. **One-hop legacy routing:** all 404 recovered Wix article paths have exact redirect rules before the catch-all. No redirect target points to Wix.
8. **Internal links:** the generated build has zero broken internal links and zero internal links that point at a redirect source.
9. **No orphan articles:** the blog index contains a crawlable link to every article.
10. **Breadcrumbs:** visible breadcrumbs and `BreadcrumbList` schema are present on every non-home canonical page.
11. **Unique titles:** all 414 title tags are unique.
12. **Unique descriptions:** all 414 meta descriptions are unique.
13. **One H1:** every canonical page has exactly one H1.
14. **FAQ schema:** added only when the questions and answers are visible on the page.
15. **Image alternative text:** all article images now have descriptive alt text; decorative images keep empty alt text.
16. **Author information:** every article continues to show its archived byline and a source-faithful author disclosure.
17. **Headline cleanup:** em dashes were removed from titles, descriptions, and article H2/H3 headings without bulk-rewriting paragraph text.
18. **Share image:** every canonical page uses a dedicated 1200 by 630 JPG with Open Graph dimensions and alt text.
19. **WebP delivery:** served site images were moved from PNG to WebP where appropriate; the JPG share image is intentional for social compatibility.
20. **Image dimensions:** all 471 archived article images received verified width and height attributes from the media manifest. Site and program images also have dimensions.
21. **Mobile layout:** the reviewed article fits a 390-pixel viewport with no horizontal overflow.
22. **Smaller article JavaScript:** the blog bundle fell from about 2.8 MB to 12 KB by embedding only the current article or index summaries in each route.
23. **Analytics:** the existing consent-gated Google Analytics loader remains on every canonical page and its test suite passes.
24. **Security transport:** HSTS is added to Cloudflare response headers.

## Requires account ownership or post-deploy evidence

- **Google Search Console:** verify the production property and submit `https://thepharmacoach.com/sitemap.xml` after deployment.
- **Bing Webmaster Tools:** import the verified Search Console property after Google verification.
- **Mobile performance under two seconds:** run PageSpeed against production after Cloudflare deploy. Local structural fixes are complete, but a production timing claim requires the deployed site.
- **Google Business Profile:** use only if Jebb meets customers in person or serves an eligible local service area. An online-only coaching business is not eligible.
- **Backlinks:** Jebb must request links from legitimate client case studies, podcasts, shows, and his owned social profiles.
- **Directories and reviews:** Jebb should choose two or three relevant listings where his actual buyers look; these require owner accounts and truthful profile information.

## Verification evidence

- Production build completed successfully.
- SEO suite: 3 of 3 passing across all 414 routes.
- Migration suite: 23 of 23 passing.
- Sites worker suite: 4 of 4 passing.
- Blog standard and redirect suite: 9 of 9 passing.
- Desktop QA: 1280-pixel viewport, no horizontal overflow.
- Phone QA: 390-pixel viewport, no horizontal overflow.
- Three representative articles each rendered one H1, six H2s, route-specific data, author disclosure, FAQs, and sources.
