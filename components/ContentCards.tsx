import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/content";

// İçerik bölümü (rehber/tarif) ortak parçaları — sunucu bileşenleri.

export function ContentHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="border-b border-line bg-canvas">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl text-forest-deep lg:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">{intro}</p>
      </div>
    </section>
  );
}

export function ArticleCard({ base, article }: { base: string; article: Article }) {
  return (
    <Link
      href={`${base}/${article.slug}`}
      className="group overflow-hidden rounded-2xl border border-line bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {article.category && (
          <span className="absolute left-3 top-3 rounded-full bg-forest-deep/85 px-3 py-1 text-[11px] font-semibold text-cream">
            {article.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs text-muted">{article.date}</p>
        <h2 className="mt-1.5 font-display text-lg leading-snug text-forest-deep group-hover:text-gold">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}

export function ArticleBody({
  article,
  backHref,
  backLabel,
  eyebrow,
}: {
  article: Article;
  backHref: string;
  backLabel: string;
  eyebrow: string;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-wider text-gold">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-forest-deep lg:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        {article.date}
        {article.category ? ` · ${article.category}` : ""}
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-lg leading-relaxed text-ink/90">{article.summary}</p>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-ink/90">
        {article.content}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link
          href={backHref}
          className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-forest transition-colors hover:border-gold hover:text-gold"
        >
          {backLabel}
        </Link>
        <Link
          href="/urunler"
          className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
        >
          Doğal ürünleri keşfet
        </Link>
      </div>
    </article>
  );
}
