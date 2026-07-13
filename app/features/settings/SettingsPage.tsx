import { DashboardShell } from "@/app/components/layout";

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings">
      <section className="rounded-lg bg-white dark:bg-gray-700 shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Settings
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Preferences and configuration will live here.
        </p>
      </section>
    </DashboardShell>
  );
}
