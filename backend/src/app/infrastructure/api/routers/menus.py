from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.application.dto import UpdateMenuAvailabilityDTO, UpdateMenuDTO
from app.application.use_cases.create_menu import CreateMenuUseCase
from app.application.use_cases.delete_menu import DeleteMenuUseCase
from app.application.use_cases.list_menus import ListMenusUseCase
from app.application.use_cases.update_menu import UpdateMenuUseCase
from app.application.use_cases.update_menu_availability import UpdateMenuAvailabilityUseCase
from app.domain.entities import UserRole
from app.infrastructure.api.dependencies import require_role
from app.infrastructure.api.schemas import (
    MenuAvailabilityUpdate,
    MenuCreate,
    MenuResponse,
    MenuUpdate,
)
from app.infrastructure.repositories.beanie_repositories import (
    BeanieMenuRepository,
    BeanieRestaurantRepository,
)

router = APIRouter(prefix="/menus", tags=["menus"])


@router.get("/", response_model=list[MenuResponse], summary="List menu items for a restaurant")
async def list_menus(
    restaurant_id: UUID = Query(...),
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> list[MenuResponse]:
    repo = BeanieMenuRepository()
    use_case = ListMenusUseCase(repo)
    items = await use_case.execute(restaurant_id)
    return [MenuResponse(**i.__dict__) for i in items]


@router.post("/", response_model=MenuResponse, status_code=status.HTTP_201_CREATED, summary="Create a menu item (Admin/Manager)")
async def create_menu(
    dto: MenuCreate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> MenuResponse:
    menu_repo = BeanieMenuRepository()
    restaurant_repo = BeanieRestaurantRepository()
    use_case = CreateMenuUseCase(menu_repo, restaurant_repo)
    item = await use_case.execute(dto)
    return MenuResponse(**item.__dict__)


@router.patch("/{menu_id}", response_model=MenuResponse, summary="Update a menu item (Admin/Manager)")
async def update_menu(
    menu_id: UUID,
    dto: MenuUpdate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> MenuResponse:
    use_case_dto = UpdateMenuDTO(menu_id=menu_id, **dto.model_dump(exclude_unset=True))
    repo = BeanieMenuRepository()
    use_case = UpdateMenuUseCase(repo)
    item = await use_case.execute(use_case_dto)
    return MenuResponse(**item.__dict__)


@router.patch("/{menu_id}/availability", response_model=MenuResponse, summary="Toggle menu item availability (All roles)")
async def update_menu_availability(
    menu_id: UUID,
    dto: MenuAvailabilityUpdate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> MenuResponse:
    use_case_dto = UpdateMenuAvailabilityDTO(menu_id=menu_id, is_available=dto.is_available)
    repo = BeanieMenuRepository()
    use_case = UpdateMenuAvailabilityUseCase(repo)
    item = await use_case.execute(use_case_dto)
    return MenuResponse(**item.__dict__)


@router.delete("/{menu_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a menu item (Admin/Manager)")
async def delete_menu(
    menu_id: UUID,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> None:
    repo = BeanieMenuRepository()
    use_case = DeleteMenuUseCase(repo)
    await use_case.execute(menu_id)
