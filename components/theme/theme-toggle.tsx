"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  mode?: "icon" | "inline";
  className?: string;
};

export function ThemeToggle({ mode = "icon", className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (mode === "inline") {
      return (
        <Button size="sm" variant="ghost" aria-label="Toggle theme" className={cn("w-full justify-start", className)}>
          <span className="sr-only">Toggle theme</span>
        </Button>
      );
    }
    return <Button size="icon" variant="outline" aria-label="Toggle theme" className={cn("opacity-0", className)} />;
  }

  const isDark = resolvedTheme === "dark";

  if (mode === "inline") {
    return (
      <Button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        size="sm"
        variant="ghost"
        className={cn("w-full justify-start gap-3", className)}
      >
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "rounded-full transition-transform hover:-translate-y-0.5",
        className
      )}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

// Backward-compatible alias for older imports.
export const ModeToggle = ThemeToggle;
