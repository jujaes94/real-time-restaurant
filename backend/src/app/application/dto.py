from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities import MenuCategory, MenuSize, OrderStatus, ReservationStatus, UserRole


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
    username: str
    password: str
    full_name: str
    phone_number: str | None = None
    role: UserRole = UserRole.WAITRESS
    restaurant_id: UUID | None = None


@dataclass
class AssignStaffDTO:
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


@dataclass
class CreateMenuDTO:
    restaurant_id: UUID
    name: str
    price: float
    size: MenuSize
    description: str = ""
    ingredients: str = ""
    category: MenuCategory = MenuCategory.MAIN
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_active: bool = True
    is_available: bool = True
    allergens: str | None = None
    preparation_time: int | None = None
    image_url: str | None = None


@dataclass
class UpdateMenuDTO:
    menu_id: UUID
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


@dataclass
class UpdateMenuAvailabilityDTO:
    menu_id: UUID
    is_available: bool


@dataclass
class UpdateUserDTO:
    user_id: UUID
    username: str | None = None
    full_name: str | None = None
    phone_number: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None
    pto_date_start: datetime | None = None
    pto_date_end: datetime | None = None


@dataclass
class UpdateOwnProfileDTO:
    user_id: UUID
    username: str | None = None
    full_name: str | None = None
    phone_number: str | None = None
    profile_picture: str | None = None


@dataclass
class AssignTableDTO:
    table_id: UUID
    assigned_to: UUID


@dataclass
class CreateTableOrderDTO:
    table_id: UUID
    menu_id: UUID
    quantity: int = 1
    notes: str = ""


@dataclass
class UpdateTableOrderDTO:
    order_id: UUID
    quantity: int | None = None
    notes: str | None = None
    status: OrderStatus | None = None
