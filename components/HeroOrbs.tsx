"use client";

import { useEffect, useMemo, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Shield, LineChart, Settings } from "lucide-react";

type Orb = {
  id: string;
  icon: LucideIcon;
  size: number;
  color: string;
  strokeWidth?: number;
  base: { x: string; y: string };
  delay?: string;
};

export function HeroOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbs = useMemo<Orb[]>(
    () => [
      { id: "shield", icon: Shield, size: 64, color: "#fb7232", strokeWidth: 1.3, base: { x: "8%", y: "12%" } },
      { id: "chart", icon: LineChart, size: 56, color: "#c75829", strokeWidth: 1.3, base: { x: "85%", y: "18%" }, delay: "0.5s" },
      { id: "settings", icon: Settings, size: 60, color: "#fb7232", strokeWidth: 1.3, base: { x: "52%", y: "88%" }, delay: "1s" },
    ],
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frame = 0;
    const handleMove = (e: MouseEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--orb-tilt-x", `${relX * 16}px`);
        el.style.setProperty("--orb-tilt-y", `${relY * 16}px`);
      });
    };

    const handleLeave = () => {
      el.style.setProperty("--orb-tilt-x", "0px");
      el.style.setProperty("--orb-tilt-y", "0px");
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {orbs.map((orb, idx) => (
        <div
          key={orb.id}
          className="absolute animate-float-slow will-change-transform"
          style={{
            left: orb.base.x,
            top: orb.base.y,
            animationDelay: orb.delay ?? `${idx * 0.6}s`,
            transform: "translate(calc(var(--orb-tilt-x, 0px) * 0.6), calc(var(--orb-tilt-y, 0px) * 0.6))",
            transition: "transform 160ms ease-out",
            opacity: 0.8,
          }}
        >
          <orb.icon size={orb.size} color={orb.color} strokeWidth={orb.strokeWidth ?? 1.5} />
        </div>
      ))}
    </div>
  );
}
