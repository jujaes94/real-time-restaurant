"use client";

import { useState } from "react";

import { Dialog } from "@/app/components/ui";
import { Button, Input } from "@/app/components/ui";
import type { MenuCategory, MenuItem } from "@/app/services/menuItems";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: MenuCategory; price: number; description: string }) => void;
  item: MenuItem | null;
};

const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: "plate", label: "Plate" },
  { value: "appetizer", label: "Appetizer" },
  { value: "side", label: "Side" },
  { value: "drink", label: "Drink" },
  { value: "dessert", label: "Dessert" },
  { value: "other", label: "Other" },
];

export function EditMenuItemDialog({ open, onClose, onSubmit, item }: Props) {
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<MenuCategory>(item?.category ?? "plate");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    if (!name.trim() || !price) return;
    const priceNum = parseFloat(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) return;
    setSubmitting(true);
    onSubmit({
      name: name.trim(),
      category,
      price: Math.round(priceNum * 100) / 100,
      description: description.trim(),
    });
    setSubmitting(false);
  }

  function handleClose() {
    if (!submitting) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={`Edit ${item?.name ?? "item"}`}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !price}
            className="aurora-btn-primary disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="editItemName">
            Name
          </label>
          <Input
            id="editItemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Grilled Salmon"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="editItemCategory">
            Category
          </label>
          <select
            id="editItemCategory"
            className="aurora-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as MenuCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="editItemPrice">
            Price ($)
          </label>
          <Input
            id="editItemPrice"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="24.00"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="editItemDesc">
            Description
          </label>
          <Input
            id="editItemDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Atlantic salmon with herbs and lemon butter sauce"
          />
        </div>
      </div>
    </Dialog>
  );
}