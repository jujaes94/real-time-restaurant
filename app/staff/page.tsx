import { DashboardShell } from "@/app/components/layout";
import { getWaitresses } from "@/app/services/waitresses";
import { getRestaurants } from "@/app/services/restaurants";
import { WaitressPage } from "@/app/features/staff/WaitressPage";

export default async function StaffPage() {
  const [waitresses, restaurants] = await Promise.all([
    getWaitresses(),
    getRestaurants(),
  ]);

  return (
    <DashboardShell title="Staff">
      <WaitressPage initialWaitresses={waitresses} restaurants={restaurants} />
    </DashboardShell>
  );
}