"use client";

import { useState } from "react";

import { Button, Input } from "@/app/components/ui";
import { useAuth } from "@/app/contexts/AuthContext";
import { useToast } from "@/app/contexts/ToastContext";

export function LoginForm() {
  const { signIn } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email);
      push("Signed in", "success");
    } catch {
      push("Sign in failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Email</span>
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@restaurant.com"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Password</span>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </label>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
