from app.domain.entities import TableOrder
from app.domain.repository_interfaces import ITableOrderRepository
from app.application.dto import UpdateTableOrderDTO
from app.application.exceptions import NotFoundError


class UpdateTableOrderUseCase:
    def __init__(self, order_repo: ITableOrderRepository) -> None:
        self._order_repo = order_repo

    async def execute(self, dto: UpdateTableOrderDTO) -> TableOrder:
        order = await self._order_repo.get_by_id(dto.order_id)
        if not order:
            raise NotFoundError(f"Order {dto.order_id} not found")

        if dto.quantity is not None:
            order.quantity = dto.quantity
        if dto.notes is not None:
            order.notes = dto.notes
        if dto.status is not None:
            order.status = dto.status

        return await self._order_repo.update(order)
