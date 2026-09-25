from uuid import UUID

from app.domain.entities import RestaurantTable, UserRole
from app.domain.repository_interfaces import ITableRepository
from app.application.dto import AssignTableDTO
from app.application.exceptions import NotFoundError, DomainError


class AssignTableUseCase:
    def __init__(self, table_repo: ITableRepository) -> None:
        self._table_repo = table_repo

    async def execute(self, dto: AssignTableDTO, actor_id: UUID, actor_role: UserRole) -> RestaurantTable:
        table = await self._table_repo.get_by_id(dto.table_id)
        if not table:
            raise NotFoundError(f"Table {dto.table_id} not found")

        if actor_role == UserRole.WAITRESS and dto.assigned_to != actor_id:
            raise DomainError("Waitress can only self-assign to a table")

        table.assigned_to = dto.assigned_to
        return await self._table_repo.update(table)
