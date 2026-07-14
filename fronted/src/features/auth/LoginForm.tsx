"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Input } from "@/shared/components/ui";
import { useAuth, AuthenticationError } from "@/shared/contexts/AuthContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { ROLE_LABELS } from "@/shared/services/roles";
import { USERS } from "@/shared/services/users";

const DEMO_USERS = USERS.map((u) => ({
  email: u.email,
  password: u.password,
  label: ROLE_LABELS[u.role],
}));

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function attempt(userEmail: string, userPassword: string) {
    setSubmitting(true);
    try {
      await signIn(userEmail, userPassword);
      push("Signed in", "success");
      router.replace("/tables");
    } catch (err) {
      push(
        err instanceof AuthenticationError
          ? err.message
          : "Sign in failed",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await attempt(email, password);
  }

  async function handleDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    await attempt(demoEmail, demoPassword);
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="aurora-label">Email</span>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@restaurant.com"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="aurora-label">Password</span>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        <Button type="submit" disabled={submitting} className="w-full mt-1">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <div className="relative flex items-center gap-3">
          <div className="flex-1 border-t border-[var(--glass-border)]" />
          <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
            demo roles
          </span>
          <div className="flex-1 border-t border-[var(--glass-border)]" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {DEMO_USERS.map((demo) => (
            <Button
              key={demo.email}
              variant="secondary"
              onClick={() => handleDemo(demo.email, demo.password)}
              disabled={submitting}
            >
              {demo.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}