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


class MenuSize(StrEnum):
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"


class MenuCategory(StrEnum):
    APPETIZER = "appetizer"
    MAIN = "main"
    DESSERT = "dessert"
    DRINK = "drink"
    SIDE = "side"


class OrderStatus(StrEnum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    SERVED = "served"
    CANCELLED = "cancelled"


@dataclass
class User:
    id: UUID = field(default_factory=uuid4)
    email: str = ""
    username: str = ""
    hashed_password: str = ""
    full_name: str = ""
    phone_number: str | None = None
    profile_picture: str | None = None
    role: UserRole = UserRole.WAITRESS
    restaurant_id: UUID | None = None
    is_active: bool = True
    pto_date_start: datetime | None = None
    pto_date_end: datetime | None = None
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
    assigned_to: UUID | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class MenuItem:
    id: UUID = field(default_factory=uuid4)
    restaurant_id: UUID | None = None
    name: str = ""
    description: str = ""
    price: float = 0.0
    ingredients: str = ""
    category: MenuCategory = MenuCategory.MAIN
    size: MenuSize = MenuSize.SMALL
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_active: bool = True
    is_available: bool = True
    allergens: str | None = None
    preparation_time: int | None = None
    image_url: str | None = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class TableOrder:
    table_id: UUID
    menu_id: UUID
    quantity: int = 1
    notes: str = ""
    status: OrderStatus = OrderStatus.PENDING
    id: UUID = field(default_factory=uuid4)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
