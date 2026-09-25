"use client";

import { useState } from "react";

import { Dialog, Button } from "@/shared/components/ui";
import type { Waitress } from "@/features/staff/waitresses";

type Props = {
  open: boolean;
  onClose: () => void;
  onAssign: (waitress: Waitress) => void;
  waitresses: Waitress[];
};

export function AssignStaffDialog({ open, onClose, onAssign, waitresses }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleAssign() {
    const waitress = waitresses.find((w) => w.id === selectedId);
    if (!waitress) return;
    onAssign(waitress);
    setSelectedId(null);
  }

  function handleClose() {
    setSelectedId(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Assign staff"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <button
            onClick={handleAssign}
            disabled={selectedId === null}
            className="aurora-btn-primary disabled:opacity-50"
          >
            Assign
          </button>
        </>
      }
    >
      {waitresses.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No unassigned staff available.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {waitresses.map((w) => (
            <label
              key={w.id}
              className={`aurora-table-row cursor-pointer ${
                selectedId === w.id ? "ring-2 ring-[var(--accent)]" : ""
              }`}
            >
              <input
                type="radio"
                name="waitress"
                value={w.id}
                checked={selectedId === w.id}
                onChange={() => setSelectedId(w.id)}
                className="mr-3"
              />
              <div className="aurora-avatar">
                {w.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-medium text-[var(--text-primary)] truncate">{w.fullName}</p>
                <p className="text-xs text-[var(--text-muted)]">{w.workingHours}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </Dialog>
  );
}
