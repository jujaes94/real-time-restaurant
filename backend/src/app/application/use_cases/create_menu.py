from app.domain.entities import MenuItem
from app.domain.repository_interfaces import IMenuRepository, IRestaurantRepository
from app.application.dto import CreateMenuDTO
from app.application.exceptions import NotFoundError


class CreateMenuUseCase:
    def __init__(
        self,
        menu_repo: IMenuRepository,
        restaurant_repo: IRestaurantRepository,
    ) -> None:
        self._menu_repo = menu_repo
        self._restaurant_repo = restaurant_repo

    async def execute(self, dto: CreateMenuDTO) -> MenuItem:
        restaurant = await self._restaurant_repo.get_by_id(dto.restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurant {dto.restaurant_id} not found")

        item = MenuItem(
            restaurant_id=dto.restaurant_id,
            name=dto.name,
            description=dto.description,
            price=dto.price,
            ingredients=dto.ingredients,
            category=dto.category,
            size=dto.size,
            is_vegetarian=dto.is_vegetarian,
            is_vegan=dto.is_vegan,
            is_active=dto.is_active,
            is_available=dto.is_available,
            allergens=dto.allergens,
            preparation_time=dto.preparation_time,
            image_url=dto.image_url,
        )
        return await self._menu_repo.create(item)
