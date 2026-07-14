from uuid import UUID

from app.domain.entities import Restaurant
from app.domain.repository_interfaces import IRestaurantRepository


class GetRestaurantUseCase:
    def __init__(self, restaurant_repo: IRestaurantRepository) -> None:
        self._restaurant_repo = restaurant_repo

    async def execute(self, restaurant_id: UUID) -> Restaurant | None:
        return await self._restaurant_repo.get_by_id(restaurant_id)
