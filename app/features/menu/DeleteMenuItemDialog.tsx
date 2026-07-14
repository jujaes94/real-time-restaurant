"use client";

import { Dialog } from "@/app/components/ui";
import { Button } from "@/app/components/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
};

export function DeleteMenuItemDialog({ open, onClose, onConfirm, itemName }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete menu item"
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
      <p className="text-sm text-[var(--text-secondary)]">
        Are you sure you want to remove{" "}
        <span className="font-medium text-[var(--text-primary)]">{itemName}</span>{" "}
        from the menu? This action cannot be undone.
      </p>
    </Dialog>
  );
}