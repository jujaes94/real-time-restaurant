from app.domain.entities import User
from app.domain.repository_interfaces import IUserRepository
from app.application.dto import RegisterUserDTO
from app.application.exceptions import DuplicateEmailError
from app.application.interfaces import IPasswordHasher


class RegisterUserUseCase:
    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
    ) -> None:
        self._user_repo = user_repo
        self._password_hasher = password_hasher

    async def execute(self, dto: RegisterUserDTO) -> User:
        existing = await self._user_repo.get_by_email(dto.email)
        if existing:
            raise DuplicateEmailError(f"Email {dto.email} already registered")

        user = User(
            email=dto.email,
            hashed_password=self._password_hasher.hash(dto.password),
            full_name=dto.full_name,
            role=dto.role,
            restaurant_id=dto.restaurant_id,
        )
        return await self._user_repo.create(user)
