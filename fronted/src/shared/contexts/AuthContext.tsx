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

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface ApiUserResponse {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
  restaurant_id: string | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const loginRes = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!loginRes.ok) {
        throw new AuthenticationError("Invalid email or password");
      }
      const loginData: LoginResponse = await loginRes.json();
      const token = loginData.access_token;

      const profileRes = await fetch("http://localhost:8000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileRes.ok) {
        throw new AuthenticationError("Failed to fetch user profile");
      }
      const profile: ApiUserResponse = await profileRes.json();

      const u: User = {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: profile.role as Role,
        token,
        restaurantId: profile.restaurant_id,
      };
      setUser(u);
      return u;
    } catch (err) {
      if (err instanceof AuthenticationError) throw err;
      const found = findUser(email, password);
      if (!found) {
        throw new AuthenticationError("Invalid email or password");
      }
      const u: User = { ...found, token: "mock-token" };
      setUser(u);
      return u;
    }
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
