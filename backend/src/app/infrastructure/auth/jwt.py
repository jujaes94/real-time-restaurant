from datetime import datetime, timedelta
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.application.exceptions import InvalidCredentialsError
from app.config import settings
from app.domain.entities import UserRole

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class PasswordHasher:
    def hash(self, plain: str) -> str:
        return _pwd_context.hash(plain)

    def verify(self, plain: str, hashed: str) -> bool:
        return _pwd_context.verify(plain, hashed)


class TokenService:
    def create_access_token(self, user_id: UUID, role: UserRole) -> str:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        payload = {
            "sub": str(user_id),
            "role": role.value,
            "exp": expire,
        }
        return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

    def decode_token(self, token: str) -> dict:
        try:
            return jwt.decode(
                token, settings.secret_key, algorithms=[settings.algorithm]
            )
        except JWTError as exc:
            raise InvalidCredentialsError("Invalid or expired token") from exc
