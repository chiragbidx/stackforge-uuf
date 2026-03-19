"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { featureItems, teamMembers } from "@/lib/db/schema";

/**
 * Feature CRUD server-action reference template.
 *
 * Why this file exists:
 * - Gives future feature implementations a copy-ready pattern for secure writes.
 * - Demonstrates validation + auth + tenant guard + mutation + UX feedback.
 *
 * How to replicate for a new entity:
 * 1) Keep the file server-only (`"use server"` at top).
 * 2) Add Zod schemas for each action payload.
 * 3) Resolve current session user.
 * 4) Resolve team membership and role authorization.
 * 5) Scope every DB write by tenant key (teamId here).
 * 6) Redirect back with status/message for post-action UX.
 */

// Shared helper to standardize UI feedback. Client page reads these query params.
function redirectWithMessage(status: "success" | "error", message: string): never {
  const query = new URLSearchParams({ status, message });
  redirect(`/dashboard/feature?${query.toString()}`);
}

// Base tenant guard used by both read/write permissions.
// If your next feature uses a different tenant model, replace this helper first.
async function requireTeamMembership(userId: string) {
  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);

  if (!membership) {
    redirectWithMessage("error", "You must belong to a team to use this feature.");
  }

  return membership;
}

// Write guard used for create/update/delete.
// Keep read permission and write permission separate so you can expand roles safely later.
async function requireManageRole(userId: string) {
  const membership = await requireTeamMembership(userId);
  if (!["owner", "admin"].includes(membership.role)) {
    redirectWithMessage("error", "Only owner/admin can change feature items.");
  }
  return membership;
}

// Input contracts:
// - Keep these close to actions so field changes stay synchronized.
// - Reuse the create schema in update schema when payloads overlap.
const createFeatureItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(80, "Title is too long."),
  description: z.string().trim().max(500, "Description is too long."),
  status: z.enum(["active", "inactive"], {
    message: "Status must be active or inactive.",
  }),
});

const updateFeatureItemSchema = createFeatureItemSchema.extend({
  id: z.string().trim().min(1, "Item id is required."),
});

const deleteFeatureItemSchema = z.object({
  id: z.string().trim().min(1, "Item id is required."),
});

// CREATE action pattern:
// validate -> auth -> role guard -> tenant-scoped insert -> redirect with message
export async function createFeatureItemAction(formData: FormData) {
  const parsed = createFeatureItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid create request."
    );
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const membership = await requireManageRole(session.userId);

  await db.insert(featureItems).values({
    teamId: membership.teamId,
    title: parsed.data.title,
    description: parsed.data.description,
    status: parsed.data.status,
    updatedAt: new Date(),
  });

  redirectWithMessage("success", "Feature item created.");
}

// UPDATE action pattern:
// validate -> auth -> role guard -> tenant-scoped update by (id + teamId) -> redirect
// Note: scoping by both id and teamId prevents cross-tenant updates.
export async function updateFeatureItemAction(formData: FormData) {
  const parsed = updateFeatureItemSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid update request."
    );
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const membership = await requireManageRole(session.userId);

  await db
    .update(featureItems)
    .set({
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(featureItems.id, parsed.data.id),
        eq(featureItems.teamId, membership.teamId)
      )
    );

  redirectWithMessage("success", "Feature item updated.");
}

// DELETE action pattern:
// validate -> auth -> role guard -> tenant-scoped delete by (id + teamId) -> redirect
// If your feature needs soft-delete, swap this delete for a status update.
export async function deleteFeatureItemAction(formData: FormData) {
  const parsed = deleteFeatureItemSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid delete request."
    );
  }

  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const membership = await requireManageRole(session.userId);

  await db
    .delete(featureItems)
    .where(
      and(
        eq(featureItems.id, parsed.data.id),
        eq(featureItems.teamId, membership.teamId)
      )
    );

  redirectWithMessage("success", "Feature item deleted.");
}
