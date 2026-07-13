import { cn } from "@/app/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white dark:bg-gray-700 shadow p-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn(
        "text-lg font-medium text-gray-800 dark:text-gray-200 mb-2",
        className,
      )}
      {...props}
    />
  );
}

export function CardValue({ className, ...props }: CardProps) {
  return (
    <p
      className={cn(
        "text-3xl font-bold text-gray-900 dark:text-gray-100",
        className,
      )}
      {...props}
    />
  );
}
