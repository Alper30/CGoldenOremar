"use client";

import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { TrustBadges } from "@/components/TrustBadges";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedProducers } from "@/components/FeaturedProducers";
import { Newsletter } from "@/components/Newsletter";
import { StarRating } from "@/components/StarRating";
import { useCatalog } from "@/components/CatalogProvider";
import { useStore } from "@/components/store";
import { ArrowRightIcon } from "@/components/icons";

function SectionHead({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-3xl text-forest-deep sm:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-forest hover:text-gold sm:inline-flex"
        >
          {linkLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const { t } = useStore();
  const { featuredProducts, reviews } = useCatalog();
  const featured = featuredProducts();

  return (
    <>
      <Hero />

      <section className="border-b border-line bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      <section id="kategoriler" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <SectionHead
          eyebrow={t("secCatEyebrow")}
          title={t("secCatTitle")}
          subtitle={t("secCatSub")}
          href="/urunler"
          linkLabel={t("secCatLink")}
        />
        <CategoryGrid />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <SectionHead
          eyebrow={t("secFeatEyebrow")}
          title={t("secFeatTitle")}
          subtitle={t("secFeatSub")}
          href="/urunler"
          linkLabel={t("secFeatLink")}
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <SectionHead
          eyebrow={t("secProdEyebrow")}
          title={t("secProdTitle")}
          subtitle={t("secProdSub")}
          href="/urunler"
          linkLabel={t("secProdLink")}
        />
        <FeaturedProducers />
      </section>

      {/* Satıcı CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:mt-28 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-card">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                {t("sellerEyebrow")}
              </p>
              <h2 className="mt-2 font-display text-3xl text-forest-deep lg:text-4xl">
                {t("sellerTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-muted">{t("sellerSub")}</p>
              <Link
                href="/nasil-calisir"
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
              >
                {t("sellerCta")}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <Image
                src="/images/seller-cta.png"
                alt="Golden Oremar"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Yorumlar */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <SectionHead eyebrow={t("reviewsEyebrow")} title={t("reviewsTitle")} />
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-2xl border border-line bg-card p-6">
              <StarRating rating={r.rating} size="md" />
              <p className="mt-3 leading-relaxed text-ink/90">“{r.text}”</p>
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-sm font-semibold text-forest-deep">{r.author}</p>
                <p className="text-xs text-muted">
                  {r.location}
                  {r.product ? ` · ${r.product}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <Newsletter />
      </section>
    </>
  );
}
