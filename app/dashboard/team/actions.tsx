"use server";

import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { teamInvitations, teamMembers, teams, users } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";

function redirectWithMessage(status: "success" | "error", message: string): never {
  const query = new URLSearchParams({ status, message });
  redirect(`/dashboard/team?${query.toString()}`);
}

async function requireTeamRole(
  userId: string,
  allowedRoles: string[]
): Promise<{ teamId: string; role: string }> {
  const [membership] = await db
    .select({ teamId: teamMembers.teamId, role: teamMembers.role })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  if (!membership || !allowedRoles.includes(membership.role)) {
    redirectWithMessage("error", "You do not have permission to perform this action.");
  }

  return membership;
}

const inviteSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  role: z.enum(["admin", "member"], {
    message: "Role must be admin or member.",
  }),
});

export async function inviteTeamMemberAction(formData: FormData) {
  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid invitation request."
    );
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const { teamId } = await requireTeamRole(session.userId, ["owner", "admin"]);

  const inviteeEmail = parsed.data.email.toLowerCase();

  if (inviteeEmail === session.email.toLowerCase()) {
    return redirectWithMessage("error", "You cannot invite yourself.");
  }

  const [existingMember] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .innerJoin(users, eq(users.id, teamMembers.userId))
    .where(and(eq(teamMembers.teamId, teamId), eq(users.email, inviteeEmail)))
    .limit(1);

  if (existingMember) {
    return redirectWithMessage("error", "This user is already a team member.");
  }

  const [existingInvite] = await db
    .select({ id: teamInvitations.id })
    .from(teamInvitations)
    .where(
      and(
        eq(teamInvitations.teamId, teamId),
        eq(teamInvitations.email, inviteeEmail),
        eq(teamInvitations.status, "pending")
      )
    )
    .limit(1);

  if (existingInvite) {
    return redirectWithMessage("error", "A pending invitation already exists for this email.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(teamInvitations).values({
    teamId,
    email: inviteeEmail,
    role: parsed.data.role,
    token,
    invitedByUserId: session.userId,
    status: "pending",
    expiresAt,
  });

  const [team] = await db
    .select({ name: teams.name })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const inviteUrl = `${baseUrl}/invite/${token}`;
  const teamName = team?.name ?? "the team";

  console.log(`[Invite] ${inviteeEmail} → ${inviteUrl}`);

  await sendEmail(
    inviteeEmail,
    `You're invited to join ${teamName}`,
    `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Team Invitation</h2>
      <p>You've been invited to join <strong>${teamName}</strong> as a <strong>${parsed.data.role}</strong>.</p>
      <p>
        <a href="${inviteUrl}" style="display: inline-block; padding: 10px 20px; background: #171717; color: #fff; text-decoration: none; border-radius: 6px;">
          Accept Invitation
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">This invitation expires in 7 days.</p>
    </div>
    `
  );

  const query = new URLSearchParams({
    status: "success",
    message: `Invitation sent to ${inviteeEmail}.`,
    inviteUrl,
  });
  redirect(`/dashboard/team?${query.toString()}`);
}

export async function revokeInvitationAction(formData: FormData) {
  const invitationId = formData.get("invitationId");
  if (typeof invitationId !== "string") {
    return redirectWithMessage("error", "Invalid invitation.");
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const { teamId } = await requireTeamRole(session.userId, ["owner", "admin"]);

  await db
    .update(teamInvitations)
    .set({ status: "expired" })
    .where(
      and(
        eq(teamInvitations.id, invitationId),
        eq(teamInvitations.teamId, teamId),
        eq(teamInvitations.status, "pending")
      )
    );

  return redirectWithMessage("success", "Invitation revoked.");
}

export async function removeTeamMemberAction(formData: FormData) {
  const memberId = formData.get("memberId");
  if (typeof memberId !== "string") {
    return redirectWithMessage("error", "Invalid member.");
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const { teamId } = await requireTeamRole(session.userId, ["owner", "admin"]);

  const [target] = await db
    .select({ role: teamMembers.role, userId: teamMembers.userId })
    .from(teamMembers)
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.teamId, teamId)))
    .limit(1);

  if (!target) {
    return redirectWithMessage("error", "Member not found.");
  }

  if (target.role === "owner") {
    return redirectWithMessage("error", "Cannot remove the team owner.");
  }

  if (target.userId === session.userId) {
    return redirectWithMessage("error", "You cannot remove yourself.");
  }

  await db
    .delete(teamMembers)
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.teamId, teamId)));

  return redirectWithMessage("success", "Member removed from the team.");
}

export async function updateMemberRoleAction(formData: FormData) {
  const memberId = formData.get("memberId");
  const newRole = formData.get("role");

  if (typeof memberId !== "string" || typeof newRole !== "string") {
    return redirectWithMessage("error", "Invalid request.");
  }

  if (!["admin", "member"].includes(newRole)) {
    return redirectWithMessage("error", "Invalid role.");
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const { teamId } = await requireTeamRole(session.userId, ["owner"]);

  const [target] = await db
    .select({ role: teamMembers.role, userId: teamMembers.userId })
    .from(teamMembers)
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.teamId, teamId)))
    .limit(1);

  if (!target) {
    return redirectWithMessage("error", "Member not found.");
  }

  if (target.role === "owner") {
    return redirectWithMessage("error", "Cannot change the owner's role.");
  }

  await db
    .update(teamMembers)
    .set({ role: newRole })
    .where(and(eq(teamMembers.id, memberId), eq(teamMembers.teamId, teamId)));

  return redirectWithMessage("success", "Member role updated.");
}

const teamNameSchema = z.object({
  name: z.string().trim().min(1, "Team name is required.").max(100),
});

export async function updateTeamNameAction(formData: FormData) {
  const parsed = teamNameSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid team name."
    );
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const { teamId } = await requireTeamRole(session.userId, ["owner", "admin"]);

  await db
    .update(teams)
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where(eq(teams.id, teamId));

  return redirectWithMessage("success", "Team name updated.");
}
