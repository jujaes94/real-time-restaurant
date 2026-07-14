export type TableStatus =
  | "free"
  | "occupied"
  | "awaiting_payment"
  | "closed";

export interface RestaurantTable {
  id: number;
  restaurantId: number;
  label: string;
  seats: number;
  status: TableStatus;
}

const TABLES: RestaurantTable[] = [
  { id: 1, restaurantId: 1, label: "T1", seats: 2, status: "free" },
  { id: 2, restaurantId: 1, label: "T2", seats: 4, status: "occupied" },
  { id: 3, restaurantId: 1, label: "T3", seats: 6, status: "free" },
  { id: 4, restaurantId: 2, label: "T1", seats: 2, status: "occupied" },
  { id: 5, restaurantId: 2, label: "T2", seats: 4, status: "awaiting_payment" },
  { id: 6, restaurantId: 2, label: "T3", seats: 6, status: "free" },
  { id: 7, restaurantId: 3, label: "T1", seats: 2, status: "free" },
  { id: 8, restaurantId: 3, label: "T2", seats: 4, status: "occupied" },
  { id: 9, restaurantId: 3, label: "T3", seats: 6, status: "free" },
];

export async function getTables(): Promise<RestaurantTable[]> {
  return TABLES;
}

export async function getTable(id: number): Promise<RestaurantTable | undefined> {
  return TABLES.find((t) => t.id === id);
}

export interface CreateTableInput {
  restaurantId: number;
  label: string;
  seats: number;
}

let nextId = TABLES.length + 1;

export async function createTable(
  input: CreateTableInput,
): Promise<RestaurantTable> {
  const table: RestaurantTable = {
    id: nextId++,
    restaurantId: input.restaurantId,
    label: input.label.trim() || `T${nextId}`,
    seats: Math.max(1, input.seats | 0),
    status: "free",
  };
  TABLES.push(table);
  return table;
}

export type DeleteTableResult =
  | { ok: true }
  | { ok: false; reason: "has_open_order" };

export async function deleteTable(id: number): Promise<DeleteTableResult> {
  const { hasOpenOrder } = await import("@/features/orders/orders");
  if (await hasOpenOrder(id)) {
    return { ok: false, reason: "has_open_order" };
  }
  const idx = TABLES.findIndex((t) => t.id === id);
  if (idx === -1) return { ok: false, reason: "has_open_order" };
  TABLES.splice(idx, 1);
  return { ok: true };
}

export async function renameTable(
  id: number,
  label: string,
): Promise<RestaurantTable | undefined> {
  const table = TABLES.find((t) => t.id === id);
  if (!table) return undefined;
  const trimmed = label.trim();
  if (trimmed) table.label = trimmed;
  return table;
}

export async function setTableStatus(
  id: number,
  status: TableStatus,
): Promise<RestaurantTable | undefined> {
  const table = TABLES.find((t) => t.id === id);
  if (!table) return undefined;
  table.status = status;
  return table;
}
