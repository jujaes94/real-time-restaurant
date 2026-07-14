from uuid import UUID

from app.domain.entities import RestaurantTable
from app.domain.repository_interfaces import ITableRepository


class ListTablesUseCase:
    def __init__(self, table_repo: ITableRepository) -> None:
        self._table_repo = table_repo

    async def execute(self, restaurant_id: UUID) -> list[RestaurantTable]:
        return await self._table_repo.list_by_restaurant(restaurant_id)
