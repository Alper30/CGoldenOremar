"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { getProducer, fmtPrice } from "@/lib/data";
import { badgeKey } from "@/lib/i18n";
import { useStore } from "./store";
import { StarRating } from "./StarRating";
import { HeartIcon, CartIcon, PersonIcon, PinIcon, SnowIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const producer = getProducer(product.producer);
  const { add, setCartOpen, toggleFav, isFav, toast, t } = useStore();
  const fav = isFav(product.slug);
  const badgeText = badgeKey[product.badge] ? t(badgeKey[product.badge]) : product.badge;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug, 1);
    toast(`${product.name} sepete eklendi`);
    setCartOpen(true);
  };

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(product.slug);
    toast(fav ? "Favorilerden çıkarıldı" : "Favorilere eklendi");
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
          <div className="flex flex-col leading-tight">
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">
                {fmtPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-display text-xl text-forest-deep">
              {fmtPrice(product.price)}
            </span>
          </div>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-2 text-xs font-semibold text-cream transition-colors hover:bg-gold-deep"
          >
            <CartIcon className="h-4 w-4" />
            {t("addToCart")}
          </button>
        </div>
      </div>
    </Link>
  );
}
