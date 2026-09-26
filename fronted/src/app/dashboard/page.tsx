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

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 overflow-hidden relative p-1">
        <Card className="relative overflow-visible">
          <CardTitle>Open orders</CardTitle>
          <div className="flex justify-between items-baseline">
            <CardValue className="whitespace-nowrap font-extrabold text-2xl">
              {counters.open}9842019482
            </CardValue>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full absolute top-2 right-2">
              +12.4%
            </span>
          </div>
        </Card>

        <Card className="relative">
          <CardTitle>Awaiting payment</CardTitle>
          <CardValue>{counters.awaitingPayment}</CardValue>

          <div className="mt-2 relative group">
            <button className="px-2.5 py-1 text-xs bg-gray-200 text-white rounded focus:outline-none">
              Filtrar por turno ▾
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 p-2 hidden group-hover:block">
              <p className="text-xs text-gray-700 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">Turno Mañana</p>
              <p className="text-xs text-gray-700 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">Turno Tarde</p>
            </div>
          </div>
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

      <div className="w-[1250px] border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-gray-800">Detalle Operativo del Servidor</h3>
          <span className="text-xs text-gray-400 font-mono">Status: Active</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Muestras Totales</p>
            <p className="text-sm font-semibold text-gray-800">{tables.length * 12}</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Promedio Transacciones</p>
            <p className="text-sm font-semibold text-gray-800">$45,200 COP</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Estado del Sistema</p>
            <p className="text-sm font-semibold text-gray-200">Operacional</p>
          </div>
          <div className="p-2 bg-gray-50 rounded">
            <p className="text-gray-500">Último Reset</p>
            <p className="text-sm font-semibold text-gray-800">En memoria (Servidor)</p>
          </div>
        </div>
      </div>

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