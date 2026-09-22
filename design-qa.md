# Design QA — split landing-page header

## Comparison target

- Source visual truth: `/Users/shanee/Desktop/Screenshot 2026-09-21 at 9.06.05 PM.png`
- Source pixels: 630 × 354, supplied raster reference; density metadata unavailable.
- Implementation: browser-native capture emitted from `http://127.0.0.1:5173/` in in-app Browser tab 22.
- Implementation viewport: 1280 × 720 CSS px at device scale factor 1; mobile follow-up at 390 × 844 CSS px.
- State: page top, desktop navigation closed; mobile navigation tested both closed and open.
- Normalization: the low-resolution reference and 1280 × 720 implementation were compared by shared 16:9 composition and region proportions rather than pixel-level typography matching. The supplied reference is a structural format target, not a request to copy its insurance copy, green palette, logos, or patient portrait.

## Full-view comparison evidence

The reference and the latest browser-rendered implementation were both opened during the same QA pass. The implementation reproduces the reference's defining structure: pale full-width hero field, concise copy and one CTA on the left, human image filling the right side, and a white credibility strip immediately below. It intentionally retains The Pharma Coach's black navigation, Public Sans typography, Method Blue action color, Signal Lime micro-accent, approved copy, and approved documentary nurse image.

## Focused-region evidence

- Header/hero boundary: the image begins flush at the top of the hero and lands exactly on the credibility strip, matching the reference's right-side portrait treatment.
- Copy block: eyebrow, promise, supporting line, and single CTA form one compact left column with ample breathing room.
- Credibility strip: five evenly divided cells replace the reference's third-party logos with truthful Pharma Coach proof and audience signals; no invented endorsement marks were added.
- Image quality: the existing owner-approved 1123 × 1401 nurse image remains sharp at desktop and mobile crops; no new synthetic portrait was generated.
- Focused regions were readable in the full browser capture, so separate enlarged crops were not required.

## Required fidelity surfaces

- Fonts and typography: Public Sans Variable remains consistent with the approved brand. The headline uses a compact 700-weight hierarchy and wraps cleanly at desktop and mobile sizes.
- Spacing and layout rhythm: desktop hero resolves to approximately 522 px beneath the 76 px navigation, with a 90 px proof strip; left and right regions balance at roughly 55/45. Mobile stacks copy, image, and strip without overflow.
- Colors and visual tokens: Pale Mist, Pharma Ink, Method Blue, Clinical White, Rule Line, and a small Signal Lime arrow follow `DESIGN.md`. The insurance reference's green was not copied.
- Image quality and asset fidelity: the approved documentary-style nurse image is used directly with `object-fit: cover`; it is not recreated with CSS or replaced by an artificial Jebb portrait.
- Copy and content: approved nurse/healthcare ICP headline and support copy remain intact. The credibility strip uses the existing `650+ clients placed` claim and audience categories already present on the page.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- [P3] The approved nurse image includes a real home-office environment rather than the reference's plain studio background. This is intentional: it preserves the already approved authentic-image direction and avoids generating another synthetic portrait.

## Comparison history

1. Initial implementation: hero expanded to approximately 724 px because the portrait's intrinsic ratio controlled the grid, pushing the credibility strip below the first desktop viewport. The headline also dominated the composition more than the reference.
2. Fix: constrained the hero to approximately 522 px, absolutely fitted the image within its grid region, reduced the display scale, and tightened copy spacing.
3. Post-fix evidence: at 1280 × 720 the complete hero and 90 px credibility strip are visible; `scrollWidth === clientWidth`; at 390 × 844 the copy and image stack cleanly with no horizontal overflow; mobile navigation opens with `aria-expanded="true"`; browser console reports zero errors.

## Implementation checklist

- [x] Split hero composition implemented.
- [x] Approved image and brand tokens preserved.
- [x] One primary CTA retained above the fold.
- [x] Credibility strip added without fabricated logos.
- [x] Desktop and mobile overflow checked.
- [x] Mobile navigation exercised.
- [x] Browser console checked.
- [x] Build and four Sites tests passed.

## Follow-up polish

- The P3 image-background difference can remain unless Shanee later supplies a real, non-synthetic cutout portrait with usage approval.

final result: passed
