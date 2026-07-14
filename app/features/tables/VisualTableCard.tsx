"use client";

import Link from "next/link";

import { Badge } from "@/app/components/ui";
import type { RestaurantTable, TableStatus } from "@/app/services/tables";
import type { Order } from "@/app/services/orders";
import { formatCurrency } from "@/app/lib/utils";

type Props = {
  table: RestaurantTable;
  orders: Order[];
};

const STATUS_CONFIG: Record<
  TableStatus,
  { label: string; dot: string }
> = {
  free: {
    label: "Free",
    dot: "var(--success)",
  },
  occupied: {
    label: "Occupied",
    dot: "var(--warning)",
  },
  awaiting_payment: {
    label: "Awaiting Payment",
    dot: "var(--info)",
  },
  closed: {
    label: "Closed",
    dot: "var(--text-muted)",
  },
};

export function VisualTableCard({ table, orders }: Props) {
  const cfg = STATUS_CONFIG[table.status];
  const activeOrders = orders.filter(
    (o) => o.status === "open" || o.status === "awaiting_payment",
  );

  return (
    <div className="aurora-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: cfg.dot }}
          />
          <Badge tone="neutral" className="text-xs capitalize">
            {cfg.label}
          </Badge>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {table.seats} seats
        </span>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="relative">
          <svg
            viewBox="0 0 80 48"
            className="h-16 w-24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="12"
              width="72"
              height="32"
              rx="4"
              className="fill-gray-200 dark:fill-gray-700"
            />
            <rect
              x="8"
              y="8"
              width="64"
              height="28"
              rx="3"
              className="fill-gray-100 dark:fill-gray-600"
            />
            {activeOrders.length === 0 && (
              <circle
                cx="40"
                cy="22"
                r="6"
                className="fill-gray-300 dark:fill-gray-500"
              />
            )}
            {activeOrders.length > 0 && (
              <>
                <circle
                  cx="30"
                  cy="22"
                  r="5"
                  fill="var(--warning)"
                  opacity="0.6"
                />
                <circle
                  cx="50"
                  cy="22"
                  r="5"
                  fill="var(--warning)"
                  opacity="0.6"
                />
              </>
            )}
          </svg>
          <span className="absolute inset-0 flex items-center justify-center pt-4 font-mono text-sm font-semibold text-[var(--text-primary)]">
            {table.label}
          </span>
        </div>
      </div>

      {activeOrders.length > 0 ? (
        <div className="space-y-1 border-t border-[var(--glass-border)] pt-2 text-xs">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between"
            >
              <span className="text-[var(--text-muted)]">
                Order #{order.id}
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {formatCurrency(order.total)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-1 text-sm font-medium">
            <span className="text-[var(--text-secondary)]">Total</span>
            <span className="text-[var(--text-primary)]">
              {formatCurrency(
                activeOrders.reduce((sum, o) => sum + o.total, 0),
              )}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-xs text-[var(--text-muted)] text-center py-1">
          No active orders
        </p>
      )}

      <Link
        href={`/tables/${table.id}`}
        className="flex h-8 w-full items-center justify-center rounded-lg text-sm font-medium aurora-btn-primary"
      >
        {activeOrders.length > 0 ? "View order" : "Open"}
      </Link>
    </div>
  );
}