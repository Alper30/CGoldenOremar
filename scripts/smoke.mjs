#!/usr/bin/env node
// Duman testi — kritik rotaların ayakta olduğunu doğrular.
// Kullanım: BASE_URL=http://localhost:3000 node scripts/smoke.mjs
// (dev veya start ile çalışan bir sunucu gerekir)

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

// [yol, beklenen durum(lar), sayfada geçmesi gereken metin (opsiyonel)]
const CHECKS = [
  ["/", [200], "Golden"],
  ["/urunler", [200]],
  ["/giris", [200]],
  ["/kayit", [200]],
  ["/satici-ol", [200]],
  ["/nasil-calisir", [200]],
  ["/hakkimizda", [200]],
  ["/iletisim", [200]],
  ["/siparis-takip", [200]],
  ["/kvkk", [200], "Aydınlatma"],
  ["/gizlilik-politikasi", [200], "Gizlilik"],
  ["/mesafeli-satis-sozlesmesi", [200], "Cayma"],
  ["/iade-politikasi", [200], "İade"],
  ["/robots.txt", [200], "Sitemap"],
  ["/sitemap.xml", [200], "urlset"],
  // Korumalı alanlar girişe yönlenmeli (redirect izlenmez → 307/308)
  ["/admin", [307, 308]],
  ["/satici-panel", [307, 308]],
  ["/hesabim", [307, 308]],
  // API uçları: yetkisiz istek 4xx dönmeli, 5xx DÖNMEMELİ
  ["/api/notify/shipped", [400, 401], null, "POST"],
  ["/api/notify/kyc", [400, 401], null, "POST"],
  ["/api/checkout/confirm", [400, 401], null, "POST"],
];

let failed = 0;
for (const [path, expected, mustContain, method = "GET"] of CHECKS) {
  const url = BASE + path;
  try {
    const res = await fetch(url, {
      method,
      redirect: "manual",
      headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: method === "POST" ? "{}" : undefined,
    });
    const okStatus = expected.includes(res.status);
    let okBody = true;
    if (okStatus && mustContain) {
      const text = await res.text();
      okBody = text.includes(mustContain);
    }
    if (okStatus && okBody) {
      console.log(`  ✓ ${method} ${path} → ${res.status}`);
    } else {
      failed++;
      console.error(
        `  ✗ ${method} ${path} → ${res.status}` +
          (okStatus ? ` (metin bulunamadı: "${mustContain}")` : ` (beklenen: ${expected.join("/")})`),
      );
    }
  } catch (err) {
    failed++;
    console.error(`  ✗ ${method} ${path} → istek hatası: ${err.message}`);
  }
}

console.log(failed === 0 ? `\nSMOKE OK — ${CHECKS.length} kontrol geçti` : `\nSMOKE FAIL — ${failed} kontrol başarısız`);
process.exit(failed === 0 ? 0 : 1);
