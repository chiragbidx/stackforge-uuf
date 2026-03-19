"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  type AuthActionState,
  signInWithPassword,
  signUpWithPassword,
} from "./actions";

// Purpose: Client UI for /auth.
// Use this file for auth mode toggles, form interactivity, and browser-only logic.
//
// Replication pattern for new interactive pages:
// - Keep server mutations in `actions.ts`.
// - Bind actions here with `useActionState`.
// - Use local state only for presentation/interaction (tabs, steps, toggles).
// - Keep forms simple: collect inputs and submit to a server action.

type AuthMode = "signin" | "signup";

type ClientProps = {
  redirectTo: string;
  flashStatus: "success" | "error" | null;
  flashMessage: string | null;
};

const initialActionState: AuthActionState = {
  status: "idle",
  message: "",
};

export default function Client({ redirectTo, flashStatus, flashMessage }: ClientProps) {
  // UI state: only controls which form is shown.
  const [mode, setMode] = useState<AuthMode>("signin");

  // Server action wiring:
  // - `state` carries serializable feedback (error/success message).
  // - `action` is assigned directly to form `action={...}`.
  // - `pending` drives submit button loading state.
  const [signInState, signInAction, signInPending] = useActionState(
    signInWithPassword,
    initialActionState
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUpWithPassword,
    initialActionState
  );

  const activeState = mode === "signin" ? signInState : signUpState;
  const isPending = mode === "signin" ? signInPending : signUpPending;

  useEffect(() => {
    if (activeState._devUrl) {
      console.log(`[Dev] Auth link → ${activeState._devUrl}`);
    }
  }, [activeState._devUrl]);

  // URL hash keeps the auth mode linkable (`/auth#signin` or `/auth#signup`).
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      setMode(hash === "signup" ? "signup" : "signin");
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const setModeWithHash = (nextMode: AuthMode) => {
    setMode(nextMode);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${nextMode}`);
    }
  };

  const content = useMemo(() => {
    // View-model for mode-specific heading/description copy.
    if (mode === "signup") {
      return {
        id: "signup",
        title: "Create account",
        description: "Start your free account in less than a minute.",
      };
    }

    return {
      id: "signin",
      title: "Sign in",
      description: "Use your email and password to continue.",
    };
  }, [mode]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_45%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--muted)/0.45))] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-secondary bg-card/60 shadow-2xl backdrop-blur-sm lg:grid-cols-2">
        <aside className="relative hidden min-h-[720px] p-10 lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-primary/10" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                Panda Access
              </p>
              <h1 className="max-w-sm text-4xl font-semibold leading-tight tracking-tight">
                Launch faster with one workspace for your team.
              </h1>
              <p className="max-w-md text-sm text-muted-foreground">
                Secure auth, polished interface, and a clean onboarding flow built
                for production teams.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-secondary/70 bg-background/80 p-3 shadow-lg">
              <Image
                src="/demo-img.jpg"
                alt="Panda product preview"
                className="h-full w-full rounded-xl object-cover"
                width={1200}
                height={900}
              />
            </div>
          </div>
        </aside>

        <div className="flex min-h-[720px] items-center justify-center p-4 sm:p-8 lg:p-10">
          <Card id={content.id} className="w-full max-w-md border-secondary/70 shadow-xl">
            <CardHeader className="space-y-4">
              <div className="grid grid-cols-2 rounded-lg border border-secondary bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setModeWithHash("signin")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    mode === "signin"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setModeWithHash("signup")}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    mode === "signup"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <div className="space-y-1">
                <CardTitle>{content.title}</CardTitle>
                <CardDescription>{content.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {flashStatus && flashMessage ? (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    flashStatus === "success"
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                      : "border-destructive/20 bg-destructive/5 text-destructive"
                  }`}
                >
                  {flashMessage}
                </div>
              ) : null}

              {mode === "signin" ? (
                // Sign-in form submits directly to server action.
                <form className="space-y-4" action={signInAction}>
                  {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              ) : (
                // Sign-up form submits directly to server action.
                <form className="space-y-4" action={signUpAction}>
                  {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-first-name">First name</Label>
                      <Input id="signup-first-name" name="firstName" placeholder="Chirag" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-last-name">Last name</Label>
                      <Input id="signup-last-name" name="lastName" placeholder="Dodiya" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="Create password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm password</Label>
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Repeat password"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              )}

              {activeState.status === "success" && activeState.message ? (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400" role="status">
                  {activeState.message}
                </p>
              ) : null}

              {activeState.status === "error" && activeState.message ? (
                <p className="text-sm font-medium text-destructive" role="alert">
                  {activeState.message}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
