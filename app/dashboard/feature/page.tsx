import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import Client from "@/app/dashboard/feature/client";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { featureItems, teamMembers } from "@/lib/db/schema";

// Purpose: Server route entry for /dashboard/feature.
// Keep request parsing, auth checks, and server data loading here,
// then pass props into `client.tsx` for interactive UI.
//
// Replication guide for new dashboard pages:
// 1) Keep auth/session checks in this server file.
// 2) Query tenant-scoped records here (never in client component).
// 3) Normalize URL query params for flash messages/status.
// 4) Convert Date/non-serializable fields before passing to client.
// 5) Pass permission flags (`canManage`) so client can hide/disable controls.

export const dynamic = "force-dynamic";
// Force runtime rendering because this page depends on session + live DB reads.
// Copy this for pages that read user/team-specific data during render.

type FeaturePlaceholderPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function FeaturePlaceholderPage({
  searchParams,
}: FeaturePlaceholderPageProps) {
  // Step 1: require authenticated session for dashboard routes.
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  // Step 2: resolve tenant membership once and reuse it for all data access.
  const [membership] = await db
    .select({
      teamId: teamMembers.teamId,
      role: teamMembers.role,
    })
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.userId))
    .limit(1);

  // Step 3: parse action feedback query params into strict UI-safe values.
  const params = (await searchParams) ?? {};
  const status =
    params.status === "success" || params.status === "error"
      ? params.status
      : null;
  const message = typeof params.message === "string" ? params.message : null;

  if (!membership) {
    // Safety branch: if user has no team membership, keep UI read-only and empty.
    // Returning a client page here avoids hard errors and keeps behavior explicit.
    return (
      <Client
        status={status}
        message={message}
        canManage={false}
        items={[]}
      />
    );
  }

  // Step 4: read tenant-scoped data for the page list.
  const items = await db
    .select({
      id: featureItems.id,
      title: featureItems.title,
      description: featureItems.description,
      status: featureItems.status,
      updatedAt: featureItems.updatedAt,
    })
    .from(featureItems)
    .where(eq(featureItems.teamId, membership.teamId))
    .orderBy(desc(featureItems.updatedAt));

  return (
    // Step 5: only pass serializable data into the client component.
    // Dates are converted to ISO strings so client can format safely.
    <Client
      status={status}
      message={message}
      canManage={membership.role === "owner" || membership.role === "admin"}
      items={items.map((item) => ({
        ...item,
        updatedAt: item.updatedAt.toISOString(),
      }))}
    />
  );
}
