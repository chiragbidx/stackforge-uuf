"use client";

import { useEffect } from "react";

export function InviteLogger({ url }: { url: string | null }) {
  useEffect(() => {
    if (url) {
      console.log(
        "%c[Invite Link]%c %s",
        "color: #22c55e; font-weight: bold",
        "color: inherit",
        url
      );
    }
  }, [url]);
  return null;
}
