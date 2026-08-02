# The Lost World (TLW)

Single-player browser game. Discover, restore, and nurture a forgotten ecosystem — one biome at a time.

**Status:** Demo playable · **Stack:** React 19 + Vite + TypeScript + Tailwind v4

## Quick Links

- [Game Design Plan](.hermes/plans/2026-08-02_191500-tlw-design-plan.md) — canonical design document
- [Play Demo](https://iris.tail604626.ts.net:5199) — Tailscale-accessible dev server
- [IrisClearwater/the-lost-world](https://github.com/IrisClearwater/the-lost-world)

## Concept

You are the Custodian — the last steward of a world that fell into dormancy. Starting from a single cleared patch of land, expand outward into procedurally-revealed biomes. Restore ruined ecosystems, cultivate native species, attract wildlife, and uncover ancient secrets.

## Demo (v0.1)

Current playable features:
- Hex-grid world map with fog-of-war discovery
- 4 zones in Verdant Valley biome (overgrown clearing, bramble thicket, elder oak grove, wildflower meadow)
- Zone states: dormant → overgrown → restored → thriving
- Clear brambles to restore zones (costs energy, earns rewards)
- Energy system with passive regen indicator
- Player level, XP, coins, gems, materials, harmony
- Mobile-first responsive layout (tri-panel desktop, stacked mobile)
- PWA — installable, works offline for core loop

## Tech

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 (design tokens: pine chassis, parchment cards, gold accents)
- **State:** Zustand
- **Rendering:** HTML5 Canvas (hex grid) + CSS (UI)
- **Image generation:** Google Imagen 4 (pending API integration — placeholder art in demo)
- **PWA:** Workbox, installable on iOS/Android

## Getting Started

```bash
cd web
pnpm install
pnpm dev
```

Access at `http://127.0.0.1:5199` or `https://iris.tail604626.ts.net:5199` (Tailscale).

## Project Structure

```
web/          — React + Vite frontend (demo)
design/       — Design documents, reference images, prompt library
.hermes/      — Hermes agent plans and workflows
```
