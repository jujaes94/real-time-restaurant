from app.domain.entities import User, UserRole
from app.domain.repository_interfaces import IUserRepository, IRestaurantRepository
from app.application.dto import AssignManagerDTO
from app.application.exceptions import NotFoundError


class AssignManagerUseCase:
    def __init__(
        self,
        user_repo: IUserRepository,
        restaurant_repo: IRestaurantRepository,
    ) -> None:
        self._user_repo = user_repo
        self._restaurant_repo = restaurant_repo

    async def execute(self, dto: AssignManagerDTO) -> User:
        restaurant = await self._restaurant_repo.get_by_id(dto.restaurant_id)
        if not restaurant:
            raise NotFoundError(f"Restaurant {dto.restaurant_id} not found")

        user = await self._user_repo.get_by_id(dto.user_id)
        if not user:
            raise NotFoundError(f"User {dto.user_id} not found")

        user.role = UserRole.MANAGER
        user.restaurant_id = dto.restaurant_id
        return await self._user_repo.update(user)
