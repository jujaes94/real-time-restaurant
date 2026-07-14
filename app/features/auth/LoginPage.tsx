import { LoginForm } from "@/app/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative z-10 px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold aurora-text mb-2">Restaurant</h1>
          <p className="text-sm text-[var(--text-muted)]">Sign in to your workspace</p>
        </div>
        <div className="aurora-card p-6 w-full">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}