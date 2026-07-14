"use client";

import { useState } from "react";

import { useAuth } from "@/shared/contexts/AuthContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { can } from "@/shared/services/roles";
import {
  addWaitress,
  deleteWaitress,
  type Waitress,
} from "@/features/staff/waitresses";
import type { Restaurant } from "@/shared/services/restaurants";

import { AddWaitressDialog } from "./AddWaitressDialog";
import { DeleteWaitressDialog } from "./DeleteWaitressDialog";

type Props = {
  initialWaitresses: Waitress[];
  restaurants: Restaurant[];
};

export function WaitressPage({ initialWaitresses, restaurants }: Props) {
  const { user } = useAuth();
  const { push } = useToast();
  const [waitresses, setWaitresses] = useState(initialWaitresses);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Waitress | null>(null);

  if (!can(user?.role, "view:staff")) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        You do not have access to this page.
      </p>
    );
  }

  async function handleAdd(form: { fullName: string; restaurantId: number; workingHours: string }) {
    const created = await addWaitress(form);
    setWaitresses((prev) => [...prev, created]);
    setAddOpen(false);
    push(`Added ${created.fullName}`, "success");
  }

  async function handleDelete(waitress: Waitress) {
    await deleteWaitress(waitress.id);
    setWaitresses((prev) => prev.filter((w) => w.id !== waitress.id));
    setDeleteTarget(null);
    push(`Removed ${waitress.fullName}`, "success");
  }

  return (
    <>
      <div className="aurora-page-header">
        <div>
          <h1 className="aurora-page-title">Waitresses</h1>
          <p className="aurora-section-subtitle">
            {waitresses.length} waitress{waitresses.length !== 1 ? "es" : ""} across all locations
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="aurora-btn-primary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add waitress
        </button>
      </div>

      {waitresses.length === 0 ? (
        <div className="aurora-card p-8 text-center">
          <p className="text-[var(--text-muted)]">No waitresses yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {waitresses.map((w) => {
            const restaurant = restaurants.find((r) => r.id === w.restaurantId);
            return (
              <div key={w.id} className="aurora-table-row">
                <div className="aurora-avatar">
                  {w.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] truncate">{w.fullName}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {restaurant?.name ?? "Unknown restaurant"} · {w.workingHours}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(w)}
                  className="aurora-btn-danger flex items-center gap-1.5 ml-4"
                  aria-label={`Delete ${w.fullName}`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}

      <AddWaitressDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        restaurants={restaurants}
      />
      <DeleteWaitressDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
        }}
        waitressName={deleteTarget?.fullName ?? ""}
      />
    </>
  );
}