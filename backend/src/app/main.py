from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.application.exceptions import (
    DomainError,
    DuplicateEmailError,
    InvalidCredentialsError,
    NotFoundError,
)
from app.infrastructure.api.routers import auth, restaurants, tables
from app.infrastructure.database.connection import close_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="Restaurant Management API",
    description="Multi-restaurant management system. Supports Admin, Manager, and Waitress roles with JWT authentication.",
    version="0.1.0",
    contact={"name": "Dev Team", "email": "dev@example.com"},
    lifespan=lifespan,
    swagger_ui_parameters={"tryItOutEnabled": True},
    openapi_tags=[
        {"name": "auth", "description": "User registration and login"},
        {"name": "restaurants", "description": "Restaurant CRUD and manager assignment"},
        {"name": "tables", "description": "Table management and status updates"},
    ],
)


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})


@app.exception_handler(DuplicateEmailError)
async def duplicate_email_handler(
    request: Request, exc: DuplicateEmailError
) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": str(exc)})


@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(
    request: Request, exc: InvalidCredentialsError
) -> JSONResponse:
    return JSONResponse(status_code=401, content={"detail": str(exc)})


@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
    return JSONResponse(status_code=400, content={"detail": str(exc)})


app.include_router(auth.router)
app.include_router(restaurants.router)
app.include_router(tables.router)
