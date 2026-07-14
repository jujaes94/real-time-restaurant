"use client";

import { useState, useTransition } from "react";

import { Badge, Button, Can } from "@/app/components/ui";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/contexts/ToastContext";
import {
  createTable,
  deleteTable,
  renameTable,
  setTableStatus,
  type RestaurantTable,
  type TableStatus,
} from "@/app/services/tables";

import type { GroupedTables } from "./TablesPage";
import { AddTableForm } from "./AddTableForm";
import { RenameTableForm } from "./RenameTableForm";

const STATUS_LABELS: Record<TableStatus, string> = {
  free: "Free",
  occupied: "Occupied",
  awaiting_payment: "Awaiting payment",
  closed: "Closed",
};

const STATUS_TONES: Record<TableStatus, Parameters<typeof Badge>[0]["tone"]> = {
  free: "success",
  occupied: "warning",
  awaiting_payment: "info",
  closed: "neutral",
};

const STATUS_OPTIONS: TableStatus[] = [
  "free",
  "occupied",
  "awaiting_payment",
  "closed",
];

export function TableBoard({ grouped }: { grouped: GroupedTables[] }) {
  const { user } = useAuth();
  const { push } = useToast();
  const [, startTransition] = useTransition();
  const [editing, setEditing] = useState<number | null>(null);

  function handleStatusChange(table: RestaurantTable, status: TableStatus) {
    startTransition(async () => {
      const updated = await setTableStatus(table.id, status);
      if (updated) push(`${table.label} → ${STATUS_LABELS[status]}`, "success");
    });
  }

  function handleDelete(table: RestaurantTable) {
    startTransition(async () => {
      const result = await deleteTable(table.id);
      if (result.ok) {
        push(`Removed ${table.label}`, "success");
      } else {
        push(`Cannot delete ${table.label}: close its order first`, "error");
      }
    });
  }

  function handleRename(table: RestaurantTable, label: string) {
    startTransition(async () => {
      const updated = await renameTable(table.id, label);
      if (updated) {
        push(`Renamed to ${updated.label}`, "success");
        setEditing(null);
      }
    });
  }

  function handleCreate(restaurantId: number, label: string, seats: number) {
    startTransition(async () => {
      const created = await createTable({ restaurantId, label, seats });
      push(`Added ${created.label}`, "success");
    });
  }

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <section
          key={group.restaurantId}
          className="rounded-lg bg-white p-4 shadow dark:bg-gray-700"
        >
          <header className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {group.restaurantName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {group.city}
              </p>
            </div>
            <Can action="createTable">
              <AddTableForm
                restaurantId={group.restaurantId}
                onCreate={(label, seats) =>
                  handleCreate(group.restaurantId, label, seats)
                }
              />
            </Can>
          </header>
          <ul className="divide-y divide-gray-200 dark:divide-gray-600">
            {group.tables.length === 0 ? (
              <li className="py-3 text-sm text-gray-500">No tables yet</li>
            ) : null}
            {group.tables.map((table) => {
              const isEditing = editing === table.id;
              return (
                <li
                  key={table.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <span className="w-16 font-mono text-sm text-gray-700 dark:text-gray-200">
                    {table.label}
                  </span>
                  {isEditing ? (
                    <RenameTableForm
                      initial={table.label}
                      onCancel={() => setEditing(null)}
                      onSubmit={(label) => handleRename(table, label)}
                    />
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Seats: {table.seats}
                    </span>
                  )}
                  <Badge tone={STATUS_TONES[table.status]}>
                    {STATUS_LABELS[table.status]}
                  </Badge>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <Can action="setTableStatus">
                      <select
                        aria-label={`Status for ${table.label}`}
                        value={table.status}
                        onChange={(e) =>
                          handleStatusChange(
                            table,
                            e.target.value as TableStatus,
                          )
                        }
                        className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </Can>
                    <a
                      href={`/tables/${table.id}`}
                      className="inline-flex h-9 items-center rounded-md bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Open
                    </a>
                    <Can action="renameTable">
                      {isEditing ? null : (
                        <Button
                          variant="secondary"
                          onClick={() => setEditing(table.id)}
                        >
                          Rename
                        </Button>
                      )}
                    </Can>
                    <Can action="deleteTable">
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(table)}
                      >
                        Delete
                      </Button>
                    </Can>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      {user ? null : (
        <p className="text-sm text-gray-500">Sign in to view tables.</p>
      )}
    </div>
  );
}
