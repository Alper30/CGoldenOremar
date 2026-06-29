"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catNameKey, type Lang } from "@/lib/i18n";
import { useStore } from "./store";
import { useCatalog } from "./CatalogProvider";
import { useAuth } from "./AuthProvider";
import { AccountMenu } from "./AccountMenu";
import { SearchBox } from "./SearchBox";
import { logoutAction } from "@/app/giris/actions";
import {
  CartIcon,
  HeartIcon,
  MenuIcon,
  TruckIcon,
} from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const { cartCount, favCount, hydrated, setCartOpen, lang, setLang, t } = useStore();
  const { categories } = useCatalog();
  const { signedIn } = useAuth();

  // Dönen duyuru/kampanya çubuğu
  const announcements = ["announcement", "announce2", "announce3", "announce4", "announce5"];
  const [annIdx, setAnnIdx] = useState(0);
  useEffect(() => {
    const tm = setInterval(
      () => setAnnIdx((i) => (i + 1) % announcements.length),
      4000,
    );
    return () => clearInterval(tm);
  }, [announcements.length]);

  const badge = (n: number, color: string) =>
    hydrated && n > 0 ? (
      <span
        className={`absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${color}`}
      >
        {n}
      </span>
    ) : null;

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur">
      {/* Üst duyuru çubuğu — dönen kampanyalar */}
      <div className="overflow-hidden bg-amber-bg text-center text-xs font-medium text-gold-deep">
        <p key={annIdx} className="rise py-1.5">
          {t(announcements[annIdx])}
        </p>
      </div>

      {/* Ana satır */}
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest font-display text-sm font-semibold text-cream">
              GO
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-lg tracking-tight text-forest-deep">
                Golden Oremar
              </span>
              <span className="text-[11px] text-muted">{t("brandTag")}</span>
            </span>
          </Link>

          <button
            className="-ml-0.5 rounded-full p-2 text-forest transition-colors hover:bg-canvas md:hidden"
            aria-label="Menü"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          {/* Canlı arama */}
          <div className="ml-2 hidden flex-1 md:block">
            <SearchBox placeholder={t("searchPlaceholder")} />
          </div>

          {/* Aksiyonlar */}
          <div className="ml-auto flex items-center gap-1">
            <div className="hidden items-center rounded-full border border-line p-0.5 text-xs font-semibold sm:flex">
              {(["tr", "ku"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
                    lang === l ? "bg-forest text-cream" : "text-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <Link
              href="/favoriler"
              aria-label={t("navFavorites")}
              className="relative rounded-full p-2.5 text-forest transition-colors hover:bg-canvas"
            >
              <HeartIcon className="h-5 w-5" />
              {badge(favCount, "bg-gold")}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={t("cartTitle")}
              className="relative rounded-full p-2.5 text-forest transition-colors hover:bg-canvas"
            >
              <CartIcon className="h-5 w-5" />
              {badge(cartCount, "bg-red-600")}
            </button>

            <AccountMenu />
          </div>
        </div>
      </div>

      {/* Mobil arama satırı — PC'deki gibi başlıkta arama */}
      <div className="border-b border-line px-4 py-2.5 md:hidden">
        <SearchBox placeholder={t("searchPlaceholder")} />
      </div>

      {/* Kategori nav satırı */}
      <div className="border-b border-line bg-cream/90">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/urunler?kategori=${c.slug}`}
              className="whitespace-nowrap px-3 py-3 text-sm font-medium text-ink/80 transition-colors hover:text-gold"
            >
              {t(catNameKey[c.slug])}
            </Link>
          ))}
          <span className="mx-1 ml-auto hidden h-4 w-px bg-line sm:block" />
          <Link
            href="/hakkimizda"
            className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-forest transition-colors hover:text-gold"
          >
            {t("navAbout")}
          </Link>
          <Link
            href="/nasil-calisir"
            className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-forest transition-colors hover:text-gold"
          >
            {t("navHow")}
          </Link>
          <Link
            href="/iletisim"
            className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-forest transition-colors hover:text-gold"
          >
            {t("navContact")}
          </Link>
          <Link
            href="/randevu"
            className="my-1.5 ml-1 whitespace-nowrap rounded-full bg-gold/15 px-3 py-1.5 text-sm font-semibold text-gold-deep transition-colors hover:bg-gold hover:text-cream"
          >
            {t("navBooking")}
          </Link>
        </div>
      </div>

      {/* Mobil menü */}
      {open && (
        <nav className="max-h-[calc(100dvh-7rem)] overflow-y-auto border-b border-line bg-cream px-4 py-4 md:hidden">
          {/* Kategoriler */}
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gold">
            {t("navSecCategories")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/urunler?kategori=${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-line bg-card px-3 py-2.5 text-sm font-medium text-forest-deep transition-colors hover:border-gold/50 hover:text-gold"
              >
                {t(catNameKey[c.slug])}
              </Link>
            ))}
          </div>

          {/* Keşfet */}
          <p className="mb-2.5 mt-5 text-xs font-semibold uppercase tracking-wider text-gold">
            {t("navSecExplore")}
          </p>
          <Link
            href="/siparis-takip"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-3 text-sm font-semibold text-forest-deep"
          >
            <TruckIcon className="h-5 w-5 text-gold" />
            {t("navTracking")}
          </Link>
          <div className="mt-1 grid grid-cols-1 divide-y divide-line">
            {[
              { href: "/favoriler", label: t("navFavorites") },
              { href: "/hakkimizda", label: t("navAbout") },
              { href: "/nasil-calisir", label: t("navHow") },
              { href: "/iletisim", label: t("navContact") },
              { href: "/randevu", label: t("navBooking") },
            ].map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-semibold text-forest transition-colors hover:text-gold"
              >
                {it.label}
              </Link>
            ))}
          </div>

          {/* Hesap + dil */}
          <p className="mb-2.5 mt-5 text-xs font-semibold uppercase tracking-wider text-gold">
            {t("navSecAccount")}
          </p>
          {signedIn ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/hesabim"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-line bg-card px-3 py-2.5 text-sm font-semibold text-forest-deep"
              >
                {t("navAccount")}
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-xl border border-line bg-card px-3 py-2.5 text-left text-sm font-semibold text-red-600"
                >
                  {t("navLogout")}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/giris"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-line bg-card px-3 py-2.5 text-center text-sm font-semibold text-forest-deep"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/kayit"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gold px-4 py-2.5 text-center text-sm font-semibold text-cream"
              >
                {t("navSell")}
              </Link>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
            {(["tr", "ku"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase ${
                  lang === l ? "border-forest bg-forest text-cream" : "border-line text-muted"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
