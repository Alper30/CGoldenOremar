"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { ArrowRightIcon, LeafIcon } from "./icons";

const ROTATE_MS = 5000;

type SlideDef = {
  image: string;
  href: string;
  tagKey?: string;
  badgeKey: string;
  titleKey: string;
  subKey: string;
  ctaKey: string;
};

const slideDefs: SlideDef[] = [
  {
    image: "/images/hero.png",
    href: "/urunler",
    badgeKey: "heroBadge1",
    titleKey: "heroTitle1",
    subKey: "heroSub1",
    ctaKey: "heroCta1",
  },
  {
    image: "/images/cat-honey.png",
    href: "/urunler?kategori=bal",
    tagKey: "heroTag2",
    badgeKey: "heroBadge2",
    titleKey: "heroTitle2",
    subKey: "heroSub2",
    ctaKey: "heroCta2",
  },
  {
    image: "/images/cat-olive.png",
    href: "/urunler?kategori=zeytin-zeytinyagi",
    tagKey: "heroTag3",
    badgeKey: "heroBadge3",
    titleKey: "heroTitle3",
    subKey: "heroSub3",
    ctaKey: "heroCta3",
  },
  {
    image: "/images/cat-jam.png",
    href: "/urunler?kategori=recel-pekmez",
    tagKey: "heroTag4",
    badgeKey: "heroBadge4",
    titleKey: "heroTitle4",
    subKey: "heroSub4",
    ctaKey: "heroCta4",
  },
  {
    image: "/images/cat-eggs.png",
    href: "/urunler?kategori=yumurta",
    tagKey: "heroTag5",
    badgeKey: "heroBadge5",
    titleKey: "heroTitle5",
    subKey: "heroSub5",
    ctaKey: "heroCta5",
  },
];

export function Hero() {
  const { t } = useStore();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const tm = setInterval(
      () => setActive((i) => (i + 1) % slideDefs.length),
      ROTATE_MS,
    );
    return () => clearInterval(tm);
  }, [paused]);

  return (
    <section
      className="relative isolate min-h-[520px] overflow-hidden lg:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slideDefs.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(20,14,2,0.86) 0%, rgba(20,14,2,0.62) 45%, rgba(20,14,2,0.2) 100%)",
            }}
          />

          <div className="mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl pb-24 pt-16 lg:pb-28 lg:pt-24">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-cream">
                {s.tagKey ? (
                  <span className="rounded-full bg-cream/25 px-2 py-0.5 uppercase tracking-wide">
                    {t(s.tagKey)}
                  </span>
                ) : (
                  <LeafIcon className="h-4 w-4" />
                )}
                <span>{t(s.badgeKey)}</span>
              </span>

              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
                {t(s.titleKey)}
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {t(s.subKey)}
              </p>

              <div className="mt-7">
                <Link
                  href={s.href}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
                >
                  {t(s.ctaKey)}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Sabit alt katman */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 pb-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              { v: "2.400+", l: t("statProducers") },
              { v: "18.000+", l: t("statProducts") },
              { v: "81 il", l: t("statCities") },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-xl text-white sm:text-2xl">{s.v}</p>
                <p className="text-[11px] text-white/70">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {slideDefs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`${i + 1}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-gold" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
