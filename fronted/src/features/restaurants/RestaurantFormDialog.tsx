"use client";

import { useEffect, useState } from "react";

import { Dialog, Input, Button } from "@/shared/components/ui";
import type { Restaurant } from "@/shared/services/restaurants";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; address: string; phone: string }) => void;
  title: string;
  initial?: Restaurant;
};

export function RestaurantFormDialog({ open, onClose, onSubmit, title, initial }: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setAddress(initial?.address ?? "");
      setPhone(initial?.phone ?? "");
    }
  }, [open, initial]);

  function handleSubmit() {
    if (!name.trim() || !address.trim()) return;
    setSubmitting(true);
    onSubmit({ name: name.trim(), address: address.trim(), phone: phone.trim() });
    setName("");
    setAddress("");
    setPhone("");
    setSubmitting(false);
  }

  function handleClose() {
    if (!submitting) {
      setName("");
      setAddress("");
      setPhone("");
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !address.trim()}
            className="aurora-btn-primary disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="La Petite"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="address">
            Address
          </label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="12 Rue de Rivoli, Paris"
          />
        </div>
        <div className="aurora-form-group">
          <label className="aurora-label" htmlFor="phone">
            Phone
          </label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 1 23 45 67 89"
          />
        </div>
      </div>
    </Dialog>
  );
}
