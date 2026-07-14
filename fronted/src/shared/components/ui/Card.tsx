import { cn } from "@/shared/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("aurora-card p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-[var(--text-primary)] mb-1", className)}
      {...props}
    />
  );
}

export function CardValue({ className, ...props }: CardProps) {
  return (
    <p
      className={cn(
        "text-3xl font-bold aurora-text",
        className,
      )}
      {...props}
    />
  );
}