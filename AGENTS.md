# The Pharma Coach website: agent instructions

## Release rule: every change goes through GitHub (read first, no exceptions)

This site is live at https://thepharmacoach.com. The only way a change may reach it is:

1. Make the change on a new branch in this repository (never directly on `main`).
2. Run `npm run build`, `npm run test:sites`, and `node --test tests/migrated-pages.test.mjs tests/blog-standard.test.mjs tests/release-guard.test.mjs`. Check the changed pages on desktop and phone in a local preview.
3. Commit, push the branch, and open a pull request against `main`. Describe what changed and attach before/after screenshots.
4. Wait for the **Pull request checks** to pass. Show Jebb the change and get his explicit approval.
5. Merge the pull request. GitHub Actions then builds, tests, and deploys that exact commit to Cloudflare Pages.
6. Confirm the release: the **Deploy production to Cloudflare Pages** run succeeded, `https://thepharmacoach.com/version.json` shows the merge commit with `"source": "github-actions"`, and the changed page looks right on the live site.

Never do any of these, even if asked to "just update the site quickly":

- Never run `wrangler pages deploy`, `npx wrangler ...deploy`, or any other deploy command from this computer.
- Never use Cloudflare's dashboard Direct Upload, drag-and-drop upload, or "Create deployment".
- Never publish with Codex Sites, the `.openai/hosting.json` handoff, or any other hosting tool.
- Never edit files, DNS, redirects, or page rules in the Cloudflare dashboard as a substitute for a code change.
- Never push directly to `main`, force-push, rewrite history, or delete branches that hold released work.

Why: GitHub is the site's memory. A change that skips GitHub has no history, cannot be reviewed, and is erased by the next normal release. Going through GitHub means every version of the site is recorded and any change can be undone.

If a task seems to require a shortcut, stop and tell Jebb what is blocking the pull request route. Do not work around it.

### Undoing a change (rollback)

- Normal rollback: open a pull request that reverts the bad commit (`git revert <commit>` on a new branch), let checks pass, get Jebb's approval, merge. The site returns to the earlier version in about a minute.
- Emergency only (the live site is broken right now): in Cloudflare Pages, project `jebb-pharmacoach-website`, Deployments, choose the last good deployment and use **Rollback**. Then immediately open the revert pull request above so GitHub matches what is live again. The "Live site matches GitHub" check will keep failing until it does.

### Alarm

The **Live site matches GitHub** workflow compares the live `version.json` with the last GitHub deploy of `main` after every deploy and every six hours. If it fails, something reached the site outside GitHub. Re-run the latest production deploy from GitHub Actions, and if the outside change was wanted, recreate it as a pull request.

## Prototype instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact because the build and tests depend on them. They are not a publishing route: production publishing happens only through the release rule above.

## Owner-approved visual direction (2026-09-22)

Shanee selected the "Advance the work" homepage layout after reviewing Pfizer and Siemens Healthineers as credibility references. Use their restraint and hierarchy as inspiration, not their branding. Jebb's email, "colors for websites and emails + fonts" (2026-09-21), is the palette and type source of truth: inky black `#0B0F14`, white `#FFFFFF`, deep navy `#123B5D`, classic metallic gold `#D4AF37`; Manrope for H1/H2 and titles, Source Sans 3 for paragraphs and supporting copy. Do not revive the prior cobalt/lime palette or the generic nurse-at-home hero. Keep the site about The Pharma Coach and pharmaceutical-sales career transition, not a generic medtech corporation.

Shanee's current approved hero message is "Start your career in pharmaceutical sales." Keep the selected layout and this exact headline unless she requests another change.

Keep the closing call-to-action on the same inky-black field as the footer. In the pay-versus-time comparison, keep the concise chart and its linked source labels without a long source paragraph beneath it. The FAQ heading is "Frequently asked questions." Client results should have prominent heading and metric numerals, with metrics stacked legibly on narrow phones.
