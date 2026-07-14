"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { findUser, type User } from "@/shared/services/users";
import type { Role } from "@/shared/services/roles";

interface AuthContextValue {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    const found = findUser(email, password);
    if (!found) {
      throw new AuthenticationError("Invalid email or password");
    }
    setUser(found);
    return found;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => user?.role === role,
    [user],
  );

  const value = useMemo(
    () => ({ user, signIn, signOut, hasRole }),
    [user, signIn, signOut, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
