"use client";

import { useState } from "react";

export function AgentActionPanel() {
  const [note, setNote] = useState("");

  return (
    <div className="rounded-xl border border-[#fb7232]/20 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#5a2a12]">Quick note</p>
        <span className="text-xs text-[#c75829]">Client-only</span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot instructions for your next run…"
        className="mt-3 w-full rounded-lg border border-[#fb7232]/20 bg-white/80 p-3 text-sm text-[#33170a] outline-none transition focus:border-[#fb7232] focus:shadow-sm"
        rows={4}
      />
      <p className="mt-2 text-[11px] text-[#6a3515]">This stays local to the browser for your session.</p>
    </div>
  );
}
