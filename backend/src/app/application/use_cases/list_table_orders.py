from uuid import UUID

from app.domain.entities import TableOrder
from app.domain.repository_interfaces import ITableOrderRepository


class ListTableOrdersUseCase:
    def __init__(self, order_repo: ITableOrderRepository) -> None:
        self._order_repo = order_repo

    async def execute(self, table_id: UUID) -> list[TableOrder]:
        return await self._order_repo.list_by_table(table_id)
