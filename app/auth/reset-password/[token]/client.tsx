"use client";

// Purpose: Client UI for /auth/reset-password/[token].
// Shows an expired-link message or a new-password form depending on token validity.

import Link from "next/link";
import { useActionState } from "react";

import type { AuthActionState } from "@/app/auth/actions";
import { resetPasswordAction } from "@/app/auth/reset-password/[token]/actions";
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

type ClientProps = {
  token: string;
  valid: boolean;
};

export default function Client({ token, valid }: ClientProps) {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    initialState
  );

  if (!valid) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_45%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--muted)/0.45))] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        <section className="mx-auto flex min-h-[720px] w-full max-w-md items-center justify-center">
          <Card className="w-full border-secondary/70 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle>Link expired</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Request a new reset link
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_45%),linear-gradient(to_bottom,_hsl(var(--background)),_hsl(var(--muted)/0.45))] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
      <section className="mx-auto flex min-h-[720px] w-full max-w-md items-center justify-center">
        <Card className="w-full border-secondary/70 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Choose a new password for your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-4" action={action}>
              <input type="hidden" name="token" value={token} />

              <div className="space-y-2">
                <Label htmlFor="reset-new-password">New password</Label>
                <Input
                  id="reset-new-password"
                  name="newPassword"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-confirm-password">
                  Confirm new password
                </Label>
                <Input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Resetting..." : "Reset password"}
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
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
