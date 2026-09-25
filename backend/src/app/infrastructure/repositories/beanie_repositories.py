from uuid import UUID

from app.domain.entities import MenuItem, Restaurant, RestaurantTable, TableOrder, User
from app.infrastructure.database.models import (
    MenuDocument,
    RestaurantDocument,
    RestaurantTableDocument,
    TableOrderDocument,
    UserDocument,
)


def _user_to_domain(doc: UserDocument) -> User:
    return User(
        id=doc.id,
        email=doc.email,
        username=doc.username,
        hashed_password=doc.hashed_password,
        full_name=doc.full_name,
        phone_number=doc.phone_number,
        profile_picture=doc.profile_picture,
        role=doc.role,
        restaurant_id=doc.restaurant_id,
        is_active=doc.is_active,
        pto_date_start=doc.pto_date_start,
        pto_date_end=doc.pto_date_end,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


def _restaurant_to_domain(doc: RestaurantDocument) -> Restaurant:
    return Restaurant(
        id=doc.id,
        name=doc.name,
        address=doc.address,
        phone=doc.phone,
        is_active=doc.is_active,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


def _table_to_domain(doc: RestaurantTableDocument) -> RestaurantTable:
    return RestaurantTable(
        id=doc.id,
        restaurant_id=doc.restaurant_id,
        table_number=doc.table_number,
        capacity=doc.capacity,
        status=doc.status,
        assigned_to=doc.assigned_to,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


def _table_order_to_domain(doc: TableOrderDocument) -> TableOrder:
    return TableOrder(
        id=doc.id,
        table_id=doc.table_id,
        menu_id=doc.menu_id,
        quantity=doc.quantity,
        notes=doc.notes,
        status=doc.status,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


class BeanieUserRepository:
    async def create(self, user: User) -> User:
        doc = UserDocument(**user.__dict__)
        await doc.insert()
        return _user_to_domain(doc)

    async def get_by_id(self, id: UUID) -> User | None:
        doc = await UserDocument.get(id)
        if not doc:
            return None
        return _user_to_domain(doc)

    async def get_by_email(self, email: str) -> User | None:
        doc = await UserDocument.find_one(UserDocument.email == email)
        if not doc:
            return None
        return _user_to_domain(doc)

    async def get_by_username(self, username: str) -> User | None:
        doc = await UserDocument.find_one(UserDocument.username == username)
        if not doc:
            return None
        return _user_to_domain(doc)

    async def list_all(self) -> list[User]:
        docs = await UserDocument.find().to_list()
        return [_user_to_domain(d) for d in docs]

    async def list_by_restaurant(self, restaurant_id: UUID) -> list[User]:
        docs = await UserDocument.find(
            UserDocument.restaurant_id == restaurant_id
        ).to_list()
        return [_user_to_domain(d) for d in docs]

    async def update(self, user: User) -> User:
        doc = await UserDocument.get(user.id)
        if not doc:
            from app.application.exceptions import NotFoundError

            raise NotFoundError(f"User {user.id} not found")

        for key, value in user.__dict__.items():
            setattr(doc, key, value)

        await doc.save()
        return _user_to_domain(doc)

    async def delete(self, id: UUID) -> None:
        doc = await UserDocument.get(id)
        if doc:
            await doc.delete()


class BeanieRestaurantRepository:
    async def create(self, restaurant: Restaurant) -> Restaurant:
        doc = RestaurantDocument(**restaurant.__dict__)
        await doc.insert()
        return _restaurant_to_domain(doc)

    async def get_by_id(self, id: UUID) -> Restaurant | None:
        doc = await RestaurantDocument.get(id)
        if not doc:
            return None
        return _restaurant_to_domain(doc)

    async def list_all(self) -> list[Restaurant]:
        docs = await RestaurantDocument.find().to_list()
        return [_restaurant_to_domain(d) for d in docs]

    async def update(self, restaurant: Restaurant) -> Restaurant:
        doc = await RestaurantDocument.get(restaurant.id)
        if not doc:
            from app.application.exceptions import NotFoundError

            raise NotFoundError(f"Restaurant {restaurant.id} not found")

        for key, value in restaurant.__dict__.items():
            setattr(doc, key, value)

        await doc.save()
        return _restaurant_to_domain(doc)

    async def delete(self, id: UUID) -> None:
        doc = await RestaurantDocument.get(id)
        if doc:
            await doc.delete()


class BeanieTableRepository:
    async def create(self, table: RestaurantTable) -> RestaurantTable:
        doc = RestaurantTableDocument(**table.__dict__)
        await doc.insert()
        return _table_to_domain(doc)

    async def get_by_id(self, id: UUID) -> RestaurantTable | None:
        doc = await RestaurantTableDocument.get(id)
        if not doc:
            return None
        return _table_to_domain(doc)

    async def list_by_restaurant(self, restaurant_id: UUID) -> list[RestaurantTable]:
        docs = await RestaurantTableDocument.find(
            RestaurantTableDocument.restaurant_id == restaurant_id
        ).to_list()
        return [_table_to_domain(d) for d in docs]

    async def update(self, table: RestaurantTable) -> RestaurantTable:
        doc = await RestaurantTableDocument.get(table.id)
        if not doc:
            from app.application.exceptions import NotFoundError

            raise NotFoundError(f"Table {table.id} not found")

        for key, value in table.__dict__.items():
            setattr(doc, key, value)

        await doc.save()
        return _table_to_domain(doc)

    async def delete(self, id: UUID) -> None:
        doc = await RestaurantTableDocument.get(id)
        if doc:
            await doc.delete()


def _menu_to_domain(doc: MenuDocument) -> MenuItem:
    return MenuItem(
        id=doc.id,
        restaurant_id=doc.restaurant_id,
        name=doc.name,
        price=doc.price,
        ingredients=doc.ingredients,
        size=doc.size,
        is_vegetarian=doc.is_vegetarian,
        is_active=doc.is_active,
        is_available=doc.is_available,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


class BeanieMenuRepository:
    async def create(self, item: MenuItem) -> MenuItem:
        doc = MenuDocument(**item.__dict__)
        await doc.insert()
        return _menu_to_domain(doc)

    async def get_by_id(self, id: UUID) -> MenuItem | None:
        doc = await MenuDocument.get(id)
        if not doc:
            return None
        return _menu_to_domain(doc)

    async def list_by_restaurant(self, restaurant_id: UUID) -> list[MenuItem]:
        docs = await MenuDocument.find(
            MenuDocument.restaurant_id == restaurant_id
        ).to_list()
        return [_menu_to_domain(d) for d in docs]

    async def update(self, item: MenuItem) -> MenuItem:
        doc = await MenuDocument.get(item.id)
        if not doc:
            from app.application.exceptions import NotFoundError

            raise NotFoundError(f"Menu item {item.id} not found")

        for key, value in item.__dict__.items():
            setattr(doc, key, value)

        await doc.save()
        return _menu_to_domain(doc)

    async def delete(self, id: UUID) -> None:
        doc = await MenuDocument.get(id)
        if doc:
            await doc.delete()


class BeanieTableOrderRepository:
    async def create(self, order: TableOrder) -> TableOrder:
        doc = TableOrderDocument(**order.__dict__)
        await doc.insert()
        return _table_order_to_domain(doc)

    async def get_by_id(self, id: UUID) -> TableOrder | None:
        doc = await TableOrderDocument.get(id)
        if not doc:
            return None
        return _table_order_to_domain(doc)

    async def list_by_table(self, table_id: UUID) -> list[TableOrder]:
        docs = await TableOrderDocument.find(
            TableOrderDocument.table_id == table_id
        ).to_list()
        return [_table_order_to_domain(d) for d in docs]

    async def update(self, order: TableOrder) -> TableOrder:
        doc = await TableOrderDocument.get(order.id)
        if not doc:
            from app.application.exceptions import NotFoundError

            raise NotFoundError(f"Order {order.id} not found")

        for key, value in order.__dict__.items():
            setattr(doc, key, value)

        await doc.save()
        return _table_order_to_domain(doc)

    async def delete(self, id: UUID) -> None:
        doc = await TableOrderDocument.get(id)
        if doc:
            await doc.delete()
