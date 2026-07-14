from uuid import UUID

from app.domain.repository_interfaces import IRestaurantRepository
from app.application.exceptions import NotFoundError


class DeleteRestaurantUseCase:
    def __init__(self, restaurant_repo: IRestaurantRepository) -> None:
        self._restaurant_repo = restaurant_repo

    async def execute(self, restaurant_id: UUID) -> None:
        restaurant = await self._restaurant_repo.get_by_id(restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurant {restaurant_id} not found")
        await self._restaurant_repo.delete(restaurant_id)
