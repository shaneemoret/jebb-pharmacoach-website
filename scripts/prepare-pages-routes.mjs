#!/usr/bin/env node
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "client");
const shell = path.join(dist, "index.html");
const posts = JSON.parse(readFileSync(path.join(root, "src", "posts.json"), "utf8"));

for (const route of ["about", "blog", ...posts.map(({ slug }) => `blog/${slug}`)]) {
  const routeDirectory = path.join(dist, ...route.split("/"));
  mkdirSync(routeDirectory, { recursive: true });
  copyFileSync(shell, path.join(routeDirectory, "index.html"));
}

console.log(`Prepared ${posts.length + 2} Cloudflare Pages routes.`);
