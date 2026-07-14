import { cn } from "@/shared/lib/utils";

export type BadgeTone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneClass: Record<BadgeTone, string> = {
  neutral: "aurora-badge-neutral",
  info: "aurora-badge-awaiting_payment",
  success: "aurora-badge-free",
  warning: "aurora-badge-occupied",
  danger: "aurora-badge-closed",
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span className={cn("aurora-badge", toneClass[tone], className)}>
      {children}
    </span>
  );
}