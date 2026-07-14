from app.domain.entities import RestaurantTable
from app.domain.repository_interfaces import ITableRepository, IRestaurantRepository
from app.application.dto import CreateTableDTO
from app.application.exceptions import NotFoundError


class CreateTableUseCase:
    def __init__(
        self,
        table_repo: ITableRepository,
        restaurant_repo: IRestaurantRepository,
    ) -> None:
        self._table_repo = table_repo
        self._restaurant_repo = restaurant_repo

    async def execute(self, dto: CreateTableDTO) -> RestaurantTable:
        restaurant = await self._restaurant_repo.get_by_id(dto.restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurant {dto.restaurant_id} not found")

        table = RestaurantTable(
            restaurant_id=dto.restaurant_id,
            table_number=dto.table_number,
            capacity=dto.capacity,
        )
        return await self._table_repo.create(table)
