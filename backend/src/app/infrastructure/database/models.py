from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field

from app.domain.entities import ReservationStatus, UserRole


class UserDocument(Document):
    id: UUID = Field(default_factory=uuid4)
    email: str = Indexed(unique=True)
    hashed_password: str
    full_name: str
    role: UserRole
    restaurant_id: Optional[UUID] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        use_enum_values = True


class RestaurantDocument(Document):
    id: UUID = Field(default_factory=uuid4)
    name: str
    address: str
    phone: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "restaurants"


class RestaurantTableDocument(Document):
    id: UUID = Field(default_factory=uuid4)
    restaurant_id: UUID
    table_number: int
    capacity: int = 2
    status: ReservationStatus = ReservationStatus.AVAILABLE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tables"
        use_enum_values = True
