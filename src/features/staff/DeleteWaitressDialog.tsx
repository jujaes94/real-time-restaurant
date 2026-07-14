"use client";

import { Dialog } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  waitressName: string;
};

export function DeleteWaitressDialog({ open, onClose, onConfirm, waitressName }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Delete waitress"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            className="aurora-btn-danger"
          >
            Delete
          </button>
        </>
      }
    >
      <p className="text-sm text-[var(--text-secondary)]">
        Are you sure you want to remove{" "}
        <span className="font-medium text-[var(--text-primary)]">{waitressName}</span>{" "}
        from the system? This action cannot be undone.
      </p>
    </Dialog>
  );
}