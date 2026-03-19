import { and, eq, gt } from "drizzle-orm";

import Client from "@/app/auth/reset-password/[token]/client";
import { db } from "@/lib/db/client";
import { authTokens } from "@/lib/db/schema";

// Purpose: Server route entry for /auth/reset-password/[token].
// Validates the token server-side before rendering the form.

export const dynamic = "force-dynamic";

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = await params;

  const [row] = await db
    .select({ id: authTokens.id })
    .from(authTokens)
    .where(
      and(
        eq(authTokens.token, token),
        eq(authTokens.type, "password_reset"),
        gt(authTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  return <Client token={token} valid={!!row} />;
}
