# Real-Time Restaurant

A real-time restaurant management dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Next.js 16.2.9 (App Router, Turbopack default)
- **UI:** React 19.2, Tailwind CSS v4
- **Language:** TypeScript 5
- **Linting:** ESLint 9 (flat config)
- **Fonts:** Geist & Geist Mono (`next/font/google`)

## Getting Started

### Prerequisites

- Node.js ≥ 20.9.0 (Node.js 18 is not supported by Next.js 16)
- npm

### Install & Run

```bash
npm install      # Install dependencies
npm run dev      # Start dev server → http://localhost:3000
```

### Available Scripts

| Command          | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `npm run dev`    | Start the dev server (Turbopack by default)                         |
| `npm run build`  | Production build (Turbopack by default; use `--webpack` to opt out) |
| `npm run start`  | Start the production server                                        |
| `npm run lint`   | Run ESLint (`next lint` is removed in v16 — this uses `eslint`)    |

## Project Structure

This project uses a feature-based architecture inside the App Router `app/` directory. Shared code (components, hooks, contexts, lib, services) lives in top-level folders under `app/`; feature-specific code lives under `app/features/`.

```
app/
├── assets/            # Fonts & images
├── components/        # Shared UI (ui/, forms/, layout/)
├── contexts/          # React context providers (Client Components)
├── dashboard/         # /dashboard route
├── features/          # Feature modules (auth, dashboard, settings)
├── hooks/             # Custom React hooks
├── lib/               # API client (lib/api) & utilities (lib/utils)
├── services/          # Domain services / data layer
├── styles/            # Global styles / style utilities
├── globals.css        # Tailwind import + CSS variables
├── layout.tsx         # Root layout
└── page.tsx           # Home page (/)
```

See [`AGENTS.md`](./AGENTS.md) for the full structure tree, architecture conventions, and Next.js 16 critical changes.

## Design Reference

`base-design.webp` at the repo root is the visual design mockup. Consult it before building UI to match the intended look and feel.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — Project guide, tech stack, conventions, Next.js 16 notes, and roadmap. This is the primary reference for AI agents (and developers) working on the project.
- Next.js 16 docs are bundled in `node_modules/next/dist/docs/` — read them before writing Next.js-specific code.

## Status

This project is in the scaffolding phase. See the "Current State & Roadmap" section in [`AGENTS.md`](./AGENTS.md) for what's done and what's next.
