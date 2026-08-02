# The Lost World (TLW)

Single-player browser game. Discover, restore, and nurture a forgotten ecosystem — one biome at a time.

**Status:** Design phase · **Stack:** React + Vite + TypeScript + Tailwind

## Quick Links

- [Game Design Plan](.hermes/plans/2026-08-02_191500-tlw-design-plan.md) — canonical design document
- [IrisClearwater/the-lost-world](https://github.com/IrisClearwater/the-lost-world)

## Concept

You are the Custodian — the last steward of a world that fell into dormancy. Starting from a single cleared patch of land, expand outward into procedurally-revealed biomes. Restore ruined ecosystems, cultivate native species, attract wildlife, and uncover ancient secrets.

## Tech

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Rendering:** HTML5 Canvas (world map) + CSS (UI)
- **Image generation:** Google Nano Banana (gemini-2.5-flash-image)
- **PWA:** Workbox, installable on iOS/Android

## Getting Started

```bash
pnpm install
pnpm dev
```

## Project Structure

```
web/          — React + Vite frontend
design/       — Design documents, reference images, prompt library
.hermes/      — Hermes agent plans and workflows
```
