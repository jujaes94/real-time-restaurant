"use client";

import { useState } from "react";

import { useAuth } from "@/shared/contexts/AuthContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { can } from "@/shared/services/roles";
import { updateRestaurant, type Restaurant } from "@/shared/services/restaurants";
import type { Waitress } from "@/features/staff/waitresses";
import type { LegacyMenuItem as MenuItem } from "@/features/menu/menuItems";

import { RestaurantFormDialog } from "./RestaurantFormDialog";
import { AssignStaffDialog } from "./AssignStaffDialog";

type Props = {
  restaurant: Restaurant;
  staff: Waitress[];
  allWaitresses: Waitress[];
  menuItems: MenuItem[];
};

export function RestaurantDetailClient({ restaurant, staff, allWaitresses, menuItems }: Props) {
  const { user } = useAuth();
  const { push } = useToast();
  const [current, setCurrent] = useState(restaurant);
  const [currentStaff, setCurrentStaff] = useState(staff);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [tab, setTab] = useState<"staff" | "menu">("staff");

  const isAdmin = user?.role === "admin";
  const isOwn = String(restaurant.id) === user?.restaurantId;
  const canEdit = isAdmin || isOwn;

  const unassignedWaitresses = allWaitresses.filter(
    (w) => !currentStaff.some((s) => s.id === w.id),
  );

  async function handleEdit(data: { name: string; address: string; phone: string }) {
    const updated = await updateRestaurant(current.id, data);
    if (updated) {
      setCurrent(updated);
      push(`Updated ${updated.name}`, "success");
    }
    setEditOpen(false);
  }

  function handleAssign(waitress: Waitress) {
    setCurrentStaff((prev) => [...prev, { ...waitress, restaurantId: current.id }]);
    setAssignOpen(false);
    push(`Assigned ${waitress.fullName}`, "success");
  }

  if (!can(user?.role, "view:restaurants")) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        You do not have access to this page.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="aurora-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{current.name}</h1>
            <p className="text-sm text-[var(--text-muted)]">{current.address}</p>
            <p className="text-sm text-[var(--text-muted)]">{current.phone}</p>
          </div>
          {canEdit && (
            <button onClick={() => setEditOpen(true)} className="aurora-btn-ghost text-sm">
              Edit info
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b border-[var(--border)]">
        <button
          onClick={() => setTab("staff")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "staff"
              ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Staff ({currentStaff.length})
        </button>
        <button
          onClick={() => setTab("menu")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "menu"
              ? "border-b-2 border-[var(--accent)] text-[var(--accent)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Menu ({menuItems.length})
        </button>
      </div>

      {tab === "staff" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">Assigned staff</p>
            {canEdit && unassignedWaitresses.length > 0 && (
              <button
                onClick={() => setAssignOpen(true)}
                className="aurora-btn-primary text-sm flex items-center gap-1"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Assign staff
              </button>
            )}
          </div>
          {currentStaff.length === 0 ? (
            <div className="aurora-card p-8 text-center">
              <p className="text-[var(--text-muted)]">No staff assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentStaff.map((w) => (
                <div key={w.id} className="aurora-table-row">
                  <div className="aurora-avatar">
                    {w.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{w.fullName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{w.workingHours}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "menu" && (
        <div>
          {menuItems.length === 0 ? (
            <div className="aurora-card p-8 text-center">
              <p className="text-[var(--text-muted)]">No menu items for this restaurant.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Add menu items from the{" "}
                <a href="/menu" className="underline hover:text-[var(--accent)]">
                  Menu page
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <div key={item.id} className="aurora-card p-4 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-[var(--text-primary)]">{item.name}</h4>
                    <span className="text-sm font-semibold text-[var(--accent)]">
                      ${item.price}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {item.description}
                  </p>
                  <span className="text-xs text-[var(--text-muted)] capitalize mt-1">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <RestaurantFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        title="Edit restaurant"
        initial={current}
      />

      <AssignStaffDialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        onAssign={handleAssign}
        waitresses={unassignedWaitresses}
      />
    </div>
  );
}
