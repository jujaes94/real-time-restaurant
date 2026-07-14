from app.domain.entities import Restaurant
from app.domain.repository_interfaces import IRestaurantRepository
from app.application.dto import CreateRestaurantDTO


class CreateRestaurantUseCase:
    def __init__(self, restaurant_repo: IRestaurantRepository) -> None:
        self._restaurant_repo = restaurant_repo

    async def execute(self, dto: CreateRestaurantDTO) -> Restaurant:
        restaurant = Restaurant(name=dto.name, address=dto.address, phone=dto.phone)
        return await self._restaurant_repo.create(restaurant)
