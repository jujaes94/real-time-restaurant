"use client";

import { useState } from "react";

import { Button, Input } from "@/app/components/ui";

interface RenameTableFormProps {
  initial: string;
  onSubmit: (label: string) => void;
  onCancel: () => void;
}

export function RenameTableForm({
  initial,
  onSubmit,
  onCancel,
}: RenameTableFormProps) {
  const [label, setLabel] = useState(initial);

  return (
    <form
      key={initial}
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!label.trim()) return;
        onSubmit(label);
      }}
    >
      <Input
        aria-label="New table label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-28"
      />
      <Button type="submit">Save</Button>
      <Button variant="ghost" type="button" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}
