from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from app.application.dto import UpdateTableStatusDTO as UpdateTableStatusDTOUseCase
from app.application.use_cases.create_table import CreateTableUseCase
from app.application.use_cases.delete_table import DeleteTableUseCase
from app.application.use_cases.list_tables import ListTablesUseCase
from app.application.use_cases.update_table_status import UpdateTableStatusUseCase
from app.domain.entities import UserRole
from app.infrastructure.api.dependencies import require_role
from app.infrastructure.api.schemas import (
    TableCreate,
    TableResponse,
    TableStatusUpdate,
)
from app.infrastructure.repositories.beanie_repositories import (
    BeanieRestaurantRepository,
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
