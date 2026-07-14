"use client";

import { useState } from "react";

import { Dialog } from "@/app/components/ui";
import { Button, Input } from "@/app/components/ui";
import type { Restaurant } from "@/app/services/restaurants";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; restaurantId: number; workingHours: string }) => void;
  restaurants: Restaurant[];
};

export function AddWaitressDialog({ open, onClose, onSubmit, restaurants }: Props) {
  const [fullName, setFullName] = useState("");
  const [restaurantId, setRestaurantId] = useState(restaurants[0]?.id ?? 1);
  const [workingHours, setWorkingHours] = useState("09:00 - 17:00");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    if (!fullName.trim()) return;
    setSubmitting(true);
    onSubmit({
      fullName: fullName.trim(),
      restaurantId,
      workingHours,
    });
    setFullName("");
    setRestaurantId(restaurants[0]?.id ?? 1);
    setWorkingHours("09:00 - 17:00");
    setSubmitting(false);
  }

  function handleClose() {
    if (!submitting) {
      setFullName("");
      setRestaurantId(restaurants[0]?.id ?? 1);
      setWorkingHours("09:00 - 17:00");
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add waitress"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !fullName.trim()}
            className="aurora-btn-primary disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add waitress"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="fullName">
            Full name
          </label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Maria Garcia"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="restaurant">
            Restaurant
          </label>
          <select
            id="restaurant"
            className="aurora-select"
            value={restaurantId}
            onChange={(e) => setRestaurantId(Number(e.target.value))}
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} — {r.city}
              </option>
            ))}
          </select>
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="workingHours">
            Working hours
          </label>
          <Input
            id="workingHours"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="09:00 - 17:00"
          />
        </div>
      </div>
    </Dialog>
  );
}