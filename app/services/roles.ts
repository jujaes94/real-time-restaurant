export type Role = "admin" | "manager" | "waitress";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  waitress: "Waitress",
};

export type Action =
  | "view:dashboard"
  | "view:salesSummary"
  | "view:tables"
  | "view:settings"
  | "view:staff"
  | "view:menu"
  | "createTable"
  | "deleteTable"
  | "renameTable"
  | "setTableStatus"
  | "addOrder"
  | "markAwaitingPayment"
  | "markPaid";

const MATRIX: Record<Role, ReadonlySet<Action>> = {
  admin: new Set<Action>([
    "view:dashboard",
    "view:salesSummary",
    "view:tables",
    "view:settings",
    "view:staff",
    "view:menu",
    "createTable",
    "deleteTable",
    "renameTable",
    "setTableStatus",
    "addOrder",
    "markAwaitingPayment",
    "markPaid",
  ]),
  manager: new Set<Action>([
    "view:dashboard",
    "view:salesSummary",
    "view:tables",
    "view:menu",
    "createTable",
    "deleteTable",
    "renameTable",
    "setTableStatus",
    "addOrder",
    "markAwaitingPayment",
    "markPaid",
  ]),
  waitress: new Set<Action>([
    "view:dashboard",
    "view:tables",
    "setTableStatus",
    "addOrder",
    "markAwaitingPayment",
  ]),
};

export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false;
  return MATRIX[role].has(action);
}
