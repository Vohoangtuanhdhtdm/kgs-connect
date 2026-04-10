import { useState } from "react";
import { Building2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">KGS</h1>
          <p className="text-sm text-muted-foreground">Real Estate Valuation System</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur-sm">
          <h2 className="mb-1 text-xl font-semibold text-card-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to access your valuations"
              : "Get started with KGS today"}
          </p>

          {mode === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setMode("login")} />
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("register")} className="font-medium text-primary hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="font-medium text-primary hover:underline">
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
