"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { clearAuthSession, createAuthSession, getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

function redirectWithMessage(status: "success" | "error", message: string): never {
  const query = new URLSearchParams({ status, message });
  redirect(`/dashboard/settings?${query.toString()}`);
}

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
});

const emailSchema = z.object({
  newEmail: z.string().trim().email("Please enter a valid email address."),
  currentPassword: z.string().min(1, "Current password is required."),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirmation must match.",
  });

export async function updateProfileAction(formData: FormData) {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    return redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid profile update."
    );
  }

  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  await db
    .update(users)
    .set({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.userId));

  return redirectWithMessage("success", "Profile updated successfully.");
}

export async function updateEmailAction(formData: FormData) {
  const parsed = emailSchema.safeParse({
    newEmail: formData.get("newEmail"),
    currentPassword: formData.get("currentPassword"),
  });

  if (!parsed.success) {
    return redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid email update request."
    );
  }

  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  const [currentUser] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!currentUser) {
    await clearAuthSession();
    redirect("/auth#signin");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    parsed.data.currentPassword,
    currentUser.passwordHash
  );
  if (!isCurrentPasswordValid) {
    return redirectWithMessage("error", "Current password is incorrect.");
  }

  const normalizedEmail = parsed.data.newEmail.toLowerCase();
  const [takenUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, normalizedEmail), ne(users.id, currentUser.id)))
    .limit(1);

  if (takenUser) {
    return redirectWithMessage("error", "That email is already in use.");
  }

  await db
    .update(users)
    .set({
      email: normalizedEmail,
      updatedAt: new Date(),
    })
    .where(eq(users.id, currentUser.id));

  await createAuthSession(currentUser.id, normalizedEmail);
  return redirectWithMessage("success", "Email updated successfully.");
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid password update request."
    );
  }

  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  const [currentUser] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!currentUser) {
    await clearAuthSession();
    redirect("/auth#signin");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    parsed.data.currentPassword,
    currentUser.passwordHash
  );
  if (!isCurrentPasswordValid) {
    return redirectWithMessage("error", "Current password is incorrect.");
  }

  const nextPasswordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db
    .update(users)
    .set({
      passwordHash: nextPasswordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, currentUser.id));

  return redirectWithMessage("success", "Password updated successfully.");
}

const deleteAccountSchema = z.object({
  currentPassword: z.string().min(1, "Password is required to delete your account."),
});

export async function deleteAccountAction(formData: FormData) {
  const parsed = deleteAccountSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
  });

  if (!parsed.success) {
    return redirectWithMessage(
      "error",
      parsed.error.issues[0]?.message ?? "Invalid request."
    );
  }

  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  const [currentUser] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  if (!currentUser) {
    await clearAuthSession();
    redirect("/auth#signin");
  }

  const isPasswordValid = await bcrypt.compare(
    parsed.data.currentPassword,
    currentUser.passwordHash
  );
  if (!isPasswordValid) {
    return redirectWithMessage("error", "Password is incorrect. Account was not deleted.");
  }

  await db.delete(users).where(eq(users.id, currentUser.id));
  await clearAuthSession();
  redirect("/auth#signin");
}
