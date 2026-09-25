from uuid import UUID

from app.domain.entities import User, UserRole
from app.domain.repository_interfaces import IUserRepository, IRestaurantRepository
from app.application.dto import AssignStaffDTO
from app.application.exceptions import NotFoundError, DomainError


class AssignStaffUseCase:
    def __init__(
        self,
        user_repo: IUserRepository,
        restaurant_repo: IRestaurantRepository,
    ) -> None:
        self._user_repo = user_repo
        self._restaurant_repo = restaurant_repo

    async def execute(self, dto: AssignStaffDTO, actor_role: UserRole, actor_restaurant_id: UUID | None = None) -> User:
        restaurant = await self._restaurant_repo.get_by_id(dto.restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurant {dto.restaurant_id} not found")

        user = await self._user_repo.get_by_id(dto.user_id)
        if not user:
            raise NotFoundError(f"User {dto.user_id} not found")

        if actor_role == UserRole.MANAGER:
            if not actor_restaurant_id or actor_restaurant_id != dto.restaurant_id:
                raise DomainError("Manager can only assign staff to their own restaurant")
            user.role = UserRole.WAITRESS
        elif actor_role == UserRole.ADMIN:
            if user.role == UserRole.ADMIN:
                raise DomainError("Cannot reassign an admin user")

        user.restaurant_id = dto.restaurant_id
        return await self._user_repo.update(user)
