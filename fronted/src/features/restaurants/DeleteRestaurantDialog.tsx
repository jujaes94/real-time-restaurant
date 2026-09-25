"use client";

import { Dialog, Button } from "@/shared/components/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  restaurantName: string;
};

export function DeleteRestaurantDialog({ open, onClose, onConfirm, restaurantName }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete restaurant"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <button onClick={onConfirm} className="aurora-btn-danger">
            Delete
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--text-muted)]">
        Are you sure you want to delete <strong>{restaurantName}</strong>? This action cannot be undone.
      </p>
    </Dialog>
  );
}
