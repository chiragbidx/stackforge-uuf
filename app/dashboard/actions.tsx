"use server";

import { redirect } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/session";

export async function signOutAction() {
  await clearAuthSession();
  redirect("/auth#signin");
}
