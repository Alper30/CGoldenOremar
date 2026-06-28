"use client";

import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import { catNameKey } from "@/lib/i18n";
import { useStore } from "./store";

export function CategoryGrid() {
  const { t } = useStore();
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((c) => (
        <Link key={c.slug} href={`/urunler?kategori=${c.slug}`} className="group">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-line">
            <Image
              src={c.image}
              alt={t(catNameKey[c.slug])}
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="mt-3">
            <p className="font-display text-base text-forest-deep group-hover:text-gold">
              {t(catNameKey[c.slug])}
            </p>
            <p className="text-xs text-muted">
              {c.productCount} {t("unitProducts")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
