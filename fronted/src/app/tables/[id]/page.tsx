import Link from "next/link";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/shared/components/layout";
import { TableDetailClient } from "@/features/tables/TableDetailClient";
import {
  getOrdersForTable,
  getOrderItems,
  type OrderItem,
} from "@/features/orders/orders";
import { getRestaurant } from "@/shared/services/restaurants";
import { getTable } from "@/features/tables/tables";
import { getMenuItems } from "@/features/menu/menuItems";

export default async function TableDetailPage({
  params,
}: PageProps<"/tables/[id]">) {
  const { id } = await params;
  const tableId = Number(id);
  if (!Number.isFinite(tableId)) notFound();

  const table = await getTable(tableId);
  if (!table) notFound();

  const [restaurant, orders, menuItems] = await Promise.all([
    getRestaurant(table.restaurantId),
    getOrdersForTable(tableId),
    getMenuItems(),
  ]);

  const visibleOrders = orders.filter((o) => o.status !== "paid");
  const orderItemsMap: Record<number, OrderItem[]> = {};
  for (const order of visibleOrders) {
    orderItemsMap[order.id] = await getOrderItems(order.id);
  }

  return (
    <DashboardShell title={`${table.label} · ${restaurant?.name ?? "Table"}`}>
      <Link
        href="/tables"
        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        ← Back to tables
      </Link>
      <TableDetailClient
        table={table}
        restaurantName={restaurant?.name ?? "Restaurant"}
        orders={orders}
        menuItems={menuItems}
        orderItemsMap={orderItemsMap}
      />
    </DashboardShell>
  );
}
