import "server-only";

import { runCommand } from "@/scripts/commandRunner.js";

function jsonError(
  status: number,
  error: string,
  message: string,
  details?: unknown
) {
  return Response.json(
    {
      success: false,
      error,
      message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

function isPayloadError(message: string) {
  return (
    message.includes("payload") ||
    message.includes("action") ||
    message.includes("args") ||
    message.includes("invalid command string")
  );
}

export async function POST(req: Request) {
  const runToken = process.env.RUN_TOKEN;
  if (!runToken) {
    return jsonError(
      500,
      "AUTH_MISCONFIGURED",
      "RUN_TOKEN is not configured on the server"
    );
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return jsonError(
      401,
      "UNAUTHORIZED",
      "Missing Authorization header. Use Bearer <token>."
    );
  }

  const [scheme, token, extra] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token || extra) {
    return jsonError(
      401,
      "UNAUTHORIZED",
      "Malformed Authorization header. Expected Bearer <token>."
    );
  }

  if (token !== runToken) {
    return jsonError(403, "FORBIDDEN", "Invalid bearer token");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "INVALID_PAYLOAD", "Request body must be valid JSON");
  }

  try {
    const result = await runCommand(body, { timeoutMs: 60_000 });
    return Response.json(result, { status: 200 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "BUSY") {
      return jsonError(409, "RUNNER_BUSY", "Another command is already running");
    }

    if (error instanceof Error) {
      const message = error.message || "Unknown command runner error";
      return jsonError(
        isPayloadError(message) ? 400 : 500,
        isPayloadError(message) ? "INVALID_PAYLOAD" : "RUNNER_FAILURE",
        message
      );
    }

    return jsonError(500, "RUNNER_FAILURE", "Unknown command runner failure");
  }
}
