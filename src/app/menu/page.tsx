import { DashboardShell } from "@/shared/components/layout";
import { MenuPage } from "@/features/menu/MenuPage";
import { getMenuItems } from "@/features/menu/menuItems";

export default async function MenuPageRoute() {
  const items = await getMenuItems();

  return (
    <DashboardShell title="Menu">
      <MenuPage initialItems={items} />
    </DashboardShell>
  );
}