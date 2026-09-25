from app.domain.entities import User
from app.domain.repository_interfaces import IUserRepository
from app.application.dto import UpdateUserDTO
from app.application.exceptions import NotFoundError, DuplicateUsernameError


class UpdateUserUseCase:
    def __init__(self, user_repo: IUserRepository) -> None:
        self._user_repo = user_repo

    async def execute(self, dto: UpdateUserDTO) -> User:
        user = await self._user_repo.get_by_id(dto.user_id)
        if not user:
            raise NotFoundError(f"User {dto.user_id} not found")

        if dto.username is not None and dto.username != user.username:
            existing = await self._user_repo.get_by_username(dto.username)
            if existing:
                raise DuplicateUsernameError(f"Username {dto.username} already taken")
            user.username = dto.username

        if dto.full_name is not None:
            user.full_name = dto.full_name
        if dto.phone_number is not None:
            user.phone_number = dto.phone_number
        if dto.role is not None:
            user.role = dto.role
        if dto.is_active is not None:
            user.is_active = dto.is_active
        if dto.pto_date_start is not None:
            user.pto_date_start = dto.pto_date_start
        if dto.pto_date_end is not None:
            user.pto_date_end = dto.pto_date_end

        return await self._user_repo.update(user)
