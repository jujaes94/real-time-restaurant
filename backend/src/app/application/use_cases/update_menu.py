from app.domain.entities import MenuItem
from app.domain.repository_interfaces import IMenuRepository
from app.application.dto import UpdateMenuDTO
from app.application.exceptions import NotFoundError


class UpdateMenuUseCase:
    def __init__(self, menu_repo: IMenuRepository) -> None:
        self._menu_repo = menu_repo

    async def execute(self, dto: UpdateMenuDTO) -> MenuItem:
        item = await self._menu_repo.get_by_id(dto.menu_id)
        if not item:
            raise NotFoundError(f"Menu item {dto.menu_id} not found")

        if dto.name is not None:
            item.name = dto.name
        if dto.description is not None:
            item.description = dto.description
        if dto.price is not None:
            item.price = dto.price
        if dto.ingredients is not None:
            item.ingredients = dto.ingredients
        if dto.category is not None:
            item.category = dto.category
        if dto.size is not None:
            item.size = dto.size
        if dto.is_vegetarian is not None:
            item.is_vegetarian = dto.is_vegetarian
        if dto.is_vegan is not None:
            item.is_vegan = dto.is_vegan
        if dto.is_active is not None:
            item.is_active = dto.is_active
        if dto.allergens is not None:
            item.allergens = dto.allergens
        if dto.preparation_time is not None:
            item.preparation_time = dto.preparation_time
        if dto.image_url is not None:
            item.image_url = dto.image_url

        return await self._menu_repo.update(item)
