import { cache } from "react";
import { supabase, supabaseConfigured } from "./supabase";
import type { Category, Producer, Product, Review } from "./types";

const EMPTY_CATALOG: CatalogData = {
  categories: [],
  producers: [],
  products: [],
  reviews: [],
};

// Anasayfada "öne çıkan ürünler" için sabit seçki (eski lib/data davranışı).
const FEATURED_SLUGS = [
  "karakovan-cam-bali",
  "sizma-zeytinyagi",
  "koy-tulum-peyniri",
  "gezen-tavuk-yumurtasi",
  "kusburnu-receli",
  "taspaski-ceviz-ici",
  "koy-tereyagi",
  "dut-pekmezi",
];

export type CatalogData = {
  categories: Category[];
  producers: Producer[];
  products: Product[];
  reviews: Review[];
};

// "2026-05-15T..." -> "Mayıs 2026"
const fmtReviewDate = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(
    new Date(iso),
  );

/**
 * Tüm katalog verisini Supabase'den çekip app tiplerine (lib/types) eşler.
 * React cache() ile aynı render geçişinde tekrarlanan çağrılar tekilleştirilir.
 * Sadece sunucuda çağrılır; client tarafı veriyi CatalogProvider'dan alır.
 */
export const fetchCatalogData = cache(async (): Promise<CatalogData> => {
  // Ortam yapılandırılmamışsa (örn. Vercel'de env eksik) boş katalog döndür —
  // root layout bu fonksiyonu await ettiğinden, hata fırlatmak tüm siteyi düşürür.
  if (!supabaseConfigured) return EMPTY_CATALOG;
  try {
    return await loadCatalog();
  } catch (e) {
    console.error("[catalog] yüklenemedi, boş katalog dönülüyor:", e);
    return EMPTY_CATALOG;
  }
});

async function loadCatalog(): Promise<CatalogData> {
  const [catsRes, vendsRes, prodsRes, revsRes] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("vendor_profiles").select("*"),
    supabase
      .from("products")
      .select("*, categories(slug), vendor_profiles(slug)")
      .eq("status", "published"),
    supabase
      .from("product_reviews")
      .select("*, products(slug, name)")
      .order("created_at", { ascending: false }),
  ]);

  const err = catsRes.error || vendsRes.error || prodsRes.error || revsRes.error;
  if (err) throw new Error(`Katalog verisi alınamadı: ${err.message}`);

  const categories: Category[] = (catsRes.data ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    image: c.image ?? "",
    productCount: c.product_count,
  }));

  const producers: Producer[] = (vendsRes.data ?? []).map((v) => ({
    slug: v.slug,
    name: v.name,
    person: v.person,
    avatar: v.avatar ?? "",
    cover: v.cover ?? "",
    location: v.location ?? "",
    verified: v.verified,
    memberSince: v.member_since ? String(v.member_since) : "",
    story: v.story ?? "",
    unitsSold: v.units_sold,
    positivePct: v.positive_pct,
    rating: v.rating,
    reviewCount: v.review_count,
    productCount: v.product_count,
    badges: v.badges,
  }));

  // Yorumları ürün slug'ına göre grupla (Product.reviews için).
  const reviewsByProduct = new Map<string, Review[]>();
  const reviews: Review[] = (revsRes.data ?? []).map((r) => {
    const rev: Review = {
      author: r.author,
      location: r.location ?? "",
      rating: r.rating,
      date: fmtReviewDate(r.created_at),
      text: r.text,
      product: r.products?.name,
    };
    const pslug = r.products?.slug;
    if (pslug) {
      const arr = reviewsByProduct.get(pslug);
      if (arr) arr.push(rev);
      else reviewsByProduct.set(pslug, [rev]);
    }
    return rev;
  });

  const products: Product[] = (prodsRes.data ?? []).map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.categories?.slug ?? "",
    price: p.price,
    oldPrice: p.old_price ?? undefined,
    unit: p.unit,
    image: p.image ?? "",
    gallery: p.gallery,
    region: p.region ?? "",
    producer: p.vendor_profiles?.slug ?? "",
    rating: p.rating,
    reviewCount: p.review_count,
    badge: p.badge ?? "",
    tags: p.tags,
    coldChain: p.cold_chain,
    description: p.description ?? "",
    story: p.story ?? "",
    features: p.features ?? [],
    reviews: reviewsByProduct.get(p.slug) ?? [],
  }));

  return { categories, producers, products, reviews };
}

/**
 * Katalog dizilerinden saf yardımcılar üretir — eski lib/data API'siyle aynı.
 * Hem sunucu sayfalarında hem CatalogProvider içinde kullanılır (DRY).
 */
export function buildHelpers(data: CatalogData) {
  return {
    getProduct: (slug: string) => data.products.find((p) => p.slug === slug),
    getProducer: (slug: string) => data.producers.find((p) => p.slug === slug),
    getCategory: (slug: string) => data.categories.find((c) => c.slug === slug),
    productsByProducer: (slug: string) =>
      data.products.filter((p) => p.producer === slug),
    productsByCategory: (slug: string) =>
      data.products.filter((p) => p.category === slug),
    featuredProducts: () =>
      data.products.filter((p) => FEATURED_SLUGS.includes(p.slug)),
  };
}
