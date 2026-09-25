from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.domain.entities import MenuCategory, MenuSize, OrderStatus, ReservationStatus, UserRole


class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: str
    phone_number: str | None = None
    role: UserRole = UserRole.WAITRESS
    restaurant_id: UUID | None = None


class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    full_name: str
    phone_number: str | None = None
    profile_picture: str | None = None
    role: UserRole
    restaurant_id: UUID | None = None
    is_active: bool = True
    pto_date_start: datetime | None = None
    pto_date_end: datetime | None = None
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
    assigned_to: UUID | None = None
    created_at: datetime
    updated_at: datetime


class AssignStaffRequest(BaseModel):
    user_id: UUID
    restaurant_id: UUID


class AssignTableRequest(BaseModel):
    user_id: UUID


class TableOrderCreate(BaseModel):
    menu_id: UUID
    quantity: int = 1
    notes: str = ""


class TableOrderUpdate(BaseModel):
    quantity: int | None = None
    notes: str | None = None
    status: OrderStatus | None = None


class TableOrderResponse(BaseModel):
    id: UUID
    table_id: UUID
    menu_id: UUID
    quantity: int
    notes: str
    status: OrderStatus
    created_at: datetime
    updated_at: datetime


class RegisterAdminCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: str
    phone_number: str | None = None


class MenuCreate(BaseModel):
    restaurant_id: UUID
    name: str
    description: str = ""
    price: float
    ingredients: str = ""
    category: MenuCategory = MenuCategory.MAIN
    size: MenuSize
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_active: bool = True
    is_available: bool = True
    allergens: str | None = None
    preparation_time: int | None = None
    image_url: str | None = None


class MenuUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    ingredients: str | None = None
    category: MenuCategory | None = None
    size: MenuSize | None = None
    is_vegetarian: bool | None = None
    is_vegan: bool | None = None
    is_active: bool | None = None
    allergens: str | None = None
    preparation_time: int | None = None
    image_url: str | None = None


class MenuAvailabilityUpdate(BaseModel):
    is_available: bool


class MenuResponse(BaseModel):
    id: UUID
    restaurant_id: UUID
    name: str
    description: str
    price: float
    ingredients: str
    category: MenuCategory
    size: MenuSize
    is_vegetarian: bool
    is_vegan: bool
    is_active: bool
    is_available: bool
    allergens: str | None = None
    preparation_time: int | None = None
    image_url: str | None = None
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    username: str | None = None
    full_name: str | None = None
    phone_number: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None
    pto_date_start: datetime | None = None
    pto_date_end: datetime | None = None


class OwnProfileUpdate(BaseModel):
    username: str | None = None
    full_name: str | None = None
    phone_number: str | None = None
    profile_picture: str | None = None
