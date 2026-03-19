import Client from "@/app/auth/client";

// Purpose: Server route entry for /auth.
// Keep request parsing and server-side checks here,
// then pass prepared props into `client.tsx`.
//
// Replication pattern for new routes:
// 1) Parse/normalize `searchParams` in this server file.
// 2) Run server-only checks/data fetches here.
// 3) Pass serializable props to a co-located `client.tsx`.
// 4) Keep this file free of browser-only hooks/state.

type AuthPageProps = {
  searchParams?: Promise<{
    redirect?: string;
    status?: string;
    message?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = (await searchParams) ?? {};
  const redirectTo = typeof params.redirect === "string" ? params.redirect : "";
  const status =
    params.status === "success" || params.status === "error"
      ? params.status
      : null;
  const message = typeof params.message === "string" ? params.message : null;

  return <Client redirectTo={redirectTo} flashStatus={status} flashMessage={message} />;
}
