import { DashboardShell } from "@/shared/components/layout";
import TablesFeature from "@/features/tables/TablesPage";

export default function TablesPage() {
  return (
    <DashboardShell title="Tables">
      <TablesFeature />
    </DashboardShell>
  );
}
