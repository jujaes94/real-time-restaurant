import { LoginForm } from "@/app/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
