from dataclasses import dataclass
from uuid import UUID

from app.domain.entities import ReservationStatus, UserRole


@dataclass
class CreateRestaurantDTO:
    name: str
    address: str
    phone: str | None = None


@dataclass
class UpdateRestaurantDTO:
    name: str | None = None
    address: str | None = None
    phone: str | None = None


@dataclass
class CreateTableDTO:
    restaurant_id: UUID
    table_number: int
    capacity: int = 2


@dataclass
class UpdateTableStatusDTO:
    table_id: UUID
    status: ReservationStatus


@dataclass
class RegisterUserDTO:
    email: str
    password: str
    full_name: str
    role: UserRole = UserRole.WAITRESS
    restaurant_id: UUID | None = None


@dataclass
class AssignManagerDTO:
    user_id: UUID
    restaurant_id: UUID


@dataclass
class LoginDTO:
    email: str
    password: str


@dataclass
class LoginResponseDTO:
    access_token: str
    token_type: str = "bearer"
