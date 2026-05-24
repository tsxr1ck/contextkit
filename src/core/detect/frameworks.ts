import type { StackSignal } from "../../types/index.js";
import { fileExists, readJsonSafe } from "../../io/fs.js";
import { join } from "node:path";

/** Detect frameworks from config files and package.json dependencies. */
export function detectFrameworks(cwd: string): StackSignal[] {
  const scores: Record<string, { confidence: number; evidence: string[] }> = {};

  function add(name: string, confidence: number, evidence: string) {
    if (!scores[name]) scores[name] = { confidence: 0, evidence: [] };
    scores[name].confidence += confidence;
    scores[name].evidence.push(evidence);
  }

  // Config file detection
  const configChecks: [string, string, number][] = [
    ["next.config.js", "next", 5],
    ["next.config.ts", "next", 5],
    ["next.config.mjs", "next", 5],
    ["vite.config.ts", "vite", 5],
    ["vite.config.js", "vite", 5],
    ["astro.config.mjs", "astro", 5],
    ["astro.config.ts", "astro", 5],
    ["svelte.config.js", "svelte", 5],
    ["nuxt.config.ts", "nuxt", 5],
    ["angular.json", "angular", 5],
    ["remix.config.js", "remix", 5],
    ["remix.config.ts", "remix", 5],
    ["gatsby-config.js", "gatsby", 5],
    ["gatsby-config.ts", "gatsby", 5],
  ];

  for (const [file, framework, score] of configChecks) {
    if (fileExists(join(cwd, file))) add(framework, score, file);
  }

  // Dependency-based detection from package.json
  const pkg = readJsonSafe(join(cwd, "package.json"));
  if (pkg) {
    const deps = {
      ...((pkg.dependencies as Record<string, string>) || {}),
      ...((pkg.devDependencies as Record<string, string>) || {}),
    };

    const depChecks: [string, string, number][] = [
      ["next", "next", 4],
      ["react", "react", 3],
      ["react-dom", "react", 2],
      ["vue", "vue", 4],
      ["@angular/core", "angular", 4],
      ["svelte", "svelte", 3],
      ["express", "express", 4],
      ["fastify", "fastify", 4],
      ["hono", "hono", 4],
      ["elysia", "elysia", 4],
      ["@tanstack/react-query", "react", 1],
      ["tailwindcss", "tailwind", 3],
      ["prisma", "prisma", 4],
      ["@prisma/client", "prisma", 3],
      ["drizzle-orm", "drizzle", 4],
      ["mongoose", "mongoose", 4],
      ["jest", "jest", 2],
      ["vitest", "vitest", 3],
      ["playwright", "playwright", 3],
      ["@testing-library/react", "testing-library", 2],
    ];

    for (const [dep, framework, score] of depChecks) {
      if (deps[dep]) add(framework, score, `${dep} in dependencies`);
    }
  }

  // Structure-based hints
  if (fileExists(join(cwd, "app")) || fileExists(join(cwd, "src", "app"))) {
    // Could be Next.js app router
    if (scores["next"]) add("next-app-router", 3, "app/ directory with Next.js");
  }

  // Python frameworks
  const pyChecks: [string, string, number][] = [
    ["manage.py", "django", 4],
    ["app.py", "flask", 2],
  ];
  for (const [file, framework, score] of pyChecks) {
    if (fileExists(join(cwd, file))) add(framework, score, file);
  }

  const signals: StackSignal[] = [];
  for (const [name, data] of Object.entries(scores)) {
    signals.push({ name, confidence: data.confidence, evidence: data.evidence });
  }

  return signals.sort((a, b) => b.confidence - a.confidence);
}
