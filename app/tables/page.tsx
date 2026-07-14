import { DashboardShell } from "@/app/components/layout";
import TablesFeature from "@/app/features/tables/TablesPage";

export default function TablesPage() {
  return (
    <DashboardShell title="Tables">
      <TablesFeature />
    </DashboardShell>
  );
}
