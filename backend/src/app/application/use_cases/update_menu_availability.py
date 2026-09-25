from app.domain.entities import MenuItem
from app.domain.repository_interfaces import IMenuRepository
from app.application.dto import UpdateMenuAvailabilityDTO
from app.application.exceptions import NotFoundError


class UpdateMenuAvailabilityUseCase:
    def __init__(self, menu_repo: IMenuRepository) -> None:
        self._menu_repo = menu_repo

    async def execute(self, dto: UpdateMenuAvailabilityDTO) -> MenuItem:
        item = await self._menu_repo.get_by_id(dto.menu_id)
        if not item:
            raise NotFoundError(f"Menu item {dto.menu_id} not found")

        item.is_available = dto.is_available
        return await self._menu_repo.update(item)
