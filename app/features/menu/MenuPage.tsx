"use client";

import { useState } from "react";

import { Badge } from "@/app/components/ui";
import { useToast } from "@/app/contexts/ToastContext";
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuCategory,
  type MenuItem,
} from "@/app/services/menuItems";
import { formatCurrency } from "@/app/lib/utils";

import { AddMenuItemDialog } from "./AddMenuItemDialog";
import { DeleteMenuItemDialog } from "./DeleteMenuItemDialog";
import { EditMenuItemDialog } from "./EditMenuItemDialog";

type Props = {
  initialItems: MenuItem[];
};

const CATEGORIES: { value: MenuCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "plate", label: "Plates" },
  { value: "appetizer", label: "Appetizers" },
  { value: "side", label: "Sides" },
  { value: "drink", label: "Drinks" },
  { value: "dessert", label: "Desserts" },
  { value: "other", label: "Other" },
];

const CATEGORY_BADGE_TONE: Record<MenuCategory, "success" | "info" | "warning" | "danger" | "neutral"> = {
  plate: "success",
  appetizer: "info",
  side: "info",
  drink: "warning",
  dessert: "neutral",
  other: "neutral",
};

export function MenuPage({ initialItems }: Props) {
  const { push } = useToast();
  const [items, setItems] = useState(initialItems);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  const filtered = activeCategory === "all"
    ? items
    : items.filter((i) => i.category === activeCategory);

  async function handleAdd(form: { name: string; category: MenuCategory; price: number; description: string }) {
    const created = await addMenuItem(form);
    setItems((prev) => [...prev, created]);
    setAddOpen(false);
    push(`Added ${created.name}`, "success");
  }

  async function handleEdit(item: MenuItem, form: { name: string; category: MenuCategory; price: number; description: string }) {
    const updated = await updateMenuItem(item.id, form);
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      setEditTarget(null);
      push(`Updated ${updated.name}`, "success");
    }
  }

  async function handleDelete(item: MenuItem) {
    await deleteMenuItem(item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setDeleteTarget(null);
    push(`Removed ${item.name}`, "success");
  }

  return (
    <>
      <div className="aurora-page-header">
        <div>
          <h1 className="aurora-page-title">Menu</h1>
          <p className="aurora-section-subtitle">
            {items.length} item{items.length !== 1 ? "s" : ""} across all categories
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="aurora-btn-primary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add item
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const count = cat.value === "all" ? items.length : items.filter((i) => i.category === cat.value).length;
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "aurora-btn-primary"
                  : "aurora-btn-ghost"
              }`}
            >
              {cat.label}
              <span className={`ml-1.5 text-xs ${isActive ? "opacity-80" : "opacity-60"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="aurora-card p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">No items in this category. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="aurora-card p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">
                    {item.name}
                  </h3>
                  <Badge tone={CATEGORY_BADGE_TONE[item.category]} className="mt-1 capitalize text-xs">
                    {item.category}
                  </Badge>
                </div>
                <span className="font-bold text-[var(--aurora-1)] text-lg whitespace-nowrap">
                  {formatCurrency(item.price)}
                </span>
              </div>
              {item.description && (
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 flex-1">
                  {item.description}
                </p>
              )}
              <div className="flex gap-2 pt-2 border-t border-[var(--card-border)]">
                <button
                  onClick={() => setEditTarget(item)}
                  className="flex-1 aurora-btn-ghost text-xs py-1.5 flex items-center justify-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="flex-1 aurora-btn-danger text-xs py-1.5 flex items-center justify-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMenuItemDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />
      <EditMenuItemDialog
        key={editTarget?.id}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={(form) => {
          if (editTarget) handleEdit(editTarget, form);
        }}
        item={editTarget}
      />
      <DeleteMenuItemDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
        }}
        itemName={deleteTarget?.name ?? ""}
      />
    </>
  );
}