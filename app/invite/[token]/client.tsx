"use client";

import Link from "next/link";

import { acceptInvitationAction } from "@/app/invite/[token]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Purpose: Client UI for /invite/[token].
// Keep only presentational branching and form wiring here.
//
// Replication pattern:
// - Receive one serializable "view state" object from `page.tsx`.
// - Render per-state UI in a single place.
// - Keep forms bound directly to server actions.
// - Keep DB/session logic in `page.tsx` or `actions.ts` (never here).

export type InviteViewModel =
  | { kind: "invalid" }
  | { kind: "already-used" }
  | { kind: "expired" }
  | { kind: "already-member"; teamName: string }
  | {
      kind: "accept";
      token: string;
      teamName: string;
      role: string;
      signedInEmail: string;
    };

type ClientProps = {
  view: InviteViewModel;
};

function CenteredCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}

export default function Client({ view }: ClientProps) {
  if (view.kind === "invalid") {
    return (
      <CenteredCard
        title="Invalid Invitation"
        description="This invitation link is not valid."
      >
        <p className="mb-4 text-sm text-muted-foreground">
          The invitation may have been revoked or the link is incorrect.
        </p>
        <Button asChild className="w-full">
          <Link href="/">Go to homepage</Link>
        </Button>
      </CenteredCard>
    );
  }

  if (view.kind === "already-used") {
    return (
      <CenteredCard
        title="Invitation Already Used"
        description="This invitation has already been accepted or expired."
      >
        <Button asChild className="w-full">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </CenteredCard>
    );
  }

  if (view.kind === "expired") {
    return (
      <CenteredCard
        title="Invitation Expired"
        description="This invitation has expired. Please ask the team admin to send a new one."
      >
        <Button asChild className="w-full">
          <Link href="/">Go to homepage</Link>
        </Button>
      </CenteredCard>
    );
  }

  if (view.kind === "already-member") {
    return (
      <CenteredCard
        title="Already a Member"
        description={`You are already a member of ${view.teamName}.`}
      >
        <Button asChild className="w-full">
          <Link href="/dashboard/team">Go to team</Link>
        </Button>
      </CenteredCard>
    );
  }

  return (
    <CenteredCard
      title="Team Invitation"
      description={`You've been invited to join ${view.teamName} as a ${view.role}.`}
    >
      <form action={acceptInvitationAction} className="space-y-4">
        <input type="hidden" name="token" value={view.token} />
        <p className="text-sm text-muted-foreground">
          Signed in as <strong>{view.signedInEmail}</strong>
        </p>
        <Button type="submit" className="w-full">
          Accept Invitation
        </Button>
      </form>
      <Button asChild variant="outline" className="mt-2 w-full">
        <Link href="/dashboard">Cancel</Link>
      </Button>
    </CenteredCard>
  );
}
