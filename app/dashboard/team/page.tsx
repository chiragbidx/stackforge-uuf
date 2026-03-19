import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Client from "@/app/dashboard/team/client";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { teamInvitations, teamMembers, teams, users } from "@/lib/db/schema";

// Purpose: Server route entry for /dashboard/team.
// Keep membership checks and team/invitation queries here,
// then pass prepared props into `client.tsx`.

type TeamPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
    inviteUrl?: string;
  }>;
};

export default async function TeamPage({ searchParams }: TeamPageProps) {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  const params = (await searchParams) ?? {};
  const status =
    params.status === "success" || params.status === "error"
      ? params.status
      : null;
  const message = typeof params.message === "string" ? params.message : null;
  const inviteUrl = typeof params.inviteUrl === "string" ? params.inviteUrl : null;

  if (!membership) {
    return (
      <Client
        currentUserId={session.userId}
        membership={null}
        team={null}
        members={[]}
        pendingInvitations={[]}
        status={status}
        message={message}
        inviteUrl={inviteUrl}
      />
    );
  }

  const [team] = await db
    .select({ id: teams.id, name: teams.name })
    .from(teams)
    .where(eq(teams.id, membership.teamId))
    .limit(1);

  if (!team) redirect("/dashboard");

  const members = await db
    .select({
      id: teamMembers.id,
      role: teamMembers.role,
      userId: teamMembers.userId,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(teamMembers)
    .innerJoin(users, eq(users.id, teamMembers.userId))
    .where(eq(teamMembers.teamId, team.id))
    .orderBy(teamMembers.joinedAt);

  const memberEmails = new Set(members.map((m) => m.email.toLowerCase()));

  const allPendingInvitations = await db
    .select({
      id: teamInvitations.id,
      email: teamInvitations.email,
      role: teamInvitations.role,
    })
    .from(teamInvitations)
    .where(
      and(
        eq(teamInvitations.teamId, team.id),
        eq(teamInvitations.status, "pending")
      )
    )
    .orderBy(teamInvitations.createdAt);

  const pendingInvitations = allPendingInvitations.filter(
    (inv) => !memberEmails.has(inv.email.toLowerCase())
  );

  return (
    <Client
      currentUserId={session.userId}
      membership={{ role: membership.role }}
      team={{ name: team.name }}
      members={members}
      pendingInvitations={pendingInvitations}
      status={status}
      message={message}
      inviteUrl={inviteUrl}
    />
  );
}
