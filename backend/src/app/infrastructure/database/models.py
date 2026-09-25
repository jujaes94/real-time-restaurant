from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from beanie import Document, Indexed
from pydantic import Field

from app.domain.entities import MenuCategory, MenuSize, OrderStatus, ReservationStatus, UserRole


class UserDocument(Document):
    id: UUID = Field(default_factory=uuid4)
    email: str = Indexed(unique=True)
    username: str = Indexed(unique=True)
    hashed_password: str
    full_name: str
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None
    role: UserRole
    restaurant_id: Optional[UUID] = None
    is_active: bool = True
    pto_date_start: Optional[datetime] = None
    pto_date_end: Optional[datetime] = None
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
    assigned_to: Optional[UUID] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tables"
        use_enum_values = True


class MenuDocument(Document):
    id: UUID = Field(default_factory=uuid4)
    restaurant_id: UUID
    name: str
    description: str = ""
    price: float
    ingredients: str = ""
    category: str = MenuCategory.MAIN.value
    size: str
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_active: bool = True
    is_available: bool = True
    allergens: Optional[str] = None
    preparation_time: Optional[int] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "menus"
        use_enum_values = True


class TableOrderDocument(Document):
    id: UUID = Field(default_factory=uuid4)
    table_id: UUID
    menu_id: UUID
    quantity: int = 1
    notes: str = ""
    status: str = OrderStatus.PENDING.value
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "table_orders"
        use_enum_values = True
