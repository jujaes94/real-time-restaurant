"use client";

import { useState } from "react";

import { Dialog } from "@/app/components/ui";
import { Button, Input } from "@/app/components/ui";
import type { MenuItem, MenuCategory } from "@/app/services/menuItems";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: MenuItem, quantity: number) => void;
  menuItems: MenuItem[];
};

const CATEGORY_ORDER: MenuCategory[] = ["plate", "appetizer", "side", "drink", "dessert", "other"];

export function AddOrderItemDialog({ open, onClose, onSubmit, menuItems }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");

  const filtered = categoryFilter === "all"
    ? menuItems
    : menuItems.filter((m) => m.category === categoryFilter);

  const selected = menuItems.find((m) => m.id === selectedId);

  function handleSubmit() {
    if (!selected || quantity < 1) return;
    onSubmit(selected, quantity);
    setSelectedId(null);
    setQuantity(1);
    setCategoryFilter("all");
  }

  function handleClose() {
    setSelectedId(null);
    setQuantity(1);
    setCategoryFilter("all");
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add item to order"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            disabled={!selected || quantity < 1}
            className="aurora-btn-primary disabled:opacity-50"
          >
            Add to order
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              categoryFilter === "all" ? "aurora-btn-primary" : "aurora-btn-ghost"
            }`}
          >
            All
          </button>
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                categoryFilter === cat ? "aurora-btn-primary" : "aurora-btn-ghost"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1.5">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-all ${
                selectedId === item.id
                  ? "bg-[var(--aurora-1)] bg-opacity-20 border border-[var(--aurora-1)]"
                  : "aurora-table-row hover:border-[var(--aurora-1)] border border-transparent"
              }`}
            >
              <div className="min-w-0">
                <p className="font-medium text-[var(--text-primary)] truncate">{item.name}</p>
                <p className="text-xs text-[var(--text-muted)] capitalize">{item.category}</p>
              </div>
              <span className="font-semibold text-[var(--aurora-1)] ml-3 whitespace-nowrap">
                ${item.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="aurora-form-group">
            <label className="aurora-label" htmlFor="itemQty">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="aurora-btn-ghost h-9 w-9 flex items-center justify-center p-0"
              >
                −
              </button>
              <Input
                id="itemQty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="aurora-btn-ghost h-9 w-9 flex items-center justify-center p-0"
              >
                +
              </button>
              <span className="text-sm text-[var(--text-muted)]">
                = <span className="font-semibold text-[var(--aurora-1)]">
                  ${(selected.price * quantity).toFixed(2)}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}