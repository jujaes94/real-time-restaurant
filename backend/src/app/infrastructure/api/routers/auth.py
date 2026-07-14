from fastapi import APIRouter, Depends, status

from app.application.use_cases.authenticate_user import AuthenticateUserUseCase
from app.application.use_cases.register_user import RegisterUserUseCase
from app.infrastructure.api.schemas import (
    LoginRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
)
from app.infrastructure.auth.jwt import PasswordHasher, TokenService
from app.infrastructure.repositories.beanie_repositories import (
    BeanieUserRepository,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(dto: UserCreate) -> UserResponse:
    user_repo = BeanieUserRepository()
    hasher = PasswordHasher()
    use_case = RegisterUserUseCase(user_repo, hasher)
    user = await use_case.execute(dto)
    return UserResponse(**user.__dict__)


@router.post("/login", response_model=TokenResponse)
async def login(dto: LoginRequest) -> TokenResponse:
    user_repo = BeanieUserRepository()
    hasher = PasswordHasher()
    token_svc = TokenService()
    use_case = AuthenticateUserUseCase(user_repo, hasher, token_svc)
    result = await use_case.execute(dto)
    return TokenResponse(access_token=result.access_token)
