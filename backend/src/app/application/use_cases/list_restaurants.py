from app.domain.entities import Restaurant
from app.domain.repository_interfaces import IRestaurantRepository


class ListRestaurantsUseCase:
    def __init__(self, restaurant_repo: IRestaurantRepository) -> None:
        self._restaurant_repo = restaurant_repo

    async def execute(self) -> list[Restaurant]:
        return await self._restaurant_repo.list_all()
