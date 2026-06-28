"use client";

import { useState } from "react";
import { useStore } from "./store";
import { CartIcon, HeartIcon, PlusIcon, MinusIcon } from "./icons";

export function AddToCart({ slug, name }: { slug: string; name: string }) {
  const { add, setCartOpen, toggleFav, isFav, toast, t } = useStore();
  const [qty, setQty] = useState(1);
  const fav = isFav(slug);

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      {/* Adet */}
      <div className="flex items-center rounded-full border border-line bg-card">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Azalt"
          className="flex h-12 w-12 items-center justify-center text-forest hover:text-gold"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-semibold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          aria-label="Artır"
          className="flex h-12 w-12 items-center justify-center text-forest hover:text-gold"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => {
          add(slug, qty);
          toast(`${name} ${t("toastAdded")}`);
          setCartOpen(true);
        }}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
      >
        <CartIcon className="h-5 w-5" />
        {t("addToCart")}
      </button>

      <button
        onClick={() => {
          toggleFav(slug);
          toast(fav ? t("toastFavRemoved") : t("toastFavAdded"));
        }}
        aria-label="Favorilere ekle"
        aria-pressed={fav}
        className="flex w-14 items-center justify-center rounded-full border border-line bg-card text-forest transition-colors hover:border-forest/40"
      >
        <HeartIcon className={`h-5 w-5 ${fav ? "fill-gold text-gold" : ""}`} />
      </button>
    </div>
  );
}
