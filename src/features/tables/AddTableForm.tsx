"use client";

import { useState } from "react";

import { Button, Input } from "@/shared/components/ui";

interface AddTableFormProps {
  restaurantId: number;
  onCreate: (label: string, seats: number) => void;
}

export function AddTableForm({ onCreate }: AddTableFormProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [seats, setSeats] = useState(2);

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        + Add table
      </Button>
    );
  }

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!label.trim()) return;
        onCreate(label, seats);
        setLabel("");
        setSeats(2);
        setOpen(false);
      }}
    >
      <Input
        aria-label="Table label"
        placeholder="e.g. T4"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-28"
      />
      <Input
        aria-label="Seats"
        type="number"
        min={1}
        max={20}
        value={seats}
        onChange={(e) => setSeats(Number(e.target.value))}
        className="w-20"
      />
      <Button type="submit">Create</Button>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
    </form>
  );
}
