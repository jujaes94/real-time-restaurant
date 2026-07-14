from uuid import UUID

from app.domain.entities import User
from app.domain.repository_interfaces import IUserRepository


class ListUsersByRestaurantUseCase:
    def __init__(self, user_repo: IUserRepository) -> None:
        self._user_repo = user_repo

    async def execute(self, restaurant_id: UUID) -> list[User]:
        return await self._user_repo.list_by_restaurant(restaurant_id)
