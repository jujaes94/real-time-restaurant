import { getRestaurants } from "@/shared/services/restaurants";
import { getWaitresses } from "@/features/staff/waitresses";
import { getMockMenuItems } from "@/features/menu/menuItems";

import { RestaurantListClient } from "./RestaurantListClient";

export default async function RestaurantsPage() {
  const [restaurants, waitresses, menuItems] = await Promise.all([
    getRestaurants(),
    getWaitresses(),
    getMockMenuItems(),
  ]);

  const staffByRestaurant = new Map<number, typeof waitresses>();
  for (const w of waitresses) {
    const list = staffByRestaurant.get(w.restaurantId) ?? [];
    list.push(w);
    staffByRestaurant.set(w.restaurantId, list);
  }

  const menuByRestaurant = new Map<number, typeof menuItems>();
  for (const m of menuItems) {
    const list = menuByRestaurant.get(m.restaurantId) ?? [];
    list.push(m);
    menuByRestaurant.set(m.restaurantId, list);
  }

  return (
    <RestaurantListClient
      restaurants={restaurants}
      staffByRestaurant={staffByRestaurant}
      menuByRestaurant={menuByRestaurant}
    />
  );
}
