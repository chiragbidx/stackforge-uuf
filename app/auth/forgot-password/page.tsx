import Client from "@/app/auth/forgot-password/client";

// Purpose: Server route entry for /auth/forgot-password.
// No server-side data needed; renders client form directly.

export default function ForgotPasswordPage() {
  return <Client />;
}
