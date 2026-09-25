"use client";

import { useState } from "react";

import { useAuth } from "@/shared/contexts/AuthContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { can } from "@/shared/services/roles";
import {
  createRestaurant,
  deleteRestaurant,
  updateRestaurant,
  type Restaurant,
} from "@/shared/services/restaurants";
import type { Waitress } from "@/features/staff/waitresses";
import type { LegacyMenuItem as MenuItem } from "@/features/menu/menuItems";

import { RestaurantFormDialog } from "./RestaurantFormDialog";
import { DeleteRestaurantDialog } from "./DeleteRestaurantDialog";

type Props = {
  restaurants: Restaurant[];
  staffByRestaurant: Map<number, Waitress[]>;
  menuByRestaurant: Map<number, MenuItem[]>;
};

export function RestaurantListClient({
  restaurants: initial,
  staffByRestaurant,
  menuByRestaurant,
}: Props) {
  const { user } = useAuth();
  const { push } = useToast();
  const [restaurants, setRestaurants] = useState(initial);
  const [editTarget, setEditTarget] = useState<Restaurant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Restaurant | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const visible = user?.restaurantId
    ? restaurants.filter((r) => String(r.id) === user.restaurantId)
    : restaurants;

  if (!can(user?.role, "view:restaurants")) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        You do not have access to this page.
      </p>
    );
  }

  async function handleCreate(data: { name: string; address: string; phone: string }) {
    const created = await createRestaurant({ ...data, isActive: true });
    setRestaurants((prev) => [...prev, created]);
    setCreateOpen(false);
    push(`Created ${created.name}`, "success");
  }

  async function handleEdit(data: { name: string; address: string; phone: string }) {
    if (!editTarget) return;
    const updated = await updateRestaurant(editTarget.id, data);
    if (updated) {
      setRestaurants((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
      push(`Updated ${updated.name}`, "success");
    }
    setEditTarget(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteRestaurant(deleteTarget.id);
    setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    push(`Deleted ${deleteTarget.name}`, "success");
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="aurora-page-header">
        <div>
          <h1 className="aurora-page-title">Restaurants</h1>
          <p className="aurora-section-subtitle">
            {visible.length} restaurant{visible.length !== 1 ? "s" : ""}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setCreateOpen(true)}
            className="aurora-btn-primary flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add restaurant
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="aurora-card p-8 text-center">
          <p className="text-[var(--text-muted)]">No restaurants yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((restaurant) => {
            const staff = staffByRestaurant.get(restaurant.id) ?? [];
            const menuItems = menuByRestaurant.get(restaurant.id) ?? [];
            return (
              <div key={restaurant.id} className="aurora-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {restaurant.address}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{restaurant.phone}</p>
                  </div>
                  {!restaurant.isActive && (
                    <span className="aurora-badge aurora-badge-closed text-xs">Inactive</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span>{staff.length} staff</span>
                  <span>{menuItems.length} menu items</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <a
                    href={`/restaurants/${restaurant.id}`}
                    className="aurora-btn-primary text-sm"
                  >
                    Manage
                  </a>
                  {(isAdmin || String(restaurant.id) === user?.restaurantId) && (
                    <>
                      <button
                        onClick={() => setEditTarget(restaurant)}
                        className="aurora-btn-ghost text-sm"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteTarget(restaurant)}
                          className="aurora-btn-danger text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RestaurantFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        title="Add restaurant"
      />

      <RestaurantFormDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        title="Edit restaurant"
        initial={editTarget ?? undefined}
      />

      <DeleteRestaurantDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        restaurantName={deleteTarget?.name ?? ""}
      />
    </>
  );
}
