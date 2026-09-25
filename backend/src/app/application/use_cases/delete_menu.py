from uuid import UUID

from app.domain.repository_interfaces import IMenuRepository
from app.application.exceptions import NotFoundError


class DeleteMenuUseCase:
    def __init__(self, menu_repo: IMenuRepository) -> None:
        self._menu_repo = menu_repo

    async def execute(self, menu_id: UUID) -> None:
        item = await self._menu_repo.get_by_id(menu_id)
        if not item:
            raise NotFoundError(f"Menu item {menu_id} not found")
        await self._menu_repo.delete(menu_id)
