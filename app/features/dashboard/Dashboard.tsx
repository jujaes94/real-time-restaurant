import { DashboardShell } from "@/app/components/layout";
import { Card, CardTitle, CardValue, Table, TBody, Td, Th, THead, Tr } from "@/app/components/ui";
import { getRestaurants } from "@/app/services/restaurants";

interface Stat {
  label: string;
  value: string;
}

const STATS: Stat[] = [
  { label: "Visitors", value: "1,234" },
  { label: "Sales", value: "$5,678" },
  { label: "Orders", value: "89" },
];

export default async function Dashboard() {
  const restaurants = await getRestaurants();

  return (
    <DashboardShell title="Restaurant Dashboard">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardTitle>{stat.label}</CardTitle>
            <CardValue>{stat.value}</CardValue>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Restaurants
        </h2>
        <Table>
          <THead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>City</Th>
            </Tr>
          </THead>
          <TBody>
            {restaurants.map((r) => (
              <Tr key={r.id}>
                <Td>{r.id}</Td>
                <Td>{r.name}</Td>
                <Td>{r.city}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </section>
    </DashboardShell>
  );
}
