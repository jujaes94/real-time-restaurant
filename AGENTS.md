<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Real-Time Restaurant

A real-time restaurant management dashboard built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Framework    | Next.js 16.2.9 (App Router, Turbopack default) |
| UI           | React 19.2, Tailwind CSS v4                    |
| Language     | TypeScript 5                                   |
| Linting      | ESLint 9 (flat config, `eslint-config-next`)   |
| Package Mgr  | npm                                            |
| Fonts        | Geist & Geist Mono (via `next/font/google`)     |

## Development Commands

```bash
npm run dev     # Start dev server (Turbopack by default) → http://localhost:3000
npm run build   # Production build (Turbopack by default, use --webpack to opt out)
npm run start   # Start production server
npm run lint    # Run ESLint (note: `next lint` is REMOVED in v16 — use eslint directly)
```

## Project Structure

```
real-time-restuarant/
├── app/
│   ├── assets/
│   │   ├── fonts/           # Custom font files
│   │   └── images/          # Project images
│   ├── components/
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components (header, nav, footer)
│   │   └── ui/              # Reusable UI primitives (buttons, cards, etc.)
│   ├── contexts/            # React context providers (Client Components)
│   ├── dashboard/           # /dashboard route
│   │   └── page.tsx
│   ├── features/
│   │   ├── auth/            # Authentication feature
│   │   ├── dashboard/       # Dashboard feature (stat cards, widgets)
│   │   │   └── Dashboard.tsx
│   │   └── settings/        # Settings feature
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── api/             # API client / fetch helpers
│   │   └── utils/           # Utility functions
│   ├── services/            # Domain services (data layer)
│   ├── styles/              # Global styles / style utilities
│   ├── globals.css          # Tailwind import + CSS variables
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (/)
│   └── favicon.ico
├── public/                  # Static assets
├── base-design.webp         # Visual design mockup / reference
├── next.config.ts           # Next.js config
├── tsconfig.json            # TypeScript config (path alias @/* → ./*)
├── eslint.config.mjs        # ESLint flat config
├── postcss.config.mjs       # PostCSS (Tailwind v4 plugin)
└── package.json
```

## Architecture Conventions

### App Router Rules
- **Folders define routes.** A route becomes public only when a `page.tsx` (or `route.ts`) file is added.
- **Server Components by default.** Layouts and pages are Server Components. Add `"use client"` only when you need state, event handlers, lifecycle hooks, or browser APIs.
- **Context providers** must be Client Components — create a provider wrapper and import it into the root layout.
- **Colocation is safe** inside `app/` — non-`page`/`route` files are never routable.

### Path Alias
- `@/*` maps to project root (`./*`) — configured in `tsconfig.json`. Use `@/app/...` for imports within the app directory.

### Code Style
- **No comments** unless explicitly requested.
- Follow existing patterns; check neighboring files before writing new code.
- Do not commit secrets or `.env*` files.

## Next.js 16 Critical Changes (affect this project)

> Full docs: `node_modules/next/dist/docs/`. Key upgrade guide: `01-app/02-guides/upgrading/version-16.md`.

### Async Request APIs (Breaking)
- `params` and `searchParams` in pages/layouts are now **Promises** — must `await` them.
- `cookies()`, `headers()`, `draftMode()` from `next/headers` must be `await`ed.
- Type helpers available globally after `next dev`/`next build`/`next typegen`: `PageProps<'/route'>`, `LayoutProps<'/route'>`, `RouteContext`.

```tsx
// Correct v16 pattern
export default async function Page({ params }: PageProps<'/dashboard'>) {
  const { id } = await params;
  // ...
}
```

### Middleware → Proxy (Breaking)
- `middleware.ts` is **deprecated** — renamed to `proxy.ts`. Use `export function proxy(...)` (or default export).
- Proxy defaults to the **Node.js runtime** (edge runtime not supported in proxy).
- Codemod: `npx @next/codemod@canary middleware-to-proxy .`

### Turbopack by Default
- `next dev` and `next build` use **Turbopack** by default (no flags needed).
- If you add a custom `webpack` config in `next.config.ts`, `next build` will fail unless you run `next build --webpack` or migrate.
- `experimental.turbopack` → top-level `turbopack` option in `next.config.ts`.

### `next lint` Removed
- The `next lint` command is **gone**. This project already uses `eslint` directly (`npm run lint`).
- `next build` no longer runs linting.

### Image Changes (Breaking)
- `next/image` `priority` prop → **deprecated**, use `preload` instead.
- Default `qualities` is `[75]` only; `minimumCacheTTL` default is now `4 hours`; `imageSizes` no longer includes `16`.
- `images.domains` → deprecated, use `images.remotePatterns`.

