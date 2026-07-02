import type { MetadataRoute } from "next";
import { fetchCatalogData } from "@/lib/queries";
import { siteUrl } from "@/lib/site";

// Statik sayfalar + üründen/satıcıdan üretilen dinamik URL'ler.
// fetchCatalogData react cache'li olduğundan ek sorgu maliyeti düşüktür.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/urunler`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/nasil-calisir`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/satici-ol`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/kvkk`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/gizlilik-politikasi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/mesafeli-satis-sozlesmesi`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/iade-politikasi`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const { products, producers } = await fetchCatalogData();
    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${siteUrl}/urun/${p.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    const producerPages: MetadataRoute.Sitemap = producers.map((v) => ({
      url: `${siteUrl}/satici/${v.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    return [...staticPages, ...productPages, ...producerPages];
  } catch {
    // Katalog erişilemezse en azından statik sayfaları bildir.
    return staticPages;
  }
}
