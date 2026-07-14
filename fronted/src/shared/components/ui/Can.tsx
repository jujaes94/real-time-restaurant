"use client";

import { useAuth } from "@/shared/contexts/AuthContext";
import { can, type Action } from "@/shared/services/roles";

interface CanProps {
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ action, children, fallback = null }: CanProps) {
  const { user } = useAuth();
  return can(user?.role, action) ? <>{children}</> : <>{fallback}</>;
}
