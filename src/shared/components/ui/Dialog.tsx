"use client";

import { useEffect, useRef } from "react";

import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="aurora-dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="aurora-dialog-panel"
      >
        <div className="aurora-dialog-header">
          <h2 id="dialog-title" className="aurora-dialog-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="aurora-dialog-close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="aurora-dialog-body">{children}</div>
        {footer && <div className="aurora-dialog-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}