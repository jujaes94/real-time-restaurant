"use client";

import { useState } from "react";

import { Dialog } from "@/app/components/ui";
import { Button, Input } from "@/app/components/ui";
import type { MenuCategory } from "@/app/services/menuItems";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; category: MenuCategory; price: number; description: string }) => void;
};

const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: "plate", label: "Plate" },
  { value: "appetizer", label: "Appetizer" },
  { value: "side", label: "Side" },
  { value: "drink", label: "Drink" },
  { value: "dessert", label: "Dessert" },
  { value: "other", label: "Other" },
];

export function AddMenuItemDialog({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MenuCategory>("plate");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
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
    resetForm();
    setSubmitting(false);
  }

  function resetForm() {
    setName("");
    setCategory("plate");
    setPrice("");
    setDescription("");
  }

  function handleClose() {
    if (!submitting) {
      resetForm();
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add menu item"
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
            {submitting ? "Adding..." : "Add item"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="itemName">
            Name
          </label>
          <Input
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Grilled Salmon"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="itemCategory">
            Category
          </label>
          <select
            id="itemCategory"
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
          <label className="aurora-label" htmlFor="itemPrice">
            Price ($)
          </label>
          <Input
            id="itemPrice"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="24.00"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="itemDesc">
            Description
          </label>
          <Input
            id="itemDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Atlantic salmon with herbs and lemon butter sauce"
          />
        </div>
      </div>
    </Dialog>
  );
}