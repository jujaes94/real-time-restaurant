import { DashboardShell } from "@/shared/components/layout";
import { getWaitresses } from "@/features/staff/waitresses";
import { getRestaurants } from "@/shared/services/restaurants";
import { WaitressPage } from "@/features/staff/WaitressPage";

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