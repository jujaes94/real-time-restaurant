from uuid import UUID

from app.domain.repository_interfaces import ITableOrderRepository
from app.application.exceptions import NotFoundError


class DeleteTableOrderUseCase:
    def __init__(self, order_repo: ITableOrderRepository) -> None:
        self._order_repo = order_repo

    async def execute(self, order_id: UUID) -> None:
        order = await self._order_repo.get_by_id(order_id)
        if not order:
            raise NotFoundError(f"Order {order_id} not found")
        await self._order_repo.delete(order_id)
