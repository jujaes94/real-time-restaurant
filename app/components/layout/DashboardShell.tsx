import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Topbar title={title} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4 space-y-8">{children}</main>
      </div>
    </div>
  );
}
