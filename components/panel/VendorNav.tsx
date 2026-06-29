"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "../store";

const items = [
  { href: "/satici-panel", key: "vpDashboard" },
  { href: "/satici-panel/urunler", key: "vpProducts" },
  { href: "/satici-panel/siparisler", key: "vpOrders" },
  { href: "/satici-panel/kazanc", key: "vpEarnings" },
  { href: "/satici-panel/ayarlar", key: "vpSettings" },
];

export function VendorNav() {
  const { t } = useStore();
  const path = usePathname();
  return (
    <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-line">
      {items.map((it) => {
        const active = path === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              active
                ? "border-gold text-forest-deep"
                : "border-transparent text-muted hover:text-forest"
            }`}
          >
            {t(it.key)}
          </Link>
        );
      })}
    </nav>
  );
}
