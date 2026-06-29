"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { navTitleFor } from "@/lib/admin/nav";
import { ThemeToggle } from "./theme-toggle";

export function Topbar({ onOpenMobile, initial }: { onOpenMobile: () => void; initial?: string }) {
  const pathname = usePathname();
  const title = navTitleFor(pathname);
  const who = (initial ?? "AD").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <button
        type="button"
        onClick={onOpenMobile}
        className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Menüyü aç"
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0">
        <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Yönetim Modu
        </span>
        <h1 className="truncate text-base font-semibold leading-tight sm:text-lg">{title}</h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Ara: sipariş, satıcı, kullanıcı..."
            className="h-9 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <button
          type="button"
          className="relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Bildirimler"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-gold ring-2 ring-card" />
        </button>

        <ThemeToggle />

        <div className="flex items-center gap-2 rounded-lg border border-border bg-card py-1 pl-1 pr-3">
          <div className="flex size-7 items-center justify-center rounded-md bg-gold/20 text-xs font-bold text-gold">
            {who}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold">Admin</p>
            <p className="text-[10px] text-muted-foreground">Yönetici</p>
          </div>
        </div>
      </div>
    </header>
  );
}
