"use client";

import Link from "next/link";
import { useStore } from "@/components/store";
import { getProduct } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { HeartIcon, ArrowRightIcon } from "@/components/icons";

export default function FavoritesPage() {
  const { favs, hydrated, t } = useStore();
  const items = favs.map((s) => getProduct(s)).filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {t("favListem")}
        </p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-4xl text-forest-deep">
          <HeartIcon className="h-7 w-7 text-gold" />
          {t("favTitle")}
        </h1>
      </header>

      {!hydrated ? (
        <p className="text-muted">{t("loading")}</p>
      ) : items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-line bg-card p-12 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-canvas text-muted">
            <HeartIcon className="h-8 w-8" />
          </span>
          <p className="mt-4 text-muted">{t("favEmpty")}</p>
          <Link
            href="/urunler"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream hover:bg-gold-deep"
          >
            {t("discover")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p!.slug} product={p!} />
          ))}
        </div>
      )}
    </div>
  );
}
