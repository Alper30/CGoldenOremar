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
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-5 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-start gap-2.5 sm:items-center sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-bg text-gold-deep sm:h-11 sm:w-11">
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold leading-snug text-forest-deep">{title}</span>
            <span className="text-xs leading-snug text-muted">{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
