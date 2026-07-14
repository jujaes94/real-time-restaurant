"use client";

import { Can } from "@/shared/components/ui";
import { Card, CardTitle, CardValue } from "@/shared/components/ui";
import { formatCurrency } from "@/shared/lib/utils";

interface SalesCardProps {
  totalSales: number;
  paidCount: number;
}

export function SalesCard({ totalSales, paidCount }: SalesCardProps) {
  return (
    <Can action="view:salesSummary">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Sales (paid)</CardTitle>
          <CardValue>{formatCurrency(totalSales)}</CardValue>
        </Card>
        <Card>
          <CardTitle>Orders paid</CardTitle>
          <CardValue>{paidCount}</CardValue>
        </Card>
      </section>
    </Can>
  );
}