### Cache Components (New, optional)
- Enable with `cacheComponents: true` in `next.config.ts` — unifies PPR, `use cache` directive, and `dynamicIO`.
- When enabled: route segment configs `dynamic`, `dynamicParams`, `revalidate`, `fetchCache` are **removed** — use `use cache` and `cacheLife` instead.
- `cacheLife` and `cacheTag` are now stable (remove `unstable_` prefix).

### Scroll Behavior
- Next.js no longer overrides `scroll-behavior` during SPA transitions. Add `data-scroll-behavior="smooth"` to `<html>` to restore instant scroll-to-top.

### Other Removals
- AMP support fully removed.
- `serverRuntimeConfig` / `publicRuntimeConfig` removed — use `process.env` directly.
- Parallel route slots now **require** `default.js` files (build fails without them).
- Node.js 18 no longer supported (minimum 20.9.0).

## Current State & Roadmap

### Done
- [x] Next.js 16 project scaffolded (App Router, Tailwind v4, TypeScript)
- [x] Folder structure created for features-based architecture
- [x] `/dashboard` route stub with restaurant table
- [x] `app/features/dashboard/Dashboard.tsx` stat-card stub
- [x] `base-design.webp` mockup added as visual reference
- [x] `package.json` `name` corrected to `real-time-restaurant` (folder name unchanged)
- [x] Home page (`/`) landing screen with link to `/dashboard`
- [x] `app/layout.tsx` metadata updated; providers (`AuthProvider`, `ToastProvider`) wrapped at root
- [x] UI primitives scaffolded: `Button`, `Card`, `Input`, `Table` (`@/app/components/ui`)
- [x] Layout primitives: `Sidebar`, `Topbar`, `DashboardShell` (`@/app/components/layout`)
- [x] Data service: `app/services/restaurants.ts` with typed `Restaurant` + `getRestaurants()`
- [x] API client base: `app/lib/api/client.ts` (`apiFetch`, `ApiError`)
- [x] Utils: `cn`, `formatCurrency`, `formatNumber` (`@/app/lib/utils`)
- [x] Custom hook: `useRestaurants` (`@/app/hooks`)
- [x] Contexts: `AuthContext`, `ToastContext` wired in root layout
- [x] Login route at `/login` backed by `app/features/auth/LoginPage.tsx`
- [x] Settings route at `/settings` backed by `app/features/settings/SettingsPage.tsx`
- [x] Default boilerplate SVGs removed from `public/`

### TODO (next steps)
- [ ] Real authentication backend (currently a stub `signIn(email)` in `AuthContext`)
- [ ] Real REST/real-time API wiring (websocket/SSE for live orders, stock, staff)
- [ ] Implement menu / orders / staff screens (sidebar links currently non-functional)
- [ ] Review `base-design.webp` once the user describes palette/layout and align UI

## Errors & Fix Log

### 2026-07-13 — Step 8 lint failures

**Errors found during `npm run lint`:**

1. `app/components/ui/Card.tsx:3` — `error: An interface declaring no members is equivalent to its supertype` (`@typescript-eslint/no-empty-object-type`). The file declared `interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}` purely to reuse `HTMLAttributes` props; the lint rule rejects empty interfaces.
2. `app/hooks/useRestaurants.ts:14–20` — `error: Calling setState synchronously within an effect can trigger cascading renders` (`react-hooks/set-state-in-effect`). The hook reset `data` to `initialData` inside `useEffect`, which is the exact anti-pattern the rule targets.
3. `app/hooks/useRestaurants.ts:14–16` — `warning: 'setIsLoading' / 'setError' assigned a value but never used` (`@typescript-eslint/no-unused-vars`). The hook kept setters for a future fetch/local state machine that never materialized.

**Fixes applied (verified — see verification cluster below):**

1. **Card.tsx:** replaced the empty `interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}` with a direct type alias `type CardProps = React.HTMLAttributes<HTMLDivElement>`. Same prop shape, lint-clean.
2. **useRestaurants.ts:** dropped the `useEffect` entirely (no longer needed — consumer passes `initialData` straight into a `useState` initializer so the hook reflects it from the first render). Removed unused `setIsLoading` and `setError`; the loading/error fields are kept in the returned shape only as future-proofing stub values (`useState(false)` / `useState(null)`) until a real fetch is wired.
3. **Re-ran `npm run lint`, `npx tsc --noEmit`, `npm run build`** — all green.

## Documentation

- [`README.md`](./README.md) — public-facing overview and dev commands.
- [`PLAN.md`](./PLAN.md) — step-by-step cleanup plan with checklist (read this first if you're continuing an in-progress session).
- Next.js 16 docs are bundled in `node_modules/next/dist/docs/` — read them before writing Next.js-specific code.

## Design Reference

`base-design.webp` at the project root is the visual design mockup. Consult it before building UI to match the intended look and feel.

> **Status:** Mockup summary (palette, layout, key components) is **deferred** until the user provides a description. The current scaffolding uses neutral grays + white; colors will be revised after the mockup is described.
