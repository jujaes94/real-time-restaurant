import {
  type RestaurantTable,
  setTableStatus,
} from "./tables";

export type OrderStatus =
  | "open"
  | "awaiting_payment"
  | "paid"
  | "cancelled";

export interface Order {
  id: number;
  tableId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  createdBy: string;
}

export interface OrderItem {
  orderId: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
}

let nextOrderId = 100;

const ORDERS: Order[] = [
  {
    id: nextOrderId++,
    tableId: 2,
    status: "open",
    total: 52,
    createdAt: new Date().toISOString(),
    createdBy: "waitress@demo.com",
  },
  {
    id: nextOrderId++,
    tableId: 4,
    status: "open",
    total: 36,
    createdAt: new Date().toISOString(),
    createdBy: "waitress@demo.com",
  },
  {
    id: nextOrderId++,
    tableId: 5,
    status: "awaiting_payment",
    total: 80,
    createdAt: new Date().toISOString(),
    createdBy: "manager@demo.com",
  },
];

const ORDER_ITEMS: OrderItem[] = [
  { orderId: 100, menuItemId: 1, menuItemName: "Grilled Salmon", quantity: 1, unitPrice: 24 },
  { orderId: 100, menuItemId: 6, menuItemName: "Bruschetta", quantity: 2, unitPrice: 8 },
  { orderId: 100, menuItemId: 8, menuItemName: "Sparkling Water", quantity: 1, unitPrice: 4 },
  { orderId: 101, menuItemId: 2, menuItemName: "Beef Tenderloin", quantity: 1, unitPrice: 32 },
  { orderId: 101, menuItemId: 8, menuItemName: "Sparkling Water", quantity: 1, unitPrice: 4 },
  { orderId: 102, menuItemId: 3, menuItemName: "Chicken Parmesan", quantity: 2, unitPrice: 18 },
  { orderId: 102, menuItemId: 9, menuItemName: "House Red Wine", quantity: 2, unitPrice: 8 },
  { orderId: 102, menuItemId: 14, menuItemName: "Tiramisu", quantity: 2, unitPrice: 9 },
];

function recalculateOrderTotal(orderId: number) {
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return;
  order.total = ORDER_ITEMS.filter((i) => i.orderId === orderId).reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0,
  );
}

export async function getOrdersForTable(tableId: number): Promise<Order[]> {
  return ORDERS.filter((o) => o.tableId === tableId);
}

export async function hasOpenOrder(tableId: number): Promise<boolean> {
  return ORDERS.some(
    (o) =>
      o.tableId === tableId && (o.status === "open" || o.status === "awaiting_payment"),
  );
}

export async function addOrder(
  tableId: number,
  total: number,
  createdBy: string,
): Promise<Order> {
  const order: Order = {
    id: nextOrderId++,
    tableId,
    status: "open",
    total: Number.isFinite(total) ? Math.max(0, Math.round(total)) : 0,
    createdAt: new Date().toISOString(),
    createdBy,
  };
  ORDERS.push(order);
  await setTableStatus(tableId, "occupied");
  return order;
}

export async function markAwaitingPayment(
  orderId: number,
): Promise<Order | undefined> {
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return undefined;
  order.status = "awaiting_payment";
  await setTableStatus(order.tableId, "awaiting_payment");
  return order;
}

export async function markPaid(
  orderId: number,
): Promise<Order | undefined> {
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return undefined;
  order.status = "paid";
  await setTableStatus(order.tableId, "closed");
  return order;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  return ORDER_ITEMS.filter((i) => i.orderId === orderId);
}

export async function addOrderItem(
  orderId: number,
  menuItemId: number,
  menuItemName: string,
  quantity: number,
  unitPrice: number,
): Promise<OrderItem> {
  const existing = ORDER_ITEMS.find(
    (i) => i.orderId === orderId && i.menuItemId === menuItemId,
  );
  if (existing) {
    existing.quantity += quantity;
    recalculateOrderTotal(orderId);
    return existing;
  }
  const item: OrderItem = { orderId, menuItemId, menuItemName, quantity, unitPrice };
  ORDER_ITEMS.push(item);
  recalculateOrderTotal(orderId);
  return item;
}

export async function updateOrderItemQuantity(
  orderId: number,
  menuItemId: number,
  quantity: number,
): Promise<OrderItem | undefined> {
  const item = ORDER_ITEMS.find(
    (i) => i.orderId === orderId && i.menuItemId === menuItemId,
  );
  if (!item) return undefined;
  if (quantity <= 0) {
    const idx = ORDER_ITEMS.findIndex(
      (i) => i.orderId === orderId && i.menuItemId === menuItemId,
    );
    if (idx !== -1) ORDER_ITEMS.splice(idx, 1);
    recalculateOrderTotal(orderId);
    return undefined;
  }
  item.quantity = quantity;
  recalculateOrderTotal(orderId);
  return item;
}

export async function removeOrderItem(
  orderId: number,
  menuItemId: number,
): Promise<void> {
  const idx = ORDER_ITEMS.findIndex(
    (i) => i.orderId === orderId && i.menuItemId === menuItemId,
  );
  if (idx !== -1) ORDER_ITEMS.splice(idx, 1);
  recalculateOrderTotal(orderId);
}

interface OrderCounters {
  open: number;
  awaitingPayment: number;
  paid: number;
  totalSales: number;
}

export async function getOrderCounters(): Promise<OrderCounters> {
  return ORDERS.reduce<OrderCounters>(
    (acc, o) => {
      if (o.status === "open") acc.open += 1;
      if (o.status === "awaiting_payment") acc.awaitingPayment += 1;
      if (o.status === "paid") {
        acc.paid += 1;
        acc.totalSales += o.total;
      }
      return acc;
    },
    { open: 0, awaitingPayment: 0, paid: 0, totalSales: 0 },
  );
}

export type { RestaurantTable };
