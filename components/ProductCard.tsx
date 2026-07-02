"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { fmtPrice } from "@/lib/data";
import { badgeKey } from "@/lib/i18n";
import { useStore } from "./store";
import { useCatalog } from "./CatalogProvider";
import { StarRating } from "./StarRating";
import { HeartIcon, CartIcon, PersonIcon, PinIcon, SnowIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const { getProducer } = useCatalog();
  const producer = getProducer(product.producer);
  const { add, setCartOpen, toggleFav, isFav, toast, t } = useStore();
  const fav = isFav(product.slug);
  const badgeText = badgeKey[product.badge] ? t(badgeKey[product.badge]) : product.badge;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug, 1);
    toast(`${product.name} ${t("toastAdded")}`);
    setCartOpen(true);
  };

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(product.slug);
    toast(fav ? t("toastFavRemoved") : t("toastFavAdded"));
  };

  return (
    <Link
      href={`/urun/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(31,39,28,0.5)]"
    >
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-white">
          {badgeText}
        </span>
        {product.coldChain && (
          <span className="absolute left-3 top-11 inline-flex items-center gap-1 rounded-full bg-forest-deep/90 px-2.5 py-1 text-[11px] font-semibold text-cream backdrop-blur">
            <SnowIcon className="h-3.5 w-3.5" />
            {t("coldChain")}
          </span>
        )}
        <button
          onClick={onFav}
          aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
          aria-pressed={fav}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/95 text-forest shadow-sm ring-1 ring-black/5 transition-colors hover:text-gold"
        >
          <HeartIcon className={`h-4.5 w-4.5 ${fav ? "fill-gold text-gold" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {producer && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">
            <PersonIcon className="h-3.5 w-3.5" />
            {producer.name}
          </span>
        )}

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.6rem] font-display text-base leading-snug text-forest-deep">
          {product.name}
        </h3>

        <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
          <PinIcon className="h-3.5 w-3.5 text-gold" />
          {product.region}
        </span>

        <div className="mt-2">
          <StarRating rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex min-w-0 flex-col leading-tight">
            {product.oldPrice && (
              <span className="text-xs tabular-nums text-muted line-through">
                {fmtPrice(product.oldPrice)}
              </span>
            )}
            <span className="text-lg font-bold tracking-tight tabular-nums text-forest-deep">
              {fmtPrice(product.price)}
            </span>
          </div>
          {/* Dar kartlarda (mobil 2 sütun) yalnız ikon; sm+ metinli buton */}
          <button
            onClick={onAdd}
            aria-label={t("addToCart")}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-cream transition-colors hover:bg-gold-deep sm:h-auto sm:w-auto sm:gap-1.5 sm:whitespace-nowrap sm:px-3.5 sm:py-2 sm:text-xs sm:font-semibold"
          >
            <CartIcon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{t("addToCart")}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
