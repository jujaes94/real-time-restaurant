from uuid import UUID

from app.domain.entities import MenuItem
from app.domain.repository_interfaces import IMenuRepository


class ListMenusUseCase:
    def __init__(self, menu_repo: IMenuRepository) -> None:
        self._menu_repo = menu_repo

    async def execute(self, restaurant_id: UUID) -> list[MenuItem]:
        return await self._menu_repo.list_by_restaurant(restaurant_id)
