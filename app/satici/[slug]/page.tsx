import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchCatalogData, buildHelpers } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ReviewList } from "@/components/ReviewList";
import { StarRating } from "@/components/StarRating";
import { VerifiedIcon, PinIcon } from "@/components/icons";
import type { Review } from "@/lib/types";

export async function generateStaticParams() {
  const { producers } = await fetchCatalogData();
  return producers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchCatalogData();
  const producer = buildHelpers(data).getProducer(slug);
  if (!producer) return { title: "Satıcı bulunamadı — Golden Oremar" };
  const description = `${producer.name} — ${producer.location}. Kimliği doğrulanmış üretici; ${producer.productCount} ürün, ${producer.rating} puan (%${producer.positivePct} olumlu geri bildirim).`;
  return {
    title: `${producer.name} — Üretici Mağazası · Golden Oremar`,
    description,
    openGraph: {
      title: producer.name,
      description,
      images: producer.cover ? [{ url: producer.cover }] : undefined,
    },
  };
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-5 py-4 text-center">
      <p className="font-display text-2xl text-forest-deep">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchCatalogData();
  const { getProducer, productsByProducer } = buildHelpers(data);
  const producer = getProducer(slug);
  if (!producer) notFound();

  const items = productsByProducer(producer.slug);
  const reviews: Review[] = items.flatMap((p) => p.reviews ?? []);

  return (
    <div>
      {/* Kapak */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64 lg:h-72">
        <Image
          src={producer.cover}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Üst kart */}
        <div className="relative -mt-16 rounded-[1.5rem] border border-line bg-card px-6 pb-6 pt-16 shadow-sm lg:px-8 lg:pb-8 lg:pt-20">
          {/* Avatar — kapaktan taşar */}
          <div className="absolute -top-12 left-6 h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-card lg:left-8 lg:h-28 lg:w-28">
            <Image
              src={producer.avatar}
              alt={producer.person}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl text-forest-deep">
                {producer.name}
              </h1>
              {producer.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                  <VerifiedIcon className="h-3.5 w-3.5" />
                  Doğrulanmış
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <PinIcon className="h-4 w-4" />
              {producer.location}
              <span className="text-line">·</span>
              {producer.memberSince}&apos;ten beri üye
            </p>
            <div className="mt-2">
              <StarRating
                rating={producer.rating}
                count={producer.reviewCount}
                size="md"
              />
            </div>
          </div>

          {/* Rozetler */}
          <div className="mt-5 flex flex-wrap gap-2">
            {producer.badges.map((b) => (
              <span
                key={b}
                className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-forest"
              >
                {b}
              </span>
            ))}
          </div>

          {/* İstatistikler */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <BigStat
              value={producer.unitsSold.toLocaleString("tr-TR")}
              label="ürün satıldı"
            />
            <BigStat value={`%${producer.positivePct}`} label="olumlu geri bildirim" />
            <BigStat
              value={producer.rating.toFixed(1)}
              label={`${producer.reviewCount} değerlendirme`}
            />
          </div>
        </div>

        {/* Hikâye */}
        <section className="mt-12 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Üreticinin Hikâyesi
          </p>
          <p className="mt-3 font-display text-2xl leading-relaxed text-forest-deep">
            “{producer.story}”
          </p>
          <p className="mt-3 text-sm font-semibold text-muted">— {producer.person}</p>
        </section>

        {/* Ürünleri */}
        <section className="mt-14">
          <h2 className="font-display text-2xl text-forest-deep">
            {producer.name} ürünleri ({items.length})
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Yorumlar */}
        <section className="mt-14 pb-4">
          <h2 className="font-display text-2xl text-forest-deep">
            Alıcı yorumları
          </h2>
          <div className="mt-6 max-w-3xl">
            <ReviewList reviews={reviews} />
          </div>
        </section>
      </div>
    </div>
  );
}
