"use client";

import Link from "next/link";
import { useStore } from "./store";
import { VerifiedIcon, ArrowRightIcon } from "./icons";

export function OrderSuccessBanner({ orderId }: { orderId: string }) {
  const { t } = useStore();
  return (
    <div className="mb-6 rounded-3xl border border-green-200 bg-green-50 p-7 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
        <VerifiedIcon className="h-7 w-7" />
      </span>
      <h1 className="mt-4 font-display text-2xl text-forest-deep sm:text-3xl">
        {t("coSuccessTitle")}
      </h1>
      <p className="mt-1.5 text-muted">{t("coSuccessSub")}</p>
      <p className="mt-2 text-sm font-medium text-forest-deep">
        {t("coOrderNo")}: #{orderId.slice(0, 8).toUpperCase()}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/hesabim"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-cream hover:bg-gold-deep"
        >
          {t("coViewOrders")}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link
          href="/urunler"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-forest hover:border-forest/40"
        >
          {t("coContinue")}
        </Link>
      </div>
    </div>
  );
}
