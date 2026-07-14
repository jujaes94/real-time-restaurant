"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/shared/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/tables");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative z-10">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-t-[var(--aurora-1)] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      </div>
    </main>
  );
}