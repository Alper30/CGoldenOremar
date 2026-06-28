"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "./store";
import { getProduct, fmtPrice } from "@/lib/data";
import { XIcon, PlusIcon, MinusIcon, TrashIcon, CartIcon, ArrowRightIcon } from "./icons";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, remove, clearCart, toast, t } = useStore();

  const lines = cart
    .map((i) => ({ ...i, product: getProduct(i.slug) }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + (l.product!.price * l.qty), 0);

  return (
    <>
      {/* Karartma */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[70] bg-forest-deep/40 transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[71] flex h-full w-[92vw] max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Sepet"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="flex items-center gap-2 font-display text-xl text-forest-deep">
            <CartIcon className="h-5 w-5 text-gold" />
            {t("cartTitle")}
            {lines.length > 0 && (
              <span className="text-sm font-normal text-muted">
                ({lines.reduce((s, l) => s + l.qty, 0)})
              </span>
            )}
          </p>
          <button
            onClick={() => setCartOpen(false)}
            aria-label="Kapat"
            className="rounded-full p-2 text-forest transition-colors hover:bg-canvas"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas text-muted">
              <CartIcon className="h-8 w-8" />
            </span>
            <p className="text-muted">{t("cartEmpty")}</p>
            <Link
              href="/urunler"
              onClick={() => setCartOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-cream hover:bg-gold-deep"
            >
              {t("cartStart")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {lines.map((l) => {
                const p = l.product!;
                return (
                  <div key={l.slug} className="flex gap-3 rounded-2xl border border-line bg-card p-3">
                    <Link
                      href={`/urun/${p.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-canvas"
                    >
                      <Image src={p.image} alt={p.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/urun/${p.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="line-clamp-2 text-sm font-semibold text-forest-deep hover:text-gold"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted">{p.region}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => setQty(l.slug, l.qty - 1)}
                            aria-label="Azalt"
                            className="flex h-7 w-7 items-center justify-center text-forest hover:text-gold"
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                          <button
                            onClick={() => setQty(l.slug, l.qty + 1)}
                            aria-label="Artır"
                            className="flex h-7 w-7 items-center justify-center text-forest hover:text-gold"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-sm text-forest-deep">
                          {fmtPrice(p.price * l.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(l.slug)}
                      aria-label="Kaldır"
                      className="self-start rounded-full p-1.5 text-muted transition-colors hover:bg-canvas hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={clearCart}
                className="text-xs font-medium text-muted hover:text-red-600"
              >
                {t("cartClear")}
              </button>
            </div>

            <div className="border-t border-line bg-card px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{t("cartSubtotal")}</span>
                <span className="font-display text-xl text-forest-deep">
                  {fmtPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{t("cartShipNote")}</p>
              <button
                onClick={() => toast(t("cartCheckout"))}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
              >
                {t("cartCheckout")}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
