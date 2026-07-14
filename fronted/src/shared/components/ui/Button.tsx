"use client";

import { forwardRef } from "react";

import { cn } from "@/shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "aurora-btn-primary",
  secondary: "aurora-btn-ghost",
  ghost: "aurora-btn-ghost",
  danger: "aurora-btn-danger",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, type, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(variantClass[variant], className)}
        {...props}
      />
    );
  },
);