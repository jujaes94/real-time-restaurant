from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities import ReservationStatus, UserRole


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: UserRole = UserRole.WAITRESS
    restaurant_id: UUID | None = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: UserRole
    restaurant_id: UUID | None = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RestaurantCreate(BaseModel):
    name: str
    address: str
    phone: str | None = None


class RestaurantUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    phone: str | None = None


class RestaurantResponse(BaseModel):
    id: UUID
    name: str
    address: str
    phone: str | None = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class TableCreate(BaseModel):
    restaurant_id: UUID
    table_number: int
    capacity: int = 2


class TableStatusUpdate(BaseModel):
    status: ReservationStatus


class TableResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    table_number: int
    capacity: int
    status: ReservationStatus
    created_at: datetime
    updated_at: datetime


class AssignManagerRequest(BaseModel):
    user_id: UUID
    restaurant_id: UUID
