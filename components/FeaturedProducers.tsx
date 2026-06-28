"use client";

import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { useStore } from "./store";
import { useCatalog } from "./CatalogProvider";
import { VerifiedIcon, PinIcon, ArrowRightIcon } from "./icons";

export function FeaturedProducers() {
  const { t } = useStore();
  const { producers } = useCatalog();
  const list = producers.slice(0, 3);
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {list.map((p) => (
        <Link
          key={p.slug}
          href={`/satici/${p.slug}`}
          className="group overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(31,39,28,0.5)]"
        >
          <div className="relative h-40 overflow-hidden">
            <Image
              src={p.cover}
              alt={p.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 to-transparent" />
            <div className="absolute -bottom-7 left-5 h-14 w-14 overflow-hidden rounded-2xl ring-4 ring-card">
              <Image src={p.avatar} alt={p.person} fill sizes="56px" className="object-cover" />
            </div>
          </div>

          <div className="p-5 pt-9">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-lg text-forest-deep">{p.name}</h3>
              {p.verified && <VerifiedIcon className="h-4 w-4 text-gold" />}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <PinIcon className="h-3.5 w-3.5" />
              {p.location}
            </p>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
              {p.story}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <StarRating rating={p.rating} count={p.reviewCount} />
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest group-hover:text-gold">
                {t("storeWord")}
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
