# Real-Time Restaurant — Full-Stack

## Quick start

```bash
docker compose up -d                    # MongoDB 7 + Mongo Express (localhost:8081)
cd backend && pip install -e ".[dev]"   # Python deps
uvicorn src.app.main:app --reload       # Backend → http://localhost:8000
# in another terminal:
cd fronted && npm install && npm run dev  # Frontend → http://localhost:3000
```

## Monorepo layout

| Path | What |
|---|---|
| `fronted/` | Next.js 16 App Router + React 19 + Tailwind v4 |
| `backend/` | FastAPI + Beanie (async MongoDB ODM) |
| `docker-compose.yml` | MongoDB 7 + Mongo Express |
| `AGENTS.md` (this) | Cross-cutting instructions |
| `fronted/AGENTS.md` | Frontend-specific: Aurora UI, Next.js 16 quirks, etc. |
| `backend/PLAN.md` | Backend architecture, RBAC matrix, API endpoints |

**Quirk:** The frontend directory is named `fronted` (no `n`). That's the actual folder name — use it literally.

## Frontend ⚛️

Full details in `fronted/AGENTS.md`. Essentials:

- `npm run lint` runs ESLint directly (Next.js 16 removed `next lint`)
- `npm run build` uses Turbopack by default; add `--webpack` to opt out
- `params` and `searchParams` in page/layout props are now Promises — must `await`
- `middleware.ts` → renamed to `proxy.ts` in Next.js 16
- Path alias `@/*` → `./src/*`
- Aurora UI CSS classes defined in `src/app/globals.css` (dark/light via `ThemeContext` + `localStorage`)
- API client at `src/shared/lib/api/client.ts` — reads `NEXT_PUBLIC_API_BASE_URL` for server-side calls

## Backend 🐍

### Architecture (Clean / Hexagonal)

```
src/app/
├── domain/               # Pure Python dataclasses + Protocols. Zero framework imports.
├── application/          # Use cases — inject repos via constructor (async def execute)
│   ├── use_cases/        # 12 use cases, one per file
│   └── interfaces.py     # IPasswordHasher, ITokenService (sync — bcrypt/JWT are CPU-bound)
└── infrastructure/       # FastAPI routers, Beanie Documents, JWT concretions
```

### Key commands

```bash
ruff check src/           # Lint
pytest                    # Tests (not yet written — Phase 4)
```

### RBAC (enforced via `require_role` dependency)

| Role | Scope |
|---|---|
| Admin | Everything |
| Manager | Own restaurant only (create tables, update status) |
| Waitress | Own restaurant only (update table status) |

### Domain errors → HTTP status (handled in `main.py`)

| Exception | Status |
|---|---|
| `NotFoundError` | 404 |
| `DuplicateEmailError` | 409 |
| `InvalidCredentialsError` | 401 |
| `DomainError` (catch-all) | 400 |

### API endpoints

| Method | Path | Auth | Role |
|---|---|---|---|
| POST | `/auth/register` | No | Anyone |
| POST | `/auth/login` | No | Anyone |
| GET | `/restaurants` | Yes | Any |
| POST | `/restaurants` | Yes | Admin |
| PUT | `/restaurants/{id}` | Yes | Admin/Manager |
| DELETE | `/restaurants/{id}` | Yes | Admin |
| POST | `/restaurants/{id}/assign-manager` | Yes | Admin |
| GET | `/tables?restaurant_id=` | Yes | Any |
| POST | `/tables` | Yes | Admin/Manager |
| PATCH | `/tables/{id}/status` | Yes | All |
| DELETE | `/tables/{id}` | Yes | Admin/Manager |

### Gotchas

- **No DB migrations** — MongoDB is schema-less. Beanie creates indexes at startup via `init_beanie()`.
- **No per-request session** — Beanie is global. Remove any `get_db` dependency you find (leftover from SQLModel era).
- **Beanie Documents are Pydantic models** — use `model_dump()` / `model_validate()`, not `__dict__` for JSON.
- Python ≥ 3.11 required (uses `StrEnum`, `X | None` syntax).
- `.env` lives in `backend/` and is gitignored. Copy `.env` from a teammate or see `backend/PLAN.md`.
