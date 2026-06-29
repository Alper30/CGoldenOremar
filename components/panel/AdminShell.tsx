"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type SVGProps } from "react";
import { useStore } from "../store";

type Item = { href: string; key: string; icon: (p: SVGProps<SVGSVGElement>) => React.ReactElement };

const I = {
  dash: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  apps: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <path d="M9 12h6M9 16h6M9 8h6" strokeLinecap="round" /><rect x="4" y="3" width="16" height="18" rx="2" />
    </svg>
  ),
  prod: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" strokeLinejoin="round" />
    </svg>
  ),
  orders: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <path d="M6 6h15l-1.5 9h-12z" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6L5 3H2" strokeLinecap="round" />
    </svg>
  ),
  vendors: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16" strokeLinejoin="round" /><path d="M9 20v-5h6v5" />
    </svg>
  ),
  users: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /><path d="M16 4a3 3 0 010 6M21 20c0-2.4-1.4-4.5-3.5-5.5" strokeLinecap="round" />
    </svg>
  ),
  payouts: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><circle cx="17" cy="14" r="1.3" />
    </svg>
  ),
  settings: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...p}>
      <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" strokeLinecap="round" />
    </svg>
  ),
};

const items: Item[] = [
  { href: "/admin", key: "adDashboard", icon: I.dash },
  { href: "/admin/basvurular", key: "adApplications", icon: I.apps },
  { href: "/admin/urunler", key: "adProductMod", icon: I.prod },
  { href: "/admin/siparisler", key: "adOrders", icon: I.orders },
  { href: "/admin/saticilar", key: "adVendors", icon: I.vendors },
  { href: "/admin/kullanicilar", key: "adUsers", icon: I.users },
  { href: "/admin/odemeler", key: "adPayouts", icon: I.payouts },
  { href: "/admin/ayarlar", key: "adSettings", icon: I.settings },
];

function NavList({
  path,
  label,
  collapsed,
  onNavigate,
}: {
  path: string;
  label: (key: string) => string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const is = path === it.href;
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={onNavigate}
            title={label(it.key)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              is ? "bg-forest text-cream" : "text-forest-deep hover:bg-cream"
            } ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>{label(it.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { t } = useStore();
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const active = items.find((it) => it.href === path) ?? items[0];

  return (
    <div className="mx-auto flex w-full max-w-[1500px] gap-0 lg:gap-6 lg:px-6 lg:py-8">
      {/* Masaüstü sidebar */}
      <aside
        className={`hidden shrink-0 lg:sticky lg:top-24 lg:block lg:self-start ${
          collapsed ? "lg:w-[68px]" : "lg:w-60"
        }`}
      >
        <div className="rounded-2xl border border-line bg-card p-3">
          <div className={`mb-3 flex items-center ${collapsed ? "justify-center" : "justify-between"} px-1`}>
            {!collapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("adTitle")}</span>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Daralt"
              className="rounded-lg p-1.5 text-muted hover:bg-cream hover:text-forest"
            >
              <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <NavList path={path} label={t} collapsed={collapsed} />
        </div>
      </aside>

      {/* İçerik */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-0 lg:py-0">
        {/* Mobil üst bar */}
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Menü"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-forest"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">{t("adTitle")}</p>
            <p className="truncate font-display text-lg text-forest-deep">{t(active.key)}</p>
          </div>
        </div>

        {children}
      </main>

      {/* Mobil drawer */}
      {drawer && (
        <>
          <div className="fixed inset-0 z-40 bg-forest-deep/40 lg:hidden" onClick={() => setDrawer(false)} aria-hidden />
          <div className="fixed inset-y-0 left-0 z-50 w-72 max-w-[82vw] overflow-y-auto bg-cream p-4 shadow-xl lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t("adTitle")}</span>
              <button onClick={() => setDrawer(false)} aria-label="Kapat" className="rounded-lg p-1.5 text-muted hover:bg-card">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <NavList path={path} label={t} collapsed={false} onNavigate={() => setDrawer(false)} />
          </div>
        </>
      )}
    </div>
  );
}
