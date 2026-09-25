import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("agent instructions put the GitHub-only release rule first", () => {
  const agents = read("AGENTS.md");
  const rule = agents.indexOf("## Release rule: every change goes through GitHub");
  assert.ok(rule !== -1, "AGENTS.md is missing the release rule");
  assert.ok(rule < agents.indexOf("## Prototype instructions"), "the release rule must come before any other instructions");
  for (const banned of ["wrangler pages deploy", "Direct Upload", "Codex Sites", "push directly to `main`"]) {
    assert.ok(agents.includes(banned), `release rule no longer forbids: ${banned}`);
  }
  assert.ok(agents.includes("git revert"), "release rule must explain rollback through a revert pull request");
  assert.ok(!/handed to Sites|Sites handoff/.test(agents), "AGENTS.md must not describe Sites as a publishing route");
});

test("every build stamps which commit it came from", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts.build, /stamp-release\.mjs/);
  assert.ok(existsSync(new URL("../scripts/stamp-release.mjs", import.meta.url)));
  assert.match(read("public/_headers"), /\/version\.json\s+Cache-Control: no-store/);
});

test("production deploys only from main through GitHub Actions, with checks and a drift alarm", () => {
  const deploy = read(".github/workflows/cloudflare-pages.yml");
  assert.match(deploy, /branches: \[main\]/);
  assert.match(deploy, /release-guard\.test\.mjs/);
  assert.match(read(".github/workflows/pr-checks.yml"), /pull_request:/);
  const drift = read(".github/workflows/live-drift-check.yml");
  assert.match(drift, /thepharmacoach\.com\/version\.json/);
  assert.match(drift, /schedule:/);
});
