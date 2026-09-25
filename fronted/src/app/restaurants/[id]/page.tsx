import { notFound } from "next/navigation";

import { DashboardShell } from "@/shared/components/layout";
import { getRestaurant } from "@/shared/services/restaurants";
import { getWaitresses } from "@/features/staff/waitresses";
import { getMockMenuItems } from "@/features/menu/menuItems";
import { RestaurantDetailClient } from "@/features/restaurants/RestaurantDetailClient";

export default async function RestaurantDetailPage({
  params,
}: PageProps<"/restaurants/[id]">) {
  const { id } = await params;
  const restaurantId = Number(id);
  if (!Number.isFinite(restaurantId)) notFound();

  const restaurant = await getRestaurant(restaurantId);
  if (!restaurant) notFound();

  const [allWaitresses, menuItems] = await Promise.all([
    getWaitresses(),
    getMockMenuItems(),
  ]);

  const staff = allWaitresses.filter((w) => w.restaurantId === restaurantId);
  const restaurantMenuItems = menuItems.filter((m) => m.restaurantId === restaurantId);

  return (
    <DashboardShell title={restaurant.name}>
      <RestaurantDetailClient
        restaurant={restaurant}
        staff={staff}
        allWaitresses={allWaitresses}
        menuItems={restaurantMenuItems}
      />
    </DashboardShell>
  );
}
