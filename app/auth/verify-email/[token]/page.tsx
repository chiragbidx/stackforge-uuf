import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth/session";
import { consumeAuthToken } from "@/lib/auth/tokens";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

// Purpose: Server-only route for /auth/verify-email/[token].
// Consumes a single-use token and marks the user's email as verified.
// No client component needed — always redirects.

export const dynamic = "force-dynamic";

type VerifyEmailPageProps = {
  params: Promise<{ token: string }>;
};

export default async function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const { token } = await params;

  const userId = await consumeAuthToken(token, "email_verification");

  if (!userId) {
    const query = new URLSearchParams({
      status: "error",
      message: "Invalid or expired verification link.",
    });
    redirect(`/auth?${query.toString()}#signin`);
  }

  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId));

  const session = await getAuthSession();
  if (session) {
    redirect("/dashboard");
  }

  const query = new URLSearchParams({
    status: "success",
    message: "Email verified successfully. You can now sign in.",
  });
  redirect(`/auth?${query.toString()}#signin`);
}
