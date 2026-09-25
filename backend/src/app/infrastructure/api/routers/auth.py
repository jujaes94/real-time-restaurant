from fastapi import APIRouter, Depends, status

from app.application.use_cases.authenticate_user import AuthenticateUserUseCase
from app.application.use_cases.register_admin import RegisterAdminUseCase
from app.application.use_cases.register_user import RegisterUserUseCase
from app.domain.entities import UserRole
from app.infrastructure.api.dependencies import get_current_user, require_role
from app.infrastructure.api.schemas import (
    LoginRequest,
    RegisterAdminCreate,
    TokenResponse,
    UserCreate,
    UserResponse,
)
from app.infrastructure.auth.jwt import PasswordHasher, TokenService
from app.infrastructure.database.models import UserDocument
from app.infrastructure.repositories.beanie_repositories import (
    BeanieUserRepository,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user (Admin/Manager)")
async def register(
    dto: UserCreate,
    current_user: UserDocument = Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> UserResponse:
    user_repo = BeanieUserRepository()
    hasher = PasswordHasher()
    use_case = RegisterUserUseCase(user_repo, hasher)
    user = await use_case.execute(dto, creator_role=current_user.role, creator_restaurant_id=current_user.restaurant_id)
    return UserResponse(**user.__dict__)


@router.post("/register-admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register an admin user (Admin only)")
async def register_admin(
    dto: RegisterAdminCreate,
    _=Depends(require_role(UserRole.ADMIN)),
) -> UserResponse:
    user_repo = BeanieUserRepository()
    hasher = PasswordHasher()
    use_case = RegisterAdminUseCase(user_repo, hasher)
    from app.application.dto import RegisterUserDTO
    use_case_dto = RegisterUserDTO(
        email=dto.email,
        username=dto.username,
        password=dto.password,
        full_name=dto.full_name,
        phone_number=dto.phone_number,
    )
    user = await use_case.execute(use_case_dto)
    return UserResponse(**user.__dict__)


@router.post("/login", response_model=TokenResponse, summary="Authenticate and get JWT token")
async def login(dto: LoginRequest) -> TokenResponse:
    user_repo = BeanieUserRepository()
    hasher = PasswordHasher()
    token_svc = TokenService()
    use_case = AuthenticateUserUseCase(user_repo, hasher, token_svc)
    result = await use_case.execute(dto)
    return TokenResponse(access_token=result.access_token)
