"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/brand-mark";
import { signIn, signUp } from "@/lib/auth-client";

type Mode = "login" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isSignup && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        const result = await signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Hiker",
        });
        if (result.error) {
          setError(result.error.message || "Could not create account.");
          return;
        }
      } else {
        const result = await signIn.email({ email, password });
        if (result.error) {
          setError(result.error.message || "Invalid email or password.");
          return;
        }
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, #eef3e6 0%, #f4f4f2 55%)",
      }}
    >
      <div className="w-full max-w-[392px] animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-center mb-[26px]">
          <BrandMark size="lg" />
        </div>
        <div className="bg-card border rounded-2xl px-7 py-[30px] shadow-[0_4px_24px_rgba(20,20,15,0.05)]">
          <h1
            className="m-0 mb-1 text-[22px] font-bold"
            style={{ letterSpacing: "-0.02em" }}
          >
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="m-0 mb-[22px] text-muted-foreground text-sm">
            {isSignup
              ? "Track every gram of your kit."
              : "Sign in to your gear lists."}
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-3.5">
            <div>
              <Label htmlFor="email" className="mb-1.5 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isSignup && (
              <div>
                <Label htmlFor="confirm" className="mb-1.5 block">
                  Confirm password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive m-0">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full mt-1"
            >
              {submitting
                ? isSignup
                  ? "Creating…"
                  : "Signing in…"
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-[18px]">
          {isSignup ? "Already have an account?" : "New to LighterJack?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setError(null);
            }}
            className="text-primary font-semibold text-sm px-0.5 hover:underline cursor-pointer"
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
