from app.domain.entities import User, UserRole
from app.domain.repository_interfaces import IUserRepository
from app.application.dto import RegisterUserDTO
from app.application.exceptions import DuplicateEmailError, DuplicateUsernameError
from app.application.interfaces import IPasswordHasher


class RegisterAdminUseCase:
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

        existing_username = await self._user_repo.get_by_username(dto.username)
        if existing_username:
            raise DuplicateUsernameError(f"Username {dto.username} already taken")

        user = User(
            email=dto.email,
            username=dto.username,
            hashed_password=self._password_hasher.hash(dto.password),
            full_name=dto.full_name,
            phone_number=dto.phone_number,
            role=UserRole.ADMIN,
            restaurant_id=None,
        )
        return await self._user_repo.create(user)
