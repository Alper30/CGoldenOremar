"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, X } from "lucide-react";
import { NAV_GROUPS, isNavActive } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  badges?: Record<string, number>;
}

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile, badges = {} }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-[width,transform] duration-300 ease-in-out border-r border-sidebar-border",
          collapsed ? "w-[76px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground font-bold">
            GO
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">Golden Oremar</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Yönetim Paneli</p>
            </div>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
            aria-label="Menüyü kapat"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(pathname, item.href);
                  const badgeVal = item.badgeKey ? badges[item.badgeKey] : undefined;
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-sidebar-primary/15 text-sidebar-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                        )}
                        <Icon className="size-[18px] shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && badgeVal !== undefined && badgeVal > 0 && (
                          <span className="ml-auto rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-semibold text-gold">
                            {badgeVal}
                          </span>
                        )}
                        {collapsed && badgeVal !== undefined && badgeVal > 0 && (
                          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gold" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-sidebar-border p-3 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <ChevronsLeft className={cn("size-[18px] shrink-0 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Daralt</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
