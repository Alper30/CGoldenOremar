"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fmtPrice } from "@/lib/data";
import { useStore } from "./store";
import { useCatalog } from "./CatalogProvider";
import { SearchIcon } from "./icons";

const norm = (s: string) =>
  s.toLocaleLowerCase("tr").replace(/[ıİ]/g, "i").trim();

export function SearchBox({
  placeholder = "Ürün, üretici veya yöre ara…",
  variant = "light",
  onNavigate,
}: {
  placeholder?: string;
  variant?: "light" | "hero";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { t } = useStore();
  const { products } = useCatalog();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const nq = norm(q);
  const results =
    nq.length >= 2
      ? products
          .filter(
            (p) =>
              norm(p.name).includes(nq) ||
              norm(p.region).includes(nq) ||
              norm(p.producer).includes(nq) ||
              norm(p.category).includes(nq) ||
              norm(p.badge).includes(nq),
          )
          .slice(0, 6)
      : [];

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(href);
  };

  const submit = () => {
    if (q.trim()) go(`/urunler?ara=${encodeURIComponent(q.trim())}`);
  };

  const inputCls =
    variant === "hero"
      ? "h-12 w-full rounded-full border border-white/20 bg-white/95 pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
      : "h-11 w-full rounded-full border border-line bg-card pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-gold";

  return (
    <div ref={ref} className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        aria-label="Ara"
        className={inputCls}
      />

      {open && nq.length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[80] overflow-hidden rounded-2xl border border-line bg-card shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-muted">
              “{q}” {t("searchNoResult")}
            </p>
          ) : (
            <>
              {results.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => go(`/urun/${p.slug}`)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-canvas"
                >
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-canvas">
                    <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-forest-deep">
                      {p.name}
                    </span>
                    <span className="block truncate text-xs text-muted">{p.region}</span>
                  </span>
                  <span className="shrink-0 font-display text-sm text-forest-deep">
                    {fmtPrice(p.price)}
                  </span>
                </button>
              ))}
              <button
                onClick={submit}
                className="block w-full border-t border-line bg-canvas px-4 py-2.5 text-center text-sm font-semibold text-gold-deep hover:bg-amber-bg"
              >
                “{q}” {t("searchAllResults")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
