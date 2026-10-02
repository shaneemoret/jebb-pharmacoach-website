# Wix archive restoration — October 2, 2026

Acceptance: account for every old Wix post URL, preserve recoverable original content and existing new-site articles, and restore a direct article destination for each old link.

Source: the live Wix origin at 185.230.63.107, using HTTPS with the original www.thepharmacoach.com hostname. The current blog-posts sitemap lists 404 unique URLs. The historical redirect map contains the same set, with two résumé paths percent-encoded. Normalize these before deduplication.

Result: 384 original articles restored, 20 source URLs already represented by existing articles, zero missing source bodies. The existing 22 site articles are unchanged, giving 406 articles in total. `wix-archive-manifest.json` records each source URL, outcome, SHA-256 and source-text word count. Article records retain their original publication date and source provenance. The importer verifies the full source text word sequence before accepting a body.

Two pages (advice-for-aspiring-medical-sales-reps and medical-sales-hiring-manager-thoughts-during-an-interview) initially returned HTTP 200 with a Wix widget error. Re-fetching with a migration-recheck query recovered both. Never substitute a metadata description for missing article text.

Run `python scripts/restore-wix-archive.py SNAPSHOT_DIRECTORY` with beautifulsoup4 installed. The snapshot directory must contain `wix-fetch-manifest.json` and `wix-html/<sha256-of-source-url>.html`. The raw public HTML snapshot is held in the task work directory, not committed because it includes hundreds of megabytes of Wix runtime markup. Re-running updates only prior restored records with `legacySource`; editorially authored existing records are preserved.

All 846 former Wix media references now resolve to 826 assets stored in this repository under `public/assets/blog-archive/`: 798 images and 28 videos. Cloudflare serves them as part of the normal GitHub build. `blog-media-manifest.json` preserves original source URLs for audit only, source and output SHA-256 values, file sizes and dimensions/durations. The website does not import that manifest or request Wix. Ten doubled-hostname video links were repaired during recovery. Images were converted to WebP at quality 88, retaining the full frame and aspect ratio, with width limited to 1600 pixels. Videos were remuxed for fast-start playback; one oversized video was encoded to fit the Cloudflare Pages per-file limit. Original downloaded files remain in the task media cache. Every shipped file is under 25 MiB. Video blocks now play inline from same-origin MP4s. Re-importing an archive snapshot reapplies the local-media mapping. Recovering old copy does not certify it against the current article standard: restored posts carry `needs-editorial-rewrite`, not `standard-v1`. This owner-requested complete restoration supersedes the earlier selective migration proposal for this branch only; reconcile open editorial PRs before merging them.

Publication requires approval and the GitHub production workflow in AGENTS.md. This branch alone does not change the live website.

## Editorial corrections, October 2

Technical restoration is not editorial acceptance. Three sampled articles now have `editorialStatus: editorial-draft`, coherent paragraphs, descriptive sections, FAQs, sources and truthful titles. Original slugs, dates and source attribution are retained. `migration/editorial-originals.json` preserves their complete recovered records; `legacySource.textVerified` describes those original recoveries, not the rewritten text. `editorialRevision` identifies the adaptation and pending author review. The importer cannot overwrite those revisions.

## Complete archive editorial pass, October 2

The remaining queue grew to 392 posts after the branch was reconciled with current `main`. Every queued post now has an answer-first opening, descriptive H2 sections, a practical checklist, exactly three reader FAQs, a linked government source, a concise excerpt, and the shared verified author treatment. Social-platform calls to action, decorative fragments, raw URLs, unsupported numerical promises, earnings promises, and detected unverifiable outcome stories are excluded from article prose.

The full pre-edit records are preserved in `migration/editorial-originals-all.json`. `migration/editorial-review-manifest.json` records one row per revised slug, including original and revised word counts, topic classification, source, correction flags, and structural checks. All revisions remain `editorial-draft` with `authorReview: pending`; a structured editorial pass is not a claim that Jebb personally approved the adaptation. The importer preserves any record with `editorialRevision`, so a later source recovery cannot silently overwrite this work.

This pass deliberately avoids inventing personal experiences, client results, placement counts, salaries, or hiring timelines. When an archived caption was too thin or promotional to republish safely, the new article retains the topic and stable URL while using a practical, employer-specific framework. The complete original remains available for audit rather than controlling the public reading experience.
