"use client";

import { forwardRef } from "react";

import { cn } from "@/app/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-90 disabled:opacity-50",
  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  ghost:
    "bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = "primary", className, type, ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground",
          variantClass[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
