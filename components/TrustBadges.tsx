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
  return (
    // Mobil: yatay kaydırılabilir snap carousel (sonraki kart kenarı görünür).
    // sm+: eski grid düzeni korunur.
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="flex shrink-0 basis-[78%] snap-start items-center gap-3 rounded-2xl border border-line bg-card p-4 sm:basis-auto sm:shrink sm:items-center sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
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
  );
}
