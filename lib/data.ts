// Golden Oremar — katalog verisi artık Supabase'den gelir (lib/queries.ts).
// Client component'ler useCatalog(), sunucu sayfaları fetchCatalogData() kullanır.
// Burada yalnızca saf biçimlendirme yardımcısı kalır.

export const fmtPrice = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
