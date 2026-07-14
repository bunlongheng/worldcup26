# World Cup 26

FIFA World Cup 2026 hub - a live countdown to kickoff and the Final, host-nation highlights, and tournament facts. United 2026: the first 48-team World Cup, hosted across the United States, Canada, and Mexico.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

## Features

- Live countdown to kickoff (June 11, 2026), auto-switching to the Final (July 19, 2026) once the tournament is live
- Host-nation highlights for the United States, Canada, and Mexico
- Tournament facts strip: 48 teams, 104 matches, 16 host cities, 3 nations
- Floodlit-pitch aesthetic with mowed-grass stripes, grain overlay, and staggered reveal animations
- Hydration-safe client countdown, reduced-motion aware

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3009](http://localhost:3009).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server on port 3009 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3009 |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run lint` | Run Next.js lint |

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- Anton (display) + Outfit (body) via `next/font/google`

## Environment

No environment variables required.

## Deployment

Vercel (planned). Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.
