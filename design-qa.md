# Design QA — The Pharma Coach brand refresh

Final result: passed

## Source and capture

- Source visual truth: `/Users/shanee/.codex/generated_images/01a0ca4c-3874-7e33-bf6b-6e85cbaeeaeb/exec-df940300-767b-4978-81aa-0a6aaae0bc32.png` (the selected "Advance the work" concept), 1586 × 992 pixels.
- Owner override: Jebb's 2026-09-21 email "colors for websites and emails + fonts" specifies `#0B0F14`, `#FFFFFF`, `#123B5D`, `#D4AF37`, Manrope headings, and Source Sans 3 body. These take precedence over the mockup's copper color and placeholder typography.
- Browser-rendered implementation: `design-qa-desktop.png`, 1587 × 885 pixels, captured at a 1587 × 960 CSS viewport with the in-app browser's visible capture area at 885 pixels high; device scale 1.
- Mobile implementation: `design-qa-mobile.png`, 390 × 844 pixels at a 390 × 844 CSS viewport; device scale 1.
- Full-view same-input comparison: `design-qa-comparison.png`, source and implementation side-by-side, both cropped to the same 885-pixel visible height. The source's 1-pixel width difference is immaterial.
- State: homepage at top, navigation closed. Primary interactions were also tested in the browser.

## Findings

No remaining P0, P1, or P2 visual or interaction findings. The implementation retains the selected white masthead, photographic full-width hero, oversized left-aligned headline, restrained CTA, and three-column capability band. The copy is intentionally adjusted to the site's verified audience: nurses and healthcare professionals transitioning into pharmaceutical sales, rather than the mockup's already-established reps and leaders.

The five required fidelity surfaces were checked:

- Typography: Manrope headings and Source Sans 3 body match Jebb's email. The large headline and compact navigation keep the intended hierarchy; mobile wrapping is readable and unclipped.
- Spacing and layout: after reducing hero height and widening the content grid, the masthead, hero, and capability strip align with the selected composition. Desktop, tablet (820px), and mobile (390px) were visually checked.
- Colors and tokens: effective site colors use Jebb's black, white, navy, and gold; muted surfaces are transparent navy on white. The mockup's copper was intentionally rejected.
- Image quality: new generated field-sales hero and HCP-conversation assets replace the nurse-at-home imagery in key sales sections. Image subjects, crop, sharpness, and text contrast were checked; generated characters and facility are fictional and documented in `public/assets/source/ASSET-SOURCES.md`.
- Copy and content: homepage target, program names, prices, and existing official conversion destinations were retained; hero and capability language now explain the visitor's concrete job.

Focused review of the hero in the comparison image found the head crop and the beginning of the three-column strip to be the main fidelity risks. Both were corrected. No separate focused crop was needed because these details are readable in the 3173-pixel-wide comparison image.

## Comparison history

1. First desktop capture: the 700px hero pushed the three-column strip below the visible fold; the oversized crop cut into the subject's head. The mobile menu also stayed open after an anchor click.
2. Fixes: reduced desktop hero to 610px, widened the desktop content frame, moved image crop to top, and closed the mobile menu on navigation.
3. Post-fix evidence: `design-qa-comparison.png`; mobile screenshot and browser interaction check confirm the menu closes and the `#programs` target appears. FAQ expansion was tested. Browser error/warning log was empty.

## Follow-up polish

- If Jebb has approved original field or coaching photography, replace the generated editorial images before a production launch. This is not a blocker for the local design preview.
- The 390px program-heading scale could be reduced slightly in a future copy-polish pass, but it remains legible and does not hide controls.

## Implementation checklist

- [x] Exact email palette and font families applied.
- [x] Selected "Advance the work" structure implemented without copying Pfizer or Siemens branding.
- [x] Desktop, tablet, and mobile visually reviewed.
- [x] Navigation, anchor CTA, and FAQ interaction tested.
- [x] Build and Sites worker tests passed.
