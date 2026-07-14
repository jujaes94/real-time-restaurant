from typing import Protocol
from uuid import UUID

from app.domain.entities import UserRole


class IPasswordHasher(Protocol):
    def hash(self, plain: str) -> str: ...
    def verify(self, plain: str, hashed: str) -> bool: ...


class ITokenService(Protocol):
    def create_access_token(self, user_id: UUID, role: UserRole) -> str: ...
    def decode_token(self, token: str) -> dict: ...
