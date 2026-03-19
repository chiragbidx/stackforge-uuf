import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Client, { type InviteViewModel } from "@/app/invite/[token]/client";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { teamInvitations, teamMembers, teams } from "@/lib/db/schema";

// Purpose: Server route entry for /invite/[token].
// Keep token parsing, invitation/session checks, and DB updates here,
// then pass a serializable view model into `client.tsx`.
//
// Replication pattern for token-based dashboard/public flows:
// 1) Parse route params in this server file.
// 2) Validate DB token/state here (pending/expired/invalid/etc.).
// 3) Perform server-only side effects (for example marking expired tokens).
// 4) Redirect when auth is required.
// 5) Return one serializable state object to `client.tsx` for UI rendering.

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const [invitation] = await db
    .select({
      id: teamInvitations.id,
      teamId: teamInvitations.teamId,
      email: teamInvitations.email,
      role: teamInvitations.role,
      status: teamInvitations.status,
      expiresAt: teamInvitations.expiresAt,
    })
    .from(teamInvitations)
    .where(eq(teamInvitations.token, token))
    .limit(1);

  if (!invitation) {
    const view: InviteViewModel = {
      kind: "invalid",
    };
    return <Client view={view} />;
  }

  if (invitation.status !== "pending") {
    const view: InviteViewModel = {
      kind: "already-used",
    };
    return <Client view={view} />;
  }

  const now = new Date();
  if (invitation.expiresAt < now) {
    await db
      .update(teamInvitations)
      .set({ status: "expired" })
      .where(eq(teamInvitations.id, invitation.id));

    const view: InviteViewModel = {
      kind: "expired",
    };
    return <Client view={view} />;
  }

  const [team] = await db
    .select({ name: teams.name })
    .from(teams)
    .where(eq(teams.id, invitation.teamId))
    .limit(1);

  const teamName = team?.name ?? "a team";

  const session = await getAuthSession();

  if (!session) {
    redirect(`/auth?redirect=${encodeURIComponent(`/invite/${token}`)}#signin`);
  }

  const [alreadyMember] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, invitation.teamId),
        eq(teamMembers.userId, session.userId)
      )
    )
    .limit(1);

  if (alreadyMember) {
    const view: InviteViewModel = {
      kind: "already-member",
      teamName,
    };
    return <Client view={view} />;
  }

  const view: InviteViewModel = {
    kind: "accept",
    token,
    teamName,
    role: invitation.role,
    signedInEmail: session.email,
  };
  return <Client view={view} />;
}
