"use client";

import { DashboardShell } from "@/shared/components/layout";
import { useAuth } from "@/shared/contexts/AuthContext";
import { can } from "@/shared/services/roles";

export default function SettingsPage() {
  const { user } = useAuth();

  if (!can(user?.role, "view:settings")) {
    return (
      <DashboardShell title="Settings">
        <p className="text-sm text-[var(--text-muted)]">
          You do not have access to this page.
        </p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Settings">
      <section className="aurora-card p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Settings
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Preferences and configuration will live here.
        </p>
      </section>
    </DashboardShell>
  );
}