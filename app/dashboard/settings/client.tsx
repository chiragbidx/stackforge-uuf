"use client";

import { useActionState, useEffect } from "react";
import { User, Mail, Lock, AlertTriangle, ShieldCheck } from "lucide-react";

import { resendVerificationEmailAction, type AuthActionState } from "@/app/auth/actions";
import {
  updateProfileAction,
  updateEmailAction,
  updatePasswordAction,
} from "@/app/dashboard/settings/actions";
import { DeleteAccountDialog } from "@/components/dashboard/delete-account-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";

// Purpose: Client UI for /dashboard/settings.
// Use this file for interactive form and browser-only settings UI logic.

type ClientProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: Date | null;
  };
  status: "success" | "error" | null;
  message: string | null;
};

const resendInitial: AuthActionState = { status: "idle", message: "" };

export default function Client({ user, status, message }: ClientProps) {
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationEmailAction,
    resendInitial
  );

  useEffect(() => {
    if (resendState._devUrl) {
      console.log(`[Dev] Verify link → ${resendState._devUrl}`);
    }
  }, [resendState._devUrl]);

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials =
    `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || "U";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account profile, email, and security.
        </p>
      </div>

      {status && message ? (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
              : "border-destructive/20 bg-destructive/5 text-destructive"
          }`}
        >
          {message}
        </div>
      ) : null}

      {!user.emailVerified ? (
        <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Your email is not verified.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <form action={resendAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={resendPending}
              >
                {resendPending ? "Sending..." : "Resend verification email"}
              </Button>
            </form>
            {resendState.status !== "idle" && resendState.message ? (
              <p
                className={`text-sm ${
                  resendState.status === "success"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-destructive"
                }`}
              >
                {resendState.message}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-6">
        {/* Profile card with avatar */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Profile</CardTitle>
            </div>
            <CardDescription>
              Update your personal details. This is how others will see you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfileAction} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border shadow-sm">
                  <AvatarFallback className="text-lg font-medium bg-muted">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user.firstName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={user.lastName}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Email card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Email Address</CardTitle>
            </div>
            <CardDescription>
              Change the email address associated with your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateEmailAction} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newEmail">New email</Label>
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailCurrentPassword">
                    Current password
                  </Label>
                  <Input
                    id="emailCurrentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update email</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Password</CardTitle>
            </div>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={updatePasswordAction}
              className="max-w-md space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="passwordCurrentPassword">
                  Current password
                </Label>
                <Input
                  id="passwordCurrentPassword"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update password</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-destructive" />
              <CardTitle className="text-base text-destructive">
                Danger Zone
              </CardTitle>
            </div>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action is irreversible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountDialog />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
