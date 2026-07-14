from app.domain.repository_interfaces import IUserRepository
from app.application.dto import LoginDTO, LoginResponseDTO
from app.application.exceptions import InvalidCredentialsError
from app.application.interfaces import IPasswordHasher, ITokenService


class AuthenticateUserUseCase:
    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
        token_service: ITokenService,
    ) -> None:
        self._user_repo = user_repo
        self._password_hasher = password_hasher
        self._token_service = token_service

    async def execute(self, dto: LoginDTO) -> LoginResponseDTO:
        user = await self._user_repo.get_by_email(dto.email)
        if not user or not self._password_hasher.verify(dto.password, user.hashed_password):
            raise InvalidCredentialsError("Invalid email or password")

        token = self._token_service.create_access_token(user_id=user.id, role=user.role)
        return LoginResponseDTO(access_token=token)
