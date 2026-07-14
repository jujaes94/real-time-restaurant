from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.domain.entities import UserRole
from app.infrastructure.auth.jwt import TokenService
from app.infrastructure.database.models import UserDocument
from app.infrastructure.repositories.beanie_repositories import (
    BeanieUserRepository,
)

_security = HTTPBearer()
_token_service = TokenService()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_security),
) -> UserDocument:
    payload = _token_service.decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )

    repo = BeanieUserRepository()
    user = await repo.get_by_id(UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    doc = await UserDocument.get(UUID(user_id))
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return doc


def require_role(*roles: UserRole):
    async def role_checker(
        current_user: UserDocument = Depends(get_current_user),
    ) -> UserDocument:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return role_checker
