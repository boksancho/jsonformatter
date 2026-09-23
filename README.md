# JSON Formatter

A fast, client-side JSON formatter built with Vue 3, TypeScript, Vite, and Tailwind CSS v4. Everything runs in the browser — no backend, no data leaves your machine.

## Features

- **Format** — beautify JSON with configurable indentation (2 or 4 spaces)
- **Validate** — live validation as you type, with error message and line/column
- **Minify** — compress JSON to a single line
- **Tree view** — collapsible, syntax-highlighted exploration of the JSON structure
- **Copy / Download** — copy output to clipboard or download as a `.json` file
- **Sample data** — load an example JSON document with one click

## Tech stack

- [Vue 3](https://vuejs.org/) (`<script setup>` SFCs)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the dev server                         |
| `npm run build`   | Type-check (vue-tsc) and build for production |
| `npm run preview` | Preview the production build locally         |
