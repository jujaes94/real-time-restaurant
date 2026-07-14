from app.domain.entities import RestaurantTable
from app.domain.repository_interfaces import ITableRepository
from app.application.dto import UpdateTableStatusDTO
from app.application.exceptions import NotFoundError


class UpdateTableStatusUseCase:
    def __init__(self, table_repo: ITableRepository) -> None:
        self._table_repo = table_repo

    async def execute(self, dto: UpdateTableStatusDTO) -> RestaurantTable:
        table = await self._table_repo.get_by_id(dto.table_id)
        if not table:
            raise NotFoundError(f"Table {dto.table_id} not found")

        table.status = dto.status
        return await self._table_repo.update(table)
