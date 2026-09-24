# One Util

A collection of fast, client-side developer utilities built with Vue 3, TypeScript, Vite, and Tailwind CSS v4. Everything runs in the browser — no backend, no data leaves your machine.

## Tools

**Formatters** — JSON (with tree view), XML, JavaScript (Prettier), JS minifier (Terser), CSS/SCSS/Less

**Encoders** — Base64, URL, HTML entities, JavaScript string escape

**Converters** — YAML ↔ JSON, CSV ↔ JSON, JSON → TypeScript interfaces, Unix timestamp, Markdown preview, text case converter

**Generators** — UUID (v4/v7), NanoID, passwords, lorem ipsum, SHA hashes, QR codes

**Inspectors** — JWT decoder, regex tester, text diff

## Architecture

- `src/tools/registry.ts` — every tool is one entry here; it drives the router, sidebar and home grid
- `src/tools/simple/` — declarative `SimpleTool` defs (`run(input, mode) => output`); rendered by `SimpleToolView.vue`
- `src/tools/views/` — custom SFCs for tools that need richer UIs
- `src/components/` — shared UI (`TwoPane`, `TextArea`, `ErrorBox`, `SimpleToolView`)
- Routes are lazy-loaded per tool; heavy deps (Prettier, Terser) are dynamic imports inside `run()` so they stay out of the initial bundle

Adding a tool: define a `SimpleTool` in `src/tools/simple/` (or a view in `src/tools/views/`), then add one entry to `tools` in `registry.ts`.

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>` SFCs) + [vue-router](https://router.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server                          |
| `npm run build`   | Type-check (vue-tsc) and build for production |
| `npm run preview` | Preview the production build locally          |
