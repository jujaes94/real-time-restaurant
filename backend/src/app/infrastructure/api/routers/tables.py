from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.application.dto import UpdateTableStatusDTO as UpdateTableStatusDTOUseCase
from app.application.dto import CreateTableOrderDTO, UpdateTableOrderDTO as UpdateTableOrderDTOUseCase
from app.application.use_cases.assign_table import AssignTableUseCase
from app.application.use_cases.create_table import CreateTableUseCase
from app.application.use_cases.create_table_order import CreateTableOrderUseCase
from app.application.use_cases.delete_table import DeleteTableUseCase
from app.application.use_cases.delete_table_order import DeleteTableOrderUseCase
from app.application.use_cases.list_table_orders import ListTableOrdersUseCase
from app.application.use_cases.list_tables import ListTablesUseCase
from app.application.use_cases.update_table_order import UpdateTableOrderUseCase
from app.application.use_cases.update_table_status import UpdateTableStatusUseCase
from app.domain.entities import UserRole
from app.infrastructure.api.dependencies import require_role
from app.infrastructure.api.schemas import (
    AssignTableRequest,
    TableCreate,
    TableOrderCreate,
    TableOrderResponse,
    TableOrderUpdate,
    TableResponse,
    TableStatusUpdate,
)
from app.infrastructure.database.models import UserDocument
from app.infrastructure.repositories.beanie_repositories import (
    BeanieMenuRepository,
    BeanieRestaurantRepository,
    BeanieTableOrderRepository,
    BeanieTableRepository,
)

router = APIRouter(prefix="/tables", tags=["tables"])


@router.get("/", response_model=list[TableResponse], summary="List tables for a restaurant")
async def list_tables(
    restaurant_id: UUID = Query(...),
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> list[TableResponse]:
    repo = BeanieTableRepository()
    use_case = ListTablesUseCase(repo)
    tables = await use_case.execute(restaurant_id)
    return [TableResponse(**t.__dict__) for t in tables]


@router.post("/", response_model=TableResponse, status_code=status.HTTP_201_CREATED, summary="Create a new table (Admin/Manager)")
async def create_table(
    dto: TableCreate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> TableResponse:
    table_repo = BeanieTableRepository()
    restaurant_repo = BeanieRestaurantRepository()
    use_case = CreateTableUseCase(table_repo, restaurant_repo)
    table = await use_case.execute(dto)
    return TableResponse(**table.__dict__)


@router.patch("/{table_id}/status", response_model=TableResponse, summary="Update table status (All roles)")
async def update_table_status(
    table_id: UUID,
    dto: TableStatusUpdate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> TableResponse:
    use_case_dto = UpdateTableStatusDTOUseCase(table_id=table_id, status=dto.status)
    repo = BeanieTableRepository()
    use_case = UpdateTableStatusUseCase(repo)
    table = await use_case.execute(use_case_dto)
    return TableResponse(**table.__dict__)


@router.delete("/{table_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a table (Admin/Manager)")
async def delete_table(
    table_id: UUID,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER)),
) -> None:
    repo = BeanieTableRepository()
    use_case = DeleteTableUseCase(repo)
    await use_case.execute(table_id)


@router.patch("/{table_id}/assign", response_model=TableResponse, summary="Assign staff to a table (All roles)")
async def assign_table(
    table_id: UUID,
    dto: AssignTableRequest,
    current_user: UserDocument = Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> TableResponse:
    repo = BeanieTableRepository()
    use_case = AssignTableUseCase(repo)
    from app.application.dto import AssignTableDTO
    use_case_dto = AssignTableDTO(table_id=table_id, assigned_to=dto.user_id)
    table = await use_case.execute(use_case_dto, actor_id=current_user.id, actor_role=current_user.role)
    return TableResponse(**table.__dict__)


@router.get("/{table_id}/orders", response_model=list[TableOrderResponse], summary="List orders for a table")
async def list_table_orders(
    table_id: UUID,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> list[TableOrderResponse]:
    repo = BeanieTableOrderRepository()
    use_case = ListTableOrdersUseCase(repo)
    orders = await use_case.execute(table_id)
    return [TableOrderResponse(**o.__dict__) for o in orders]


@router.post("/{table_id}/orders", response_model=TableOrderResponse, status_code=status.HTTP_201_CREATED, summary="Add menu item to a table")
async def create_table_order(
    table_id: UUID,
    dto: TableOrderCreate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> TableOrderResponse:
    order_repo = BeanieTableOrderRepository()
    table_repo = BeanieTableRepository()
    menu_repo = BeanieMenuRepository()
    use_case = CreateTableOrderUseCase(order_repo, table_repo, menu_repo)
    use_case_dto = CreateTableOrderDTO(table_id=table_id, menu_id=dto.menu_id, quantity=dto.quantity, notes=dto.notes)
    order = await use_case.execute(use_case_dto)
    return TableOrderResponse(**order.__dict__)


@router.patch("/{table_id}/orders/{order_id}", response_model=TableOrderResponse, summary="Update a table order")
async def update_table_order(
    table_id: UUID,
    order_id: UUID,
    dto: TableOrderUpdate,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> TableOrderResponse:
    repo = BeanieTableOrderRepository()
    use_case = UpdateTableOrderUseCase(repo)
    use_case_dto = UpdateTableOrderDTOUseCase(
        order_id=order_id,
        **dto.model_dump(exclude_unset=True),
    )
    order = await use_case.execute(use_case_dto)
    return TableOrderResponse(**order.__dict__)


@router.delete("/{table_id}/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove a table order")
async def delete_table_order(
    table_id: UUID,
    order_id: UUID,
    _=Depends(require_role(UserRole.ADMIN, UserRole.MANAGER, UserRole.WAITRESS)),
) -> None:
    repo = BeanieTableOrderRepository()
    use_case = DeleteTableOrderUseCase(repo)
    await use_case.execute(order_id)
