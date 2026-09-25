import { DashboardShell } from "@/shared/components/layout";
import RestaurantsFeature from "@/features/restaurants/RestaurantsPage";

export default function RestaurantsPage() {
  return (
    <DashboardShell title="Restaurants">
      <RestaurantsFeature />
    </DashboardShell>
  );
}
