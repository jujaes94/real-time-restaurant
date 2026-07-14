from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.infrastructure.database.models import (
    RestaurantDocument,
    RestaurantTableDocument,
    UserDocument,
)

_client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.database_url)
    from beanie import init_beanie

    await init_beanie(
        database=_client.get_default_database(),
        document_models=[
            UserDocument,
            RestaurantDocument,
            RestaurantTableDocument,
        ],
    )


async def close_db() -> None:
    global _client
    if _client:
        _client.close()
        _client = None
