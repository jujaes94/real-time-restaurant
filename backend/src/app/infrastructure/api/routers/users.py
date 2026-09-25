from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.application.dto import UpdateOwnProfileDTO, UpdateUserDTO
from app.application.use_cases.get_user import GetUserUseCase
from app.application.use_cases.list_users_by_restaurant import ListUsersByRestaurantUseCase
from app.application.use_cases.update_own_profile import UpdateOwnProfileUseCase
from app.application.use_cases.update_user import UpdateUserUseCase
from app.domain.entities import UserRole
from app.infrastructure.api.dependencies import get_current_user, require_role
from app.infrastructure.api.schemas import (
    OwnProfileUpdate,
    UserResponse,
    UserUpdate,
)
from app.infrastructure.database.models import UserDocument
from app.infrastructure.repositories.beanie_repositories import (
    BeanieUserRepository,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse, summary="Get own profile")
async def get_me(
    current_user: UserDocument = Depends(get_current_user),
) -> UserResponse:
    return UserResponse(**current_user.__dict__)


@router.patch("/me", response_model=UserResponse, summary="Update own profile")
async def update_me(
    dto: OwnProfileUpdate,
    current_user: UserDocument = Depends(get_current_user),
) -> UserResponse:
    use_case_dto = UpdateOwnProfileDTO(
        user_id=current_user.id,
        **dto.model_dump(exclude_unset=True),
    )
    repo = BeanieUserRepository()
    use_case = UpdateOwnProfileUseCase(repo)
    user = await use_case.execute(use_case_dto)
    return UserResponse(**user.__dict__)


@router.get("/", response_model=list[UserResponse], summary="List users (Admin/Manager)")
async def list_users(
    restaurant_id: UUID | None = Query(None),
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> list[UserResponse]:
    repo = BeanieUserRepository()
    if restaurant_id:
        use_case = ListUsersByRestaurantUseCase(repo)
        users = await use_case.execute(restaurant_id)
    else:
        users = await repo.list_all()
    return [UserResponse(**u.__dict__) for u in users]


@router.get("/{user_id}", response_model=UserResponse, summary="Get user by ID (Admin/Manager)")
async def get_user(
    user_id: UUID,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> UserResponse:
    repo = BeanieUserRepository()
    use_case = GetUserUseCase(repo)
    user = await use_case.execute(user_id)
    return UserResponse(**user.__dict__)


@router.patch("/{user_id}", response_model=UserResponse, summary="Update user (Admin/Manager)")
async def update_user(
    user_id: UUID,
    dto: UserUpdate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> UserResponse:
    use_case_dto = UpdateUserDTO(
        user_id=user_id,
        **dto.model_dump(exclude_unset=True),
    )
    repo = BeanieUserRepository()
    use_case = UpdateUserUseCase(repo)
    user = await use_case.execute(use_case_dto)
    return UserResponse(**user.__dict__)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Deactivate user (Admin only)")
async def deactivate_user(
    user_id: UUID,
    _=Depends(require_role(UserRole.ADMIN)),
) -> None:
    repo = BeanieUserRepository()
    use_case = UpdateUserUseCase(repo)
    dto = UpdateUserDTO(user_id=user_id, is_active=False)
    await use_case.execute(dto)
