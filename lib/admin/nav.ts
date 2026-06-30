import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FileCheck2,
  PackageSearch,
  ShoppingCart,
  Store,
  Users,
  Wallet,
  Settings,
  Star,
  BarChart3,
  MessageSquare,
  Bell,
  ScrollText,
  UserPlus,
} from "lucide-react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** admin_stats alanı (bekleyen sayısı rozeti) */
  badgeKey?: "pending_applications" | "pending_products" | "pending_payouts";
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Genel",
    items: [
      { key: "dashboard", label: "Gösterge Paneli", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operasyon",
    items: [
      { key: "applications", label: "Satıcı Başvuruları", href: "/admin/basvurular", icon: FileCheck2, badgeKey: "pending_applications" },
      { key: "assisted", label: "Üretici Ekle (Yardımlı)", href: "/admin/uretici-ekle", icon: UserPlus },
      { key: "moderation", label: "Ürün Moderasyonu", href: "/admin/urunler", icon: PackageSearch, badgeKey: "pending_products" },
      { key: "orders", label: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
      { key: "vendors", label: "Satıcılar", href: "/admin/saticilar", icon: Store },
      { key: "users", label: "Kullanıcılar", href: "/admin/kullanicilar", icon: Users },
      { key: "payments", label: "Ödemeler", href: "/admin/odemeler", icon: Wallet, badgeKey: "pending_payouts" },
    ],
  },
  {
    label: "İçerik & Destek",
    items: [
      { key: "reviews", label: "Değerlendirmeler", href: "/admin/degerlendirmeler", icon: Star },
      { key: "reports", label: "Raporlar", href: "/admin/raporlar", icon: BarChart3 },
      { key: "support", label: "Destek / Mesajlar", href: "/admin/destek", icon: MessageSquare },
      { key: "notifications", label: "Bildirimler", href: "/admin/bildirimler", icon: Bell },
      { key: "logs", label: "Aktivite Kaydı", href: "/admin/loglar", icon: ScrollText },
    ],
  },
  {
    label: "Sistem",
    items: [
      { key: "settings", label: "Platform Ayarları", href: "/admin/ayarlar", icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

// En uzun eşleşen href'e göre aktif başlık (örn. /admin/urunler).
export function navTitleFor(pathname: string): string {
  const match = ALL_ITEMS.filter(
    (i) => pathname === i.href || (i.href !== "/admin" && pathname.startsWith(i.href)),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Yönetim Paneli";
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}
