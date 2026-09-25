#!/usr/bin/env node
// Writes dist/client/version.json so anyone can see which GitHub commit is live.
// A build made outside GitHub Actions is stamped "local"; the live drift check treats that as an alarm.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fromActions = process.env.GITHUB_ACTIONS === "true" && Boolean(process.env.GITHUB_SHA);
const stamp = {
  commit: fromActions ? process.env.GITHUB_SHA : "local",
  source: fromActions ? "github-actions" : "local",
  run: fromActions ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
  builtAt: new Date().toISOString(),
};
writeFileSync(path.join(root, "dist", "client", "version.json"), `${JSON.stringify(stamp, null, 2)}\n`);
