import Link from "next/link";

import { DashboardShell } from "@/shared/components/layout";
import { Card, CardTitle, CardValue } from "@/shared/components/ui";
import { formatCurrency } from "@/shared/lib/utils";
import { getOrderCounters } from "@/features/orders/orders";
import { getTables } from "@/features/tables/tables";

import { SalesCard } from "@/features/dashboard/SalesCard";

export default async function Dashboard() {
  const [tables, counters] = await Promise.all([
    getTables(),
    getOrderCounters(),
  ]);

  const freeTables = tables.filter((t) => t.status === "free").length;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;

  return (
    <DashboardShell title="Dashboard">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardTitle>Open orders</CardTitle>
          <CardValue>{counters.open}</CardValue>
        </Card>
        <Card>
          <CardTitle>Awaiting payment</CardTitle>
          <CardValue>{counters.awaitingPayment}</CardValue>
        </Card>
        <Card>
          <CardTitle>Tables free</CardTitle>
          <CardValue>
            {freeTables}
            <span className="ml-2 text-base font-normal text-[var(--text-muted)]">
              / {tables.length}
            </span>
          </CardValue>
        </Card>
        <Card>
          <CardTitle>Tables occupied</CardTitle>
          <CardValue>
            {occupiedTables}
            <span className="ml-2 text-base font-normal text-[var(--text-muted)]">
              / {tables.length}
            </span>
          </CardValue>
        </Card>
      </section>

      <SalesCard totalSales={counters.totalSales} paidCount={counters.paid} />

      <section className="text-sm text-[var(--text-secondary)]">
        Tip: open <Link className="underline text-[var(--aurora-1)]" href="/tables">Tables</Link> to manage
        shifts, orders, and payments.
      </section>

      <p className="text-xs text-[var(--text-muted)]">
        Demo · Data is in-memory and resets on server restart.
        ({formatCurrency(0)}/mo? No — {formatCurrency(counters.totalSales)} total)
      </p>
    </DashboardShell>
  );
}
