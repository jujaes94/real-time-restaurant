from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from uuid import UUID, uuid4


class UserRole(StrEnum):
    ADMIN = "admin"
    MANAGER = "manager"
    WAITRESS = "waitress"


class ReservationStatus(StrEnum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"


@dataclass
class User:
    id: UUID = field(default_factory=uuid4)
    email: str = ""
    hashed_password: str = ""
    full_name: str = ""
    role: UserRole = UserRole.WAITRESS
    restaurant_id: UUID | None = None
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Restaurant:
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    address: str = ""
    phone: str | None = None
    is_active: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class RestaurantTable:
    id: UUID = field(default_factory=uuid4)
    restaurant_id: UUID | None = None
    table_number: int = 0
    capacity: int = 2
    status: ReservationStatus = ReservationStatus.AVAILABLE
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
