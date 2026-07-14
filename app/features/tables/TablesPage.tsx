import { getRestaurants } from "@/app/services/restaurants";
import { getTables, type RestaurantTable } from "@/app/services/tables";
import { getOrdersForTable, type Order } from "@/app/services/orders";

import { VisualTableGrid } from "./VisualTableGrid";

export interface GroupedTables {
  restaurantId: number;
  restaurantName: string;
  city: string;
  tables: RestaurantTable[];
}

export default async function TablesFeature() {
  const [restaurants, tables] = await Promise.all([
    getRestaurants(),
    getTables(),
  ]);

  const grouped: GroupedTables[] = restaurants.map((restaurant) => ({
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    city: restaurant.city,
    tables: tables.filter((t) => t.restaurantId === restaurant.id),
  }));

  const ordersByTable = new Map<number, Order[]>();
  await Promise.all(
    tables.map(async (table) => {
      const orders = await getOrdersForTable(table.id);
      if (orders.length > 0) {
        ordersByTable.set(table.id, orders);
      }
    }),
  );

  return <VisualTableGrid grouped={grouped} ordersByTable={ordersByTable} />;
}