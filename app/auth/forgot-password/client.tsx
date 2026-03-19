"use client";

// Purpose: Client UI for /auth/forgot-password.
// Collects email, submits to forgotPasswordAction, shows confirmation.

import Link from "next/link";
import { useActionState, useEffect } from "react";

import type { AuthActionState } from "@/app/auth/actions";
import { forgotPasswordAction } from "@/app/auth/forgot-password/actions";
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

const initialState: AuthActionState = { status: "idle", message: "" };

export default function Client() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  useEffect(() => {
    if (state._devUrl) {
      console.log(`[Dev] Reset link → ${state._devUrl}`);
    }
  }, [state._devUrl]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_45%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--muted)/0.45))] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      <section className="mx-auto flex min-h-[720px] w-full max-w-md items-center justify-center">
        <Card className="w-full border-secondary/70 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {state.status === "success" ? (
              <div className="space-y-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  {state.message}
                </p>
                <Link
                  href="/auth#signin"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Back to sign in
                </Link>
              </div>
            ) : (
              <>
                <form className="space-y-4" action={action}>
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? "Sending..." : "Send reset link"}
                  </Button>
                </form>

                {state.status === "error" && state.message ? (
                  <p
                    className="text-sm font-medium text-destructive"
                    role="alert"
                  >
                    {state.message}
                  </p>
                ) : null}

                <div className="text-center">
                  <Link
                    href="/auth#signin"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Back to sign in
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
