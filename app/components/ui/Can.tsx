"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { can, type Action } from "@/app/services/roles";

interface CanProps {
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ action, children, fallback = null }: CanProps) {
  const { user } = useAuth();
  return can(user?.role, action) ? <>{children}</> : <>{fallback}</>;
}
