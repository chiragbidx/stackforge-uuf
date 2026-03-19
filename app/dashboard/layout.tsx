import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { signOutAction } from "@/app/dashboard/actions";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }

  const [user] = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) {
    redirect("/auth#signin");
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials =
    `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-[264px] shrink-0 border-r bg-card/50 md:flex md:flex-col">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-foreground text-background text-sm font-bold shadow-sm">
                P
              </div>
              {/* Dashboard Text Logo */}
              <span className="font-semibold tracking-tight">Panda</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav />
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
            <MobileNav
              fullName={fullName}
              email={user.email}
              initials={initials}
            />

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <UserMenu
                fullName={fullName}
                email={user.email}
                initials={initials}
                signOutAction={signOutAction}
              />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
