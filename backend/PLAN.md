# Plan: Real-Time Restaurant API (Backend)

> **Purpose:** Single source of truth for the FastAPI backend so any agent can pick this up and execute the next step.

> **Rules of engagement**
> - Work through phases in order.
> - Mark a phase `[x]` only after its verification command(s) pass.
> - Run `ruff check` and `pytest` after each phase.
> - **Do not commit** unless explicitly asked.

---

## Tech Stack

| Layer | Technology |
|---|---|---|
| Framework | FastAPI |
| ODM | Beanie (async MongoDB ODM on Motor) |
| Validation | Pydantic v2 |
| Auth | JWT (`python-jose` + `passlib[bcrypt]`) |
| DB (dev) | MongoDB 7 (via Docker Compose) |

---

## Architecture

```
src/app/
├── domain/            # Pure Python — no framework imports
│   ├── entities.py
│   └── repository_interfaces.py
├── application/       # Use cases — inject repos via constructor
│   ├── dto.py
│   ├── exceptions.py
│   ├── interfaces.py
│   └── use_cases/
└── infrastructure/    # FastAPI, Beanie, JWT concretions
    ├── auth/
    ├── database/
    ├── repositories/
    └── api/
        ├── dependencies.py
        ├── schemas.py
        └── routers/
```

---

## Phase 1 — Domain Entities & Repository Protocols

- `domain/entities.py` — `User`, `Restaurant`, `RestaurantTable` dataclasses + enums
- `domain/repository_interfaces.py` — `IUserRepository`, `IRestaurantRepository`, `ITableRepository` (sync Protocols)

**Files:** 2

---

## Phase 2 — Application Use Cases

- `application/interfaces.py` — `IPasswordHasher`, `ITokenService` protocols
- `application/dto.py` — 8 input/output dataclasses
- `application/exceptions.py` — 5 domain exceptions
- `application/use_cases/` — 12 use case classes (sync, one per file)

**Files:** 16

---

## Phase 3 — Infrastructure (FastAPI, SQLModel, JWT)

| # | File | Contents |
|---|---|---|
| 1 | `pyproject.toml` | Dependencies + `src` layout |
| 2 | `.env` | Default env vars |
| 3 | `src/app/config.py` | Pydantic Settings |
| 4 | `src/app/infrastructure/database/models.py` | SQLModel ORM tables |
| 5 | `src/app/infrastructure/database/connection.py` | Engine + `Session` factory |
| 6 | `src/app/infrastructure/repositories/sqlmodel_repositories.py` | 3 repo implementations |
| 7 | `src/app/infrastructure/auth/jwt.py` | `PasswordHasher` + `TokenService` |
| 8 | `src/app/infrastructure/api/schemas.py` | Pydantic v2 request/response models |
| 9 | `src/app/infrastructure/api/dependencies.py` | `get_db`, `get_current_user`, `require_role` |
| 10 | `src/app/infrastructure/api/routers/auth.py` | `POST /auth/register`, `POST /auth/login` |
| 11 | `src/app/infrastructure/api/routers/restaurants.py` | CRUD + assign-manager |
| 12 | `src/app/infrastructure/api/routers/tables.py` | CRUD + status update |
| 13 | `src/app/main.py` | App factory, exception handlers |

### RBAC Matrix

| Action | Admin | Manager | Waitress |
|---|---|---|---|
| Create restaurant | ✅ | ❌ | ❌ |
| Update any restaurant | ✅ | ✅ (own only) | ❌ |
| Delete restaurant | ✅ | ❌ | ❌ |
| Create table | ✅ | ✅ (own only) | ❌ |
| Update table status | ✅ | ✅ (own only) | ✅ (own only) |
| Assign manager | ✅ | ❌ | ❌ |
| Register user | ✅ | ❌ | ❌ |

---

## Migration: SQLite/SQLModel → MongoDB/Beanie

| Change | Before | After |
|---|---|---|
| ORM/ODM | `sqlmodel` | `beanie` + `motor` |
| DB driver | sync (pysqlite) | async (Motor) |
| DB type | SQLite file | MongoDB 7 document DB |
| Protocols | sync `def` | `async def` |
| Use cases | sync `def execute()` | `async def execute()` |
| API handlers | sync `def` | `async def` |
| Connection | `create_engine` + `Session` | `AsyncIOMotorClient` + `init_beanie()` |
| Models | `SQLModel, table=True` | `beanie.Document` |
| Indexes | `Field(index=True)` | `Indexed()` |
| Migrations | Alembic | Schema-less (none needed) |
| Container | — | `docker-compose.yml` with MongoDB + Mongo Express |
| Repos | `sqlmodel_repositories.py` | `beanie_repositories.py` |

## Phase 4 — Tests (Future)

- Unit tests for use cases (mock repos)
- Integration tests for API endpoints (test DB with mongomock)
- Run `pytest` after each phase

---

## Progress

| Phase | Status |
|---|---|
| 1. Domain Entities & Protocols | [x] |
| 2. Application Use Cases | [x] |
| 3. Infrastructure (FastAPI, Beanie, JWT) | [x] |
| M. Migration SQLite → MongoDB | [x] |
| 4. Tests | [ ] |
