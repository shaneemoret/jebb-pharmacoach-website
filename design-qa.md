# Design QA

## Visual truth

- Source: `https://www.thepharmacoach.com/`, captured and inspected in the in-app browser at 1440 × 900 and 390 × 844.
- Implementation: local Vite build at `http://localhost:4173/`, inspected in the same browser and at the same viewport sizes.
- Identity preserved: near-black navigation, white editorial canvas, cobalt-blue emphasis, orange conversion actions, serif display typography, The Pharma Coach wordmark, and the source hero/coach imagery.

## Comparison result

- **Desktop — acceptable intentional difference.** The source hierarchy and message are retained, while the rebuilt hero uses a balanced two-column editorial composition. The primary CTA, diagnosis-call link, proof line, and hero artwork all appear above the fold at 1440 × 900.
- **Mobile — acceptable intentional correction.** The live Wix page renders as a 1,039 px-wide document inside a 390 px viewport and requires horizontal scrolling. The rebuild collapses to a true 390 px single column with a working menu, readable type, and zero horizontal overflow (`documentElement.scrollWidth === innerWidth === 390`).
- **Navigation — pass.** Desktop navigation and the mobile disclosure menu were exercised. The mobile button reports `aria-expanded="true"` while open.
- **Interaction — pass.** The FAQ accordion opens and updates `aria-expanded` correctly.
- **Content integrity — pass with migration gate.** Claims, prices, links, identity, and imagery are grounded in the current public site. Program prices instruct visitors to confirm current terms on the official enrollment pages. No invented customer testimonial was added.
- **Console — pass.** No browser console errors were observed during desktop, mobile, menu, or accordion checks.

## Remaining production gates

This repository is a dev-preview rebuild, not a claim of full Wix replacement parity. Before DNS cutover, migrate and validate the existing posts, products, services, forms, member/commerce workflows, analytics, redirects, legal pages, and transactional integrations listed in `CUTOVER.md`. DNS remains untouched.
