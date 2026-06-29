"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

// Admin kabuğu — .admin-scope ile izole tema (public site etkilenmez), varsayılan
// koyu mod. Sidebar/Topbar Next routing ile çalışır. badges sunucudan gelir.
export function AdminShell({
  children,
  badges,
  userInitial,
}: {
  children: React.ReactNode;
  badges: Record<string, number>;
  userInitial?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div id="admin-root" className="admin-scope dark min-h-screen bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        badges={badges}
      />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64",
        )}
      >
        <Topbar onOpenMobile={() => setMobileOpen(true)} initial={userInitial} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
