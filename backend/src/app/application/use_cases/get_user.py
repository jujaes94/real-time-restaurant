from uuid import UUID

from app.domain.entities import User
from app.domain.repository_interfaces import IUserRepository
from app.application.exceptions import NotFoundError


class GetUserUseCase:
    def __init__(self, user_repo: IUserRepository) -> None:
        self._user_repo = user_repo

    async def execute(self, user_id: UUID) -> User:
        user = await self._user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError(f"User {user_id} not found")
        return user
