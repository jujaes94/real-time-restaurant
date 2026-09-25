import { DashboardShell } from "@/shared/components/layout";
import { MenuPage } from "@/features/menu/MenuPage";

export default function MenuPageRoute() {
  return (
    <DashboardShell title="Menu">
      <MenuPage />
    </DashboardShell>
  );
}
