import "server-only";

import { getRunnerState } from "@/scripts/commandRunner.js";

function parseBoolean(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) {
    return defaultValue;
  }

  return !["false", "0", "no", "off"].includes(value.toLowerCase());
}

export async function GET() {
  const dev = parseBoolean(process.env.NEXT_DEV, true);

  return Response.json(
    {
      ok: true,
      service: "next-route-handler",
      busy: getRunnerState().busy,
      timestamp: new Date().toISOString(),
      env: dev ? "development" : "production",
    },
    { status: 200 }
  );
}
