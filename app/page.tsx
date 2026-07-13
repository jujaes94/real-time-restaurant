import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-xl space-y-6">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Coming soon
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Real-Time Restaurant
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          A real-time restaurant management dashboard. Live orders, stock, and
          staff — all in one place.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
