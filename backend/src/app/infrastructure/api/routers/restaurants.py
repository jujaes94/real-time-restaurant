from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.application.use_cases.assign_manager import AssignManagerUseCase
from app.application.use_cases.create_restaurant import CreateRestaurantUseCase
from app.application.use_cases.delete_restaurant import DeleteRestaurantUseCase
from app.application.use_cases.get_restaurant import GetRestaurantUseCase
from app.application.use_cases.list_restaurants import ListRestaurantsUseCase
from app.application.use_cases.update_restaurant import UpdateRestaurantUseCase
from app.domain.entities import UserRole
from app.infrastructure.api.dependencies import require_role
from app.infrastructure.api.schemas import (
    AssignManagerRequest,
    RestaurantCreate,
    RestaurantResponse,
    RestaurantUpdate,
    UserResponse,
)
from app.infrastructure.repositories.beanie_repositories import (
    BeanieRestaurantRepository,
    BeanieUserRepository,
)

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("/", response_model=list[RestaurantResponse])
async def list_restaurants(
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> list[RestaurantResponse]:
    repo = BeanieRestaurantRepository()
    use_case = ListRestaurantsUseCase(repo)
    restaurants = await use_case.execute()
    return [RestaurantResponse(**r.__dict__) for r in restaurants]


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(
    restaurant_id: UUID,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> RestaurantResponse:
    repo = BeanieRestaurantRepository()
    use_case = GetRestaurantUseCase(repo)
    restaurant = await use_case.execute(restaurant_id)
    return RestaurantResponse(**restaurant.__dict__)


@router.post("/", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant(
    dto: RestaurantCreate,
    _=Depends(require_role(UserRole.ADMIN)),
) -> RestaurantResponse:
    repo = BeanieRestaurantRepository()
    use_case = CreateRestaurantUseCase(repo)
    restaurant = await use_case.execute(dto)
    return RestaurantResponse(**restaurant.__dict__)


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
async def update_restaurant(
    restaurant_id: UUID,
    dto: RestaurantUpdate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> RestaurantResponse:
    repo = BeanieRestaurantRepository()
    use_case = UpdateRestaurantUseCase(repo)
    restaurant = await use_case.execute(restaurant_id, dto)
    return RestaurantResponse(**restaurant.__dict__)


@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_restaurant(
    restaurant_id: UUID,
    _=Depends(require_role(UserRole.ADMIN)),
) -> None:
    repo = BeanieRestaurantRepository()
    use_case = DeleteRestaurantUseCase(repo)
    await use_case.execute(restaurant_id)


@router.post(
    "/{restaurant_id}/assign-manager",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
async def assign_manager(
    restaurant_id: UUID,
    dto: AssignManagerRequest,
    _=Depends(require_role(UserRole.ADMIN)),
) -> UserResponse:
    user_repo = BeanieUserRepository()
    restaurant_repo = BeanieRestaurantRepository()
    use_case = AssignManagerUseCase(user_repo, restaurant_repo)
    user = await use_case.execute(dto)
    return UserResponse(**user.__dict__)
