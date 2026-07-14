# World Cup 2026

An interactive FIFA World Cup 2026 companion. All 48 qualified nations with real
flags, the 12-group draw, a live knockout bracket with real results, and an
interactive 2D world map plus a draggable 3D globe - every view drilling into a
per-country detail with full match history.

**Live:** https://worldcup26-bheng.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Flags** - all 48 nations, tap a flag for the full country card.
- **Groups** - the 12 groups (A to L) in the official FIFA 26 brand colors; tap a
  team for its match center, tap a host for its stadium list.
- **Bracket** - the real knockout results (Round of 16 to the semi-finals) with
  flags, scores, and winners highlighted.
- **Map (2D)** and **Globe (3D)** - one d3-geo component, group-colored countries,
  tap a country or a group letter to light it up.
- **Country detail** - flag, group, confederation, quick facts (capital,
  continent, population, area, currency), and every match with real scores.
- Official theme audio (tap to play) and responsive down to phone.

## Tech stack

Next.js 16 (App Router) - React 19 - TypeScript - Tailwind CSS v4 - d3-geo -
deployed on Vercel. Flag images from [flagcdn](https://flagcdn.com); world map
geometry from Natural Earth (110m). No backend, no database: a static prerender.

## Develop

```bash
npm install
npm run dev        # http://localhost:3009
```

## Scripts

| Script | Does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3009 |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm test` | Data-integrity tests (node:test) |

## Data notes

The tournament data (draw, group results, knockout scores) lives in
`app/data/teams.ts`. The draw is cross-checked against the official FIFA and
Wikipedia sources. Semi-final and final results are pending and render as "vs"
until played.

## License

[MIT](LICENSE)
