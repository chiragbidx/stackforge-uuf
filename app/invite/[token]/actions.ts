"use server";

import { eq, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { teamInvitations, teamMembers, teams } from "@/lib/db/schema";

/**
 * Invite acceptance server-action reference.
 *
 * Pattern:
 * 1) Parse and validate token from FormData.
 * 2) Require authenticated session.
 * 3) Re-check invitation validity server-side (never trust client/UI state).
 * 4) Apply tenant membership mutation.
 * 5) Finalize invitation status + cleanup side effects.
 * 6) Redirect with user-facing status.
 */
export async function acceptInvitationAction(formData: FormData) {
  const token = formData.get("token");
  if (typeof token !== "string") {
    redirect("/dashboard");
  }

  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  const [invitation] = await db
    .select()
    .from(teamInvitations)
    .where(
      and(
        eq(teamInvitations.token, token),
        eq(teamInvitations.status, "pending")
      )
    )
    .limit(1);

  if (!invitation) {
    redirect("/dashboard?status=error&message=Invitation+not+found+or+already+used.");
  }

  if (invitation.expiresAt < new Date()) {
    await db
      .update(teamInvitations)
      .set({ status: "expired" })
      .where(eq(teamInvitations.id, invitation.id));
    redirect("/dashboard?status=error&message=Invitation+has+expired.");
  }

  const [existingMembership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(
      and(
        eq(teamMembers.teamId, invitation.teamId),
        eq(teamMembers.userId, session.userId)
      )
    )
    .limit(1);

  if (!existingMembership) {
    await db.insert(teamMembers).values({
      teamId: invitation.teamId,
      userId: session.userId,
      role: invitation.role,
    });
  }

  // Mark ALL pending invitations for this email + team as accepted
  await db
    .update(teamInvitations)
    .set({ status: "accepted" })
    .where(
      and(
        eq(teamInvitations.teamId, invitation.teamId),
        eq(teamInvitations.email, invitation.email),
        eq(teamInvitations.status, "pending")
      )
    );

  // Remove orphan personal team if user has no other reason to keep it
  // (e.g. they signed up via invite and got no personal team, or they
  // had an auto-created team with only themselves)
  const userTeams = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId));

  for (const ut of userTeams) {
    if (ut.teamId === invitation.teamId) continue;
    if (ut.role !== "owner") continue;

    const memberCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(teamMembers)
      .where(eq(teamMembers.teamId, ut.teamId));

    if (memberCount[0].count === 1) {
      await db.delete(teamMembers).where(eq(teamMembers.teamId, ut.teamId));
      await db.delete(teams).where(eq(teams.id, ut.teamId));
    }
  }

  redirect("/dashboard/team?status=success&message=You+have+joined+the+team!");
}
