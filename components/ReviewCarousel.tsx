"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

// Otomatik kaydıraklı müşteri yorumları şeridi (ürünler alanında; ana sayfadan
// taşındı). Gerçek scroll-container + setInterval ile otomatik ilerler; hover'da
// durur, kullanıcı elle de kaydırabilir (snap). prefers-reduced-motion'da oto
// ilerleme kapanır. Koyu orman-yeşili band + krem kartlar + altın vurgu.
export function ReviewCarousel({
  reviews,
  eyebrow = "Müşteri Yorumları",
  title = "Binlerce sofranın güvendiği pazar",
}: {
  reviews: Review[];
  eyebrow?: string;
  title?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: Math.round(el.clientWidth * 0.75), behavior: "smooth" });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  if (!reviews || reviews.length === 0) return null;

  // Az yorum olsa bile şerit dolgun görünsün diye en az 6'ya tamamla.
  const items =
    reviews.length >= 6
      ? reviews
      : Array.from({ length: Math.ceil(6 / reviews.length) }, () => reviews).flat();

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:mt-24 lg:px-8">
      <div className="rounded-[2rem] bg-forest px-4 py-12 sm:px-8 lg:py-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">{title}</h2>
        </div>

        <div
          ref={scrollerRef}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          className="no-scrollbar mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 sm:gap-5"
        >
          {items.map((r, i) => (
            <figure
              key={i}
              className="flex w-[280px] shrink-0 snap-start flex-col rounded-2xl border border-cream/10 bg-cream p-6 shadow-[0_18px_45px_-30px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:-translate-y-1 sm:w-[330px]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-4 ${
                        s <= Math.round(r.rating) ? "fill-gold text-gold" : "text-line"
                      }`}
                    />
                  ))}
                </span>
                <span
                  aria-hidden
                  className="font-display text-4xl leading-none text-gold-soft/50 select-none"
                >
                  &rdquo;
                </span>
              </div>

              <blockquote className="mt-3 min-h-[96px] text-[15px] leading-relaxed text-ink/90">
                &ldquo;{r.text}&rdquo;
              </blockquote>

              <figcaption className="mt-4 border-t border-line pt-3">
                <p className="text-sm font-semibold text-forest-deep">{r.author}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {[r.location, r.product].filter(Boolean).join(" · ")}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
