import { DashboardShell } from "@/app/components/layout";
import { MenuPage } from "@/app/features/menu/MenuPage";
import { getMenuItems } from "@/app/services/menuItems";

export default async function MenuPageRoute() {
  const items = await getMenuItems();

  return (
    <DashboardShell title="Menu">
      <MenuPage initialItems={items} />
    </DashboardShell>
  );
}