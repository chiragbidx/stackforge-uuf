import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "panda_auth_session";

const maxAgeSeconds = 60 * 60 * 24 * 7;
const authCookieOptions = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
  path: "/",
};

export type AuthSession = {
  userId: string;
  email: string;
};

export async function createAuthSession(userId: string, email: string) {
  const cookieStore = await cookies();
  const payload: AuthSession = { userId, email };
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(payload), {
    ...authCookieOptions,
    maxAge: maxAgeSeconds,
  });
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "", {
    ...authCookieOptions,
    maxAge: 0,
  });
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed.userId && parsed.email) {
      return parsed as AuthSession;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAuthSessionEmail(): Promise<string | null> {
  const session = await getAuthSession();
  return session?.email ?? null;
}
