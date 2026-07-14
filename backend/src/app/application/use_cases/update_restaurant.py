from uuid import UUID

from app.domain.entities import Restaurant
from app.domain.repository_interfaces import IRestaurantRepository
from app.application.dto import UpdateRestaurantDTO
from app.application.exceptions import NotFoundError


class UpdateRestaurantUseCase:
    def __init__(self, restaurant_repo: IRestaurantRepository) -> None:
        self._restaurant_repo = restaurant_repo

    async def execute(self, restaurant_id: UUID, dto: UpdateRestaurantDTO) -> Restaurant:
        restaurant = await self._restaurant_repo.get_by_id(restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurant {restaurant_id} not found")

        for field, value in dto.__dict__.items():
            if value is not None:
                setattr(restaurant, field, value)

        return await self._restaurant_repo.update(restaurant)
