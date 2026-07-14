"use client";

import type { GroupedTables } from "./TablesPage";
import type { Order } from "@/app/services/orders";
import { VisualTableCard } from "./VisualTableCard";

type Props = {
  grouped: GroupedTables[];
  ordersByTable: Map<number, Order[]>;
};

export function VisualTableGrid({ grouped, ordersByTable }: Props) {
  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <section key={group.restaurantId}>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              {group.restaurantName}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {group.city}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {group.tables.map((table) => (
              <VisualTableCard
                key={table.id}
                table={table}
                orders={ordersByTable.get(table.id) ?? []}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}