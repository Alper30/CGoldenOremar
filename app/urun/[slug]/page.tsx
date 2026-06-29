import Link from "next/link";
import { notFound } from "next/navigation";
import { fmtPrice } from "@/lib/data";
import { fetchCatalogData, buildHelpers } from "@/lib/queries";
import { StarRating } from "@/components/StarRating";
import { ProducerTrustCard } from "@/components/ProducerTrustCard";
import { ReviewList } from "@/components/ReviewList";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCart } from "@/components/AddToCart";
import { ArrowRightIcon, SnowIcon, ShieldIcon, TruckIcon } from "@/components/icons";

export async function generateStaticParams() {
  const { products } = await fetchCatalogData();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchCatalogData();
  const { getProduct, getProducer, getCategory, productsByProducer } =
    buildHelpers(data);
  const product = getProduct(slug);
  if (!product) notFound();

  const producer = getProducer(product.producer);
  const category = getCategory(product.category);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const more = producer
    ? productsByProducer(producer.slug).filter((p) => p.slug !== product.slug)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-forest">Anasayfa</Link>
        <span>/</span>
        <Link href="/urunler" className="hover:text-forest">Ürünler</Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/urunler?kategori=${category.slug}`} className="hover:text-forest">
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Galeri */}
        <ProductGallery
          images={gallery}
          alt={product.name}
          badge={product.badge}
          region={product.region}
        />

        {/* Bilgi */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-forest"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-3 font-display text-3xl leading-tight text-forest-deep sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} count={product.reviewCount} size="md" />
            {producer && (
              <>
                <span className="text-line">·</span>
                <Link
                  href={`/satici/${producer.slug}`}
                  className="text-sm font-medium text-forest hover:text-gold"
                >
                  {producer.name}
                </Link>
              </>
            )}
          </div>

          <div className="mt-6 flex items-end gap-3">
            {product.oldPrice && (
              <span className="pb-1 text-base text-muted line-through">
                {fmtPrice(product.oldPrice)}
              </span>
            )}
            <p className="font-display text-4xl text-forest-deep">
              {fmtPrice(product.price)}
            </p>
            <p className="pb-1 text-sm text-muted">/ {product.unit}</p>
          </div>

          <p className="mt-5 leading-relaxed text-ink/90">{product.description}</p>

          {/* Adet + sepet + favori (interaktif) */}
          <AddToCart slug={product.slug} name={product.name} />

          {/* Güven satırı */}
          <ul className="mt-6 space-y-2.5 rounded-2xl border border-line bg-card p-5 text-sm">
            {product.coldChain && (
              <li className="flex items-center gap-2.5 text-ink/90">
                <SnowIcon className="h-5 w-5 shrink-0 text-forest" />
                Soğuk zincir ambalajla, serinliği korunarak gönderilir.
              </li>
            )}
            <li className="flex items-center gap-2.5 text-ink/90">
              <ShieldIcon className="h-5 w-5 shrink-0 text-forest" />
              Ödemeniz, ürünü teslim alıp onaylayana kadar emanette tutulur.
            </li>
            <li className="flex items-center gap-2.5 text-ink/90">
              <TruckIcon className="h-5 w-5 shrink-0 text-forest" />
              Kargo takip numarası zorunludur; siparişinizi adım adım izlersiniz.
            </li>
          </ul>

          {producer && (
            <div className="mt-6">
              <ProducerTrustCard producer={producer} />
            </div>
          )}
        </div>
      </div>

      {/* Yorumlar */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-forest-deep">
          Değerlendirmeler ({product.reviewCount})
        </h2>
        <div className="mt-5 max-w-3xl">
          <ReviewList reviews={product.reviews ?? []} />
        </div>
      </section>

      {/* Aynı üreticiden */}
      {more.length > 0 && producer && (
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl text-forest-deep">
              {producer.name} mağazasından
            </h2>
            <Link
              href={`/satici/${producer.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-gold"
            >
              Tümü
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {more.slice(0, 4).map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
