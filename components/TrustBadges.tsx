"use client";

import { VerifiedIcon, ShieldIcon, TruckIcon, RefreshIcon } from "./icons";
import { useStore } from "./store";

export function TrustBadges() {
  const { t } = useStore();
  const items = [
    { icon: VerifiedIcon, title: t("trust1t"), text: t("trust1d") },
    { icon: ShieldIcon, title: t("trust2t"), text: t("trust2d") },
    { icon: TruckIcon, title: t("trust3t"), text: t("trust3d") },
    { icon: RefreshIcon, title: t("trust4t"), text: t("trust4d") },
  ];
  // Kesintisiz döngü için listeyi iki kez basıyoruz; ikinci kopya ekran
  // okuyuculardan gizli (aria-hidden).
  const loop = [...items, ...items];

  return (
    // Hem mobil hem PC'de soldan-sağa yavaş kayan sonsuz şerit.
    // İnteraktif: üstüne gelince (hover) durur; kenarlarda yumuşak geçiş (fade).
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-cream to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-cream to-transparent sm:w-16" />
      <div className="flex w-max animate-trust-marquee gap-3 group-hover:[animation-play-state:paused] sm:gap-5">
        {loop.map(({ icon: Icon, title, text }, i) => (
          <div
            key={i}
            aria-hidden={i >= items.length}
            className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-line bg-card p-4 sm:w-72"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-bg text-gold-deep">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold leading-snug text-forest-deep">{title}</span>
              <span className="text-xs leading-snug text-muted">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
