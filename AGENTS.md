# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Owner-approved visual direction (2026-09-22)

Shanee selected the "Advance the work" homepage layout after reviewing Pfizer and Siemens Healthineers as credibility references. Use their restraint and hierarchy as inspiration, not their branding. Jebb's email, "colors for websites and emails + fonts" (2026-09-21), is the palette and type source of truth: inky black `#0B0F14`, white `#FFFFFF`, deep navy `#123B5D`, classic metallic gold `#D4AF37`; Manrope for H1/H2 and titles, Source Sans 3 for paragraphs and supporting copy. Do not revive the prior cobalt/lime palette or the generic nurse-at-home hero. Keep the site about The Pharma Coach and pharmaceutical-sales career transition, not a generic medtech corporation.

Shanee's current approved hero message is "Start your career in pharmaceutical sales." Keep the selected layout and this exact headline unless she requests another change.
