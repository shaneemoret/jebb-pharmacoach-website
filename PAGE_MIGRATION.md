# Previous-site page migration

This is the working register for moving the former Wix pages into the current Pharma Coach site. A page is not marked complete until its useful source content is preserved, unsupported claims are qualified or removed, the current ink/navy/gold brand is applied, the route builds, desktop and mobile are checked, and the canonical destination is recorded.

The September 23 Wix census found 19 general page URLs in addition to blog posts, store products, booking services, categories, and a pricing-plan URL. The transactional collections remain separate migration lanes; this register starts with the public marketing pages Shanee asked to bring over.

## Current batch

| Previous route | New route | Status | Notes |
| --- | --- | --- | --- |
| `/academy` and Fast Track | `/academy` | Built and locally verified | Program explanation is native; enrollment remains on the Med Rep College form. |
| `/pricing-plans/pharmaceutical-sales-interview-help` and Mastermind | `/mastermind-accelerator` | Built and locally verified | Old site path is retained as an alias; enrollment remains on Med Rep College. |
| `/pharmaceutical-sales-vip-mentorship` and VIP | `/vip-signature-access` | Built and locally verified | Old site path is retained as an alias; enrollment remains on Med Rep College. |
| FAQ / `/medical-sales-faq` | `/faq` | Built and locally verified | Old label and path resolve to the new branded FAQ. |
| `/free-medical-sales-training` | Med Rep College `/access` | Legacy form retained | New-site path redirects to the existing guide opt-in and delivery workflow. |
| `/apply-for-pharmaceutical-sales-career-coaching` | Med Rep College application | Legacy form retained | New-site path redirects to the existing intake workflow. |
| `/application` | Med Rep College application | Legacy form retained | Older alias redirects to the same existing intake workflow. |

## Already represented in the new site

| Previous route | Current representation | Status |
| --- | --- | --- |
| `/` | `/` | Existing branded homepage. |
| `/about` | `/about` | Existing branded About page. |
| `/pharmaceutical-sales-career-advice` | `/blog` plus article routes | Content hub exists; the previous route still needs a redirect decision. |

## Next marketing-page batch

| Previous route or label | Status | Migration note |
| --- | --- | --- |
| `/pharmaceutical-sales-success-stories` | Queued | Reuse only testimonials and metrics already approved or sourced in the current repository. |
| `/pharmaceutical-sales-strategy-call` | Queued | Preserve the booking intent and point to the current scheduling destination. |
| Interview Guides beyond the free opt-in | URL confirmation needed | Confirm the old canonical paths and current guide inventory before migrating more resources. |
| Pharmaceutical Sales Resume | URL confirmation needed | Recover the exact path before building the route. |
| Sales representatives audience page | URL confirmation needed | Rebuild for B2B, B2C, inside-sales, and retail candidates. |
| Clinical professionals audience page | URL confirmation needed | Rebuild for nurses and other clinical professionals. |
| Healthcare technicians audience page | URL confirmation needed | Rebuild for pharmacy, lab, and surgical technicians. |
| `/refferal` | Queued | Preserve the historical misspelled URL for backlinks; verify referral terms before publishing any bonus amount. |
| Store / interview-toolkit index | Separate commerce lane | Product pages, cart, checkout, taxes, fulfillment, and purchase history require transactional parity rather than a visual-only page migration. |

## Separate parity lanes

- Blog archive: the Wix census found 403 post URLs. The repository currently contains 22 local posts. Two use the newer sourced article structure, six legacy posts have recoverable article structure, and fourteen are flattened social-style imports that remain in the editorial rewrite queue. The shared template now provides article navigation, an author bio, a guide CTA, and related articles; structural normalization restores real headings and lists without inventing new claims.
- Store: 16 product URLs require product, checkout, payment, fulfillment, and customer-history decisions.
- Bookings: 12 booking-service URLs require schedule, payment, cancellation, notification, and calendar parity.
- Categories: 9 blog-category URLs require archive pages or redirects.
- Members, forms, Velo/custom code, analytics, and saved business history require explicit workflow replacement or a maintained external route.

No deployment or production publication is part of this batch.

## 2026-09-25 program and resource QA

Acceptance sentence: the new site owns the three program explanations, FAQ, and career-advice hub; application, free-guide opt-in, enrollment, payment, and delivery continue through the existing Med Rep College forms.

- Brand fidelity: compared the current program renders with the approved new-site desktop reference. Ink, navy, metallic gold, Manrope titles, Source Sans 3 body copy, square action treatment, restrained navigation, and split editorial hero remain aligned.
- Copy and hierarchy: each program has one clear audience/format signal, one outcome-focused headline, three verified offer facts, two explanation sections, and one legacy enrollment action. No new placement or earnings promise was added.
- Source boundary: Fast Track, Mastermind, and VIP details were checked against their current Med Rep College pages. Pricing and inclusions are labelled current-listed and paired with a verify-before-paying instruction.
- Form boundary: `/free-medical-sales-training`, `/apply-for-pharmaceutical-sales-career-coaching`, and `/application` generate direct legacy-form redirects rather than replacement forms. Browser verification reached the existing intake form without submitting data.
- Responsive behavior: IAB desktop and narrow mobile layouts were inspected for Fast Track, Mastermind, VIP, and FAQ. Navigation collapses to the mobile menu; the FAQ has no DOM overflow; the menu opens and exposes the legacy Apply destination. A separate headless-Chrome screenshot was used only to persist the desktop visual for `view_image`; its narrow macOS capture clamps CSS width and is not the mobile acceptance source.
- Functional routes: homepage program links open the native trailing-slash pages; legacy Mastermind/VIP aliases build; blog remains native; FAQ is linked from the homepage footer.
- Automated checks: Vite production build passed; Sites worker tests passed 4/4; migration and blog tests passed 18/18; `git diff --check` passed.

Fidelity ledger: hero palette and type matched; image treatment matched; internal program navigation was corrected to trailing-slash static routes after the first browser pass; FAQ received a dedicated open-list treatment instead of generic bullets; legacy forms were removed from the new-site sitemap and converted to redirects. No material visual mismatch remains in the verified implementation.
