from app.domain.entities import TableOrder
from app.domain.repository_interfaces import ITableRepository, IMenuRepository, ITableOrderRepository
from app.application.dto import CreateTableOrderDTO
from app.application.exceptions import NotFoundError


class CreateTableOrderUseCase:
    def __init__(
        self,
        order_repo: ITableOrderRepository,
        table_repo: ITableRepository,
        menu_repo: IMenuRepository,
    ) -> None:
        self._order_repo = order_repo
        self._table_repo = table_repo
        self._menu_repo = menu_repo

    async def execute(self, dto: CreateTableOrderDTO) -> TableOrder:
        table = await self._table_repo.get_by_id(dto.table_id)
        if not table:
            raise NotFoundError(f"Table {dto.table_id} not found")

        menu = await self._menu_repo.get_by_id(dto.menu_id)
        if not menu:
            raise NotFoundError(f"Menu item {dto.menu_id} not found")

        order = TableOrder(
            table_id=dto.table_id,
            menu_id=dto.menu_id,
            quantity=dto.quantity,
            notes=dto.notes,
        )
        return await self._order_repo.create(order)
