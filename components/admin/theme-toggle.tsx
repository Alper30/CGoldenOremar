"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminTheme } from "@/hooks/use-admin-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useAdminTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:bg-muted",
        className,
      )}
    >
      {mounted && theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
