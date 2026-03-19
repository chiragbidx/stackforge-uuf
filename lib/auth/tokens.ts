import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { authTokens } from "@/lib/db/schema";

type TokenType = "email_verification" | "password_reset";

const TOKEN_TTL: Record<TokenType, number> = {
  email_verification: 24 * 60 * 60 * 1000,
  password_reset: 60 * 60 * 1000,
};

export async function generateAuthToken(
  userId: string,
  type: TokenType
): Promise<string> {
  await db
    .delete(authTokens)
    .where(and(eq(authTokens.userId, userId), eq(authTokens.type, type)));

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_TTL[type]);

  await db.insert(authTokens).values({ userId, token, type, expiresAt });

  return token;
}

export async function consumeAuthToken(
  token: string,
  type: TokenType
): Promise<string | null> {
  const [row] = await db
    .select({ id: authTokens.id, userId: authTokens.userId })
    .from(authTokens)
    .where(
      and(
        eq(authTokens.token, token),
        eq(authTokens.type, type),
        gt(authTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!row) return null;

  await db.delete(authTokens).where(eq(authTokens.id, row.id));

  return row.userId;
}
