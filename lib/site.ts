// Mutlak site adresi — e-posta bağlantıları, sitemap, robots ve OG etiketleri
// aynı kaynağı kullanır. Vercel'de NEXT_PUBLIC_SITE_URL tanımlanmalı.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://goldenoremar.com";
