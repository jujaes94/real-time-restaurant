"use client";

import { useState, useTransition } from "react";

import { Badge, Can } from "@/app/components/ui";
import { useToast } from "@/app/contexts/ToastContext";
import {
  addOrderItem,
  updateOrderItemQuantity,
  removeOrderItem,
  markAwaitingPayment,
  markPaid,
  type Order,
  type OrderItem,
} from "@/app/services/orders";
import {
  type RestaurantTable,
  type TableStatus,
} from "@/app/services/tables";
import type { MenuItem } from "@/app/services/menuItems";
import { formatCurrency } from "@/app/lib/utils";

import { AddOrderItemDialog } from "./AddOrderItemDialog";

interface TableDetailClientProps {
  table: RestaurantTable;
  restaurantName: string;
  orders: Order[];
  menuItems: MenuItem[];
  orderItemsMap: Record<number, OrderItem[]>;
}

const STATUS_TONES: Record<TableStatus, Parameters<typeof Badge>[0]["tone"]> = {
  free: "success",
  occupied: "warning",
  awaiting_payment: "info",
  closed: "neutral",
};

const ORDER_STATUS_TONES: Record<
  Order["status"],
  Parameters<typeof Badge>[0]["tone"]
> = {
  open: "warning",
  awaiting_payment: "info",
  paid: "success",
  cancelled: "neutral",
};

export function TableDetailClient({
  table,
  restaurantName,
  orders,
  menuItems,
  orderItemsMap: initialOrderItemsMap,
}: TableDetailClientProps) {
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [orderItemsMap, setOrderItemsMap] = useState(initialOrderItemsMap);
  const [addItemTarget, setAddItemTarget] = useState<Order | null>(null);

  const visibleOrders = orders.filter((o) => o.status !== "paid");

  function orderTotal(orderId: number) {
    const items = orderItemsMap[orderId] ?? [];
    return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }

  function handleAddItemToOrder(order: Order, item: MenuItem, quantity: number) {
    startTransition(async () => {
      await addOrderItem(order.id, item.id, item.name, quantity, item.price);
      setOrderItemsMap((prev) => ({
        ...prev,
        [order.id]: [
          ...(prev[order.id] ?? []).filter((i) => i.menuItemId !== item.id),
          {
            orderId: order.id,
            menuItemId: item.id,
            menuItemName: item.name,
            quantity: quantity,
            unitPrice: item.price,
          },
        ],
      }));
      push(`Added ${quantity}× ${item.name} to order #${order.id}`, "success");
    });
    setAddItemTarget(null);
  }

  function handleRemoveItem(order: Order, menuItemId: number, menuItemName: string) {
    startTransition(async () => {
      await removeOrderItem(order.id, menuItemId);
      setOrderItemsMap((prev) => ({
        ...prev,
        [order.id]: (prev[order.id] ?? []).filter((i) => i.menuItemId !== menuItemId),
      }));
      push(`Removed ${menuItemName} from order #${order.id}`, "success");
    });
  }

  function handleUpdateQuantity(order: Order, item: OrderItem, newQty: number) {
    if (newQty < 1) {
      handleRemoveItem(order, item.menuItemId, item.menuItemName);
      return;
    }
    startTransition(async () => {
      await updateOrderItemQuantity(order.id, item.menuItemId, newQty);
      setOrderItemsMap((prev) => ({
        ...prev,
        [order.id]: (prev[order.id] ?? []).map((i) =>
          i.menuItemId === item.menuItemId ? { ...i, quantity: newQty } : i,
        ),
      }));
    });
  }

  function handleAwaitingPayment(order: Order) {
    startTransition(async () => {
      const updated = await markAwaitingPayment(order.id);
      if (updated) push(`Order #${order.id} pending payment`, "success");
    });
  }

  function handleMarkPaid(order: Order) {
    startTransition(async () => {
      const updated = await markPaid(order.id);
      if (updated) push(`Order #${order.id} paid`, "success");
    });
  }

  return (
    <>
      <div className="mt-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <section className="aurora-card p-6">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {restaurantName}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {table.label} · {table.seats} seats
              </p>
            </div>
            <Badge tone={STATUS_TONES[table.status]}>
              {table.status.replace("_", " ")}
            </Badge>
          </header>
        </section>

        <section className="aurora-card p-6 col-span-1 lg:col-span-2 xl:col-span-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Active orders
          </h2>
          {visibleOrders.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--text-muted)]">No active orders for this table.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {visibleOrders.map((order) => {
                const items = orderItemsMap[order.id] ?? [];
                return (
                  <li
                    key={order.id}
                    className="border border-[var(--glass-border)] rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          by {order.createdBy} · {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={ORDER_STATUS_TONES[order.status]}>
                          {order.status.replace("_", " ")}
                        </Badge>
                        <Can action="markAwaitingPayment">
                          {order.status === "open" && (
                            <button
                              onClick={() => handleAwaitingPayment(order)}
                              disabled={pending}
                              className="aurora-btn-ghost text-xs py-1.5"
                            >
                              Request payment
                            </button>
                          )}
                        </Can>
                        <Can action="markPaid">
                          {order.status === "awaiting_payment" && (
                            <button
                              onClick={() => handleMarkPaid(order)}
                              disabled={pending}
                              className="aurora-btn-primary text-xs py-1.5"
                            >
                              Mark paid
                            </button>
                          )}
                        </Can>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {items.length === 0 && (
                        <p className="text-xs text-[var(--text-muted)] py-1">No items yet.</p>
                      )}
                      {items.map((item) => (
                        <div key={item.menuItemId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="flex items-center gap-1 border border-[var(--glass-border)] rounded">
                              <button
                                onClick={() => handleUpdateQuantity(order, item, item.quantity - 1)}
                                className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] rounded-l"
                              >
                                −
                              </button>
                              <span className="px-2 text-sm font-medium min-w-[2rem] text-center text-[var(--text-primary)]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(order, item, item.quantity + 1)}
                                className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] rounded-r"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm text-[var(--text-secondary)] truncate">
                              {item.menuItemName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 ml-3">
                            <span className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(order, item.menuItemId, item.menuItemName)}
                              className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                              aria-label={`Remove ${item.menuItemName}`}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border)]">
                      <Can action="addOrder">
                        {order.status === "open" && (
                          <button
                            onClick={() => setAddItemTarget(order)}
                            className="aurora-btn-ghost text-xs py-1.5 flex items-center gap-1.5"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add item
                          </button>
                        )}
                      </Can>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        Total: {formatCurrency(orderTotal(order.id))}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <AddOrderItemDialog
        open={addItemTarget !== null}
        onClose={() => setAddItemTarget(null)}
        onSubmit={(item, quantity) => {
          if (addItemTarget) handleAddItemToOrder(addItemTarget, item, quantity);
        }}
        menuItems={menuItems}
      />
    </>
  );
}