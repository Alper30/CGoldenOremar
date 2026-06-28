"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { catNameKey, catDescKey, badgeKey } from "@/lib/i18n";
import { useStore } from "./store";
import { useCatalog } from "./CatalogProvider";
import { ProductCard } from "./ProductCard";
import { SearchIcon } from "./icons";

const norm = (s: string) =>
  s.toLocaleLowerCase("tr").replace(/[ıİ]/g, "i").trim();

type Sort = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "puan";

const sortKey: Record<Sort, string> = {
  onerilen: "sortRecommended",
  "fiyat-artan": "sortPriceAsc",
  "fiyat-azalan": "sortPriceDesc",
  puan: "sortRating",
};

const badges = ["Organik", "Katkısız", "Doğal", "Şeker İlavesiz"];

export function CatalogClient() {
  const sp = useSearchParams();
  const { t } = useStore();
  const { products, categories, getCategory } = useCatalog();
  const initialCat = sp.get("kategori");
  const initialAra = sp.get("ara") ?? "";

  const [cat, setCat] = useState<string | null>(
    initialCat && getCategory(initialCat) ? initialCat : null,
  );
  const [q, setQ] = useState(initialAra);
  const [sort, setSort] = useState<Sort>("onerilen");
  const [badge, setBadge] = useState<string | null>(null);

  // URL parametreleri değişince (ör. başlıktaki kategori linkine tıklama,
  // bu sayfadayken) filtreleri senkronize et — aksi halde useState ilk
  // değeri sabit kalır ve liste güncellenmez.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const c = sp.get("kategori");
    setCat(c && getCategory(c) ? c : null);
    setQ(sp.get("ara") ?? "");
  }, [sp, getCategory]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const list = useMemo(() => {
    const nq = norm(q);
    let r = products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (badge && p.badge !== badge) return false;
      if (nq.length >= 1) {
        const hay = norm(`${p.name} ${p.region} ${p.producer} ${p.category} ${p.badge}`);
        if (!hay.includes(nq)) return false;
      }
      return true;
    });
    if (sort === "fiyat-artan") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "fiyat-azalan") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "puan") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [products, cat, q, sort, badge]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {cat ? t("categoryWord") : t("store")}
        </p>
        <h1 className="mt-1 font-display text-4xl text-forest-deep">
          {cat ? t(catNameKey[cat]) : t("catalogAllTitle")}
        </h1>
        <p className="mt-2 text-muted">
          {cat ? t(catDescKey[cat]) : t("catalogAllSub")}
        </p>
      </header>

      {/* Arama */}
      <div className="relative mt-6 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 w-full rounded-full border border-line bg-card pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
        />
      </div>

      {/* Kategori filtreleri */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Chip active={!cat} onClick={() => setCat(null)}>
          {t("all")}
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
            {t(catNameKey[c.slug])}
          </Chip>
        ))}
      </div>

      {/* Rozet + sıralama */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted">{t("filterTag")}</span>
          <Chip small active={!badge} onClick={() => setBadge(null)}>
            {t("filterAll")}
          </Chip>
          {badges.map((b) => (
            <Chip key={b} small active={badge === b} onClick={() => setBadge(b)}>
              {t(badgeKey[b])}
            </Chip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">{t("sortLabel")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-line bg-card px-3 py-2 text-sm font-medium text-forest outline-none focus:border-gold"
          >
            {(Object.keys(sortKey) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {t(sortKey[s])}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-muted">
        {list.length} {t("listingCount")}
      </p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-card p-12 text-center text-muted">
          {t("catalogEmpty")}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  small,
  onClick,
  children,
}: {
  active: boolean;
  small?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full font-medium transition-colors ${
        small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
      } ${
        active
          ? "bg-forest text-cream"
          : "border border-line bg-card text-forest hover:border-forest/40"
      }`}
    >
      {children}
    </button>
  );
}
