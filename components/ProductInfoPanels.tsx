"use client";

import { useStore } from "./store";
import { SnowIcon, ShieldIcon, TruckIcon, VerifiedIcon } from "./icons";

// Ürün detayındaki hikâye / öne çıkanlar / güven notları — dil deposuna (TR/KU)
// erişebilmek için sunucu sayfasından ayrılmış istemci bileşeni.
export function ProductInfoPanels({
  story,
  features,
  coldChain,
}: {
  story?: string;
  features?: string[];
  coldChain?: boolean;
}) {
  const { t } = useStore();
  return (
    <>
      {story && (
        <div className="mt-6 rounded-2xl border border-gold/30 bg-amber-bg/50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-deep">
            {t("pdStoryTitle")}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/90">
            {story}
          </p>
        </div>
      )}

      {features && features.length > 0 && (
        <ul className="mt-6 space-y-2 rounded-2xl border border-line bg-card p-5 text-sm">
          <li className="text-xs font-semibold uppercase tracking-wider text-muted">
            {t("pdFeaturesTitle")}
          </li>
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-ink/90">
              <VerifiedIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-6 space-y-2.5 rounded-2xl border border-line bg-card p-5 text-sm">
        {coldChain && (
          <li className="flex items-center gap-2.5 text-ink/90">
            <SnowIcon className="h-5 w-5 shrink-0 text-forest" />
            {t("pdColdChain")}
          </li>
        )}
        <li className="flex items-center gap-2.5 text-ink/90">
          <ShieldIcon className="h-5 w-5 shrink-0 text-forest" />
          {t("pdEscrow")}
        </li>
        <li className="flex items-center gap-2.5 text-ink/90">
          <TruckIcon className="h-5 w-5 shrink-0 text-forest" />
          {t("pdTracking")}
        </li>
      </ul>
    </>
  );
}
