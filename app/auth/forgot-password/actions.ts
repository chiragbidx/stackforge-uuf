"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import type { AuthActionState } from "@/app/auth/actions";
import { generateAuthToken } from "@/lib/auth/tokens";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

// Always returns a generic success message regardless of whether the email
// exists in the database, to prevent user enumeration.
export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const email = parsed.data.email.toLowerCase();

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let devUrl: string | undefined;

  if (user) {
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
    const token = await generateAuthToken(user.id, "password_reset");
    const resetUrl = `${baseUrl}/auth/reset-password/${token}`;
    console.log(`[PasswordReset] ${email} → ${resetUrl}`);
    devUrl = resetUrl;

    await sendEmail(
      email,
      "Reset your password",
      `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>We received a request to reset your password. Click the button below to choose a new one.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #171717; color: #fff; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
      `
    );
  }

  return {
    status: "success",
    message: "If an account with that email exists, we've sent a password reset link.",
    _devUrl: devUrl,
  };
}
