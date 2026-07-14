from uuid import UUID

from app.domain.repository_interfaces import ITableRepository
from app.application.exceptions import NotFoundError


class DeleteTableUseCase:
    def __init__(self, table_repo: ITableRepository) -> None:
        self._table_repo = table_repo

    async def execute(self, table_id: UUID) -> None:
        table = await self._table_repo.get_by_id(table_id)
        if not table:
            raise NotFoundError(f"Table {table_id} not found")
        await self._table_repo.delete(table_id)
