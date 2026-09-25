# Real-Time Restaurant 🍽️

Multi-restaurant management system with role-based access control. FastAPI backend + Next.js frontend.

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Python 3.11+, FastAPI, Beanie (async MongoDB ODM), Motor |
| Frontend | Next.js 16, React 19, Tailwind v4, Aurora UI |
| Database | MongoDB 7 |
| Auth | JWT (python-jose), bcrypt |
| Dev Tools | Ruff, pytest, Docker |

## Architecture

Clean/Hexagonal architecture with three layers:

- **`domain/`** — Pure Python entities + repository protocols (zero framework imports)
- **`application/`** — Use cases with constructor-injected dependencies
- **`infrastructure/`** — FastAPI routers, Beanie documents, JWT concretions

## Prerequisites

- Docker Desktop
- Python 3.11+
- Node.js 20+

## Quick Start

```bash
# 1 — Start MongoDB
docker compose up -d

# 2 — Backend
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
.venv\Scripts\python.exe -m pip install "bcrypt>=4.0.0,<4.1.0" --force-reinstall --no-deps
uvicorn src.app.main:app --reload

# 3 — Frontend (separate terminal)
cd fronted
npm install
npm run dev
```

## API Documentation

With the backend running, open:

- **Swagger UI** → `http://localhost:8000/docs`
- **ReDoc** → `http://localhost:8000/redoc`
- **Mongo Express** → `http://localhost:8081`

## RBAC Matrix

| Role | Permissions |
|---|---|
| Admin | Everything |
| Manager | Own restaurant (create tables, update info) |
| Waitress | Own restaurant (update table status only) |

## API Endpoints

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

## Project Structure

```
├── backend/
│   ├── src/app/
│   │   ├── domain/              # Entities, enums, repository protocols
│   │   ├── application/         # 12 use cases, interfaces
│   │   └── infrastructure/      # Routers, Beanie documents, JWT, repos
│   ├── .env
│   └── pyproject.toml
├── fronted/                     # Next.js 16 App Router
├── docker-compose.yml           # MongoDB 7 + Mongo Express
├── AGENTS.md                    # Cross-cutting instructions
└── README.md
```

## Available Commands

| Command | Location | What |
|---|---|---|
| `uvicorn src.app.main:app --reload` | `backend/` | Start API with hot-reload |
| `ruff check src/` | `backend/` | Lint Python |
| `pytest` | `backend/` | Run tests |
| `docker compose up -d` | root | Start MongoDB |
| `npm run dev` | `fronted/` | Start frontend |
| `npm run lint` | `fronted/` | Lint frontend |
