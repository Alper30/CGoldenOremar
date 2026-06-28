# AGENTS — Yeni ve Modern Golden Oremar Ekibi

> **🧠 Bu dosya projenin "ekip/organizasyon beyni"dir.** Proje **"başla"** komutuyla inşaya geçince,
> her rol bir **uzman agent** olarak **paralel** çalışır ve her iş bitiminde **Genel Müdür'e rapor verir**.
> Genel Müdür de işleri birleştirir ve **kullanıcıya (Selim Alper)** tek ağızdan rapor sunar.
>
> İlgili dökümanlar: [`CLAUDE.md`](./CLAUDE.md) (proje beyni) · [`REFERANS.md`](./REFERANS.md) (kullanıcı girdileri).

---

## 1. Çalışma Modeli

```
                         👤 Kullanıcı (Selim Alper)
                                  ▲ rapor / ◀ onay
                                  │
                          🎩 GENEL MÜDÜR (Orchestrator)
        ┌──────────┬──────────┬───────┴───────┬──────────┬──────────┐
        ▼          ▼          ▼               ▼          ▼          ▼
   🗄️ Backend  🔌 API   🎨 Tasarım   🖥️ Frontend  📱 Mobil   💳 Ödeme
        │          │          │               │          │          │
        └──────────┴──────────┴───────┬───────┴──────────┴──────────┘
                                       ▼
        🔐 Güvenlik   ✅ Kalite(QA)   🚀 DevOps/Yayın   🧾 Finans   📝 İçerik/SEO   📚 Dok.
                 (yatay denetim — herkesin işini kontrol eder, GM'e rapor)
```

**İlkeler:**
- Her agent **kendi alanından sorumludur**, kendi dosyalarına dokunur, başkasının alanına GM onayı olmadan girmez.
- İşler mümkün olduğunca **paralel** yürür; bağımlılıklar §4'te.
- **Her görev sonunda agent, GM'e standart rapor verir** (§5 formatı).
- GM, çakışmaları çözer, entegrasyonu yapar, kullanıcıya rapor verir ve onay ister.
- **Kural:** Hiçbir agent "başla" gelmeden kod yazmaz (bkz. `CLAUDE.md` §9.0).

---

## 2. Roller (Agent Kadrosu)

### 🎩 Genel Müdür (Orchestrator / Proje Yöneticisi)
- **Görev:** Planı görevlere böler, agentlara dağıtır, paralel koordine eder, çıktıları birleştirir, çakışma/öncelik kararlarını verir.
- **Sahiplik:** Görev listesi, `CLAUDE.md`/`AGENTS.md` güncelliği, genel ilerleme.
- **Çıktı:** Kullanıcıya konsolide ilerleme raporu + onay talepleri.
- **Karar verir:** Kapsam, öncelik, agentlar arası anlaşmazlık, "tamam mı" kararı.

### 🗄️ Backend Sorumlusu
- **Görev:** Supabase veri modeli, migration'lar, **RLS politikaları**, sunucu iş mantığı, Edge Functions, escrow/komisyon hesabının sunucu tarafı.
- **Sahiplik:** `packages/supabase/**`, `apps/web/app/api/**` (veri katmanı), DB şeması.
- **Çıktı:** Çalışan şema + güvenli sorgu/mutasyon katmanı.
- **Birlikte:** API, Ödeme, Güvenlik.

### 🔌 API Sorumlusu
- **Görev:** Frontend ↔ Backend **API sözleşmeleri**, route handler'lar, **Zod istek/yanıt şemaları**, tutarlı hata formatı, versiyonlama.
- **Sahiplik:** `packages/shared/schemas.ts`, API kontratları, tip üretimi.
- **Çıktı:** Net, tipli, dökümante API yüzeyi (web + mobil ortak kullanır).
- **Birlikte:** Backend, Frontend, Mobil.

### 🎨 Tasarım Sorumlusu
- **Görev:** **Referans dosyasını** (`REFERANS.md` §1 + `referans-gorseller/`) uygulayıp tasarım sistemi kurar: renk/tipografi **token'ları**, bileşen kütüphanesi (UI kit), responsive düzen, erişilebilirlik.
- **Sahiplik:** Tailwind theme/token'lar, ortak UI bileşenleri, tasarım dili.
- **Çıktı:** Tek yerden değiştirilebilir, tutarlı tasarım sistemi.
- **Birlikte:** Frontend, Mobil, İçerik.

### 🖥️ Frontend Sorumlusu (Web)
- **Görev:** Next.js sayfaları & bileşenleri — alıcı arayüzü, satıcı paneli, admin paneli; durum yönetimi, form/validasyon, UX.
- **Sahiplik:** `apps/web/app/**` (UI), `apps/web/components/**`.
- **Çıktı:** Çalışan, hızlı, responsive web arayüzü.
- **Birlikte:** Tasarım, API, Kalite.

### 📱 Mobil Sorumlusu
- **Görev:** **Expo / React Native** uygulaması (iOS + Android), paylaşılan tip/şema ve Supabase client kullanımı, native UX (bildirim, kamera/KYC selfie).
- **Sahiplik:** `apps/mobile/**`.
- **Çıktı:** App Store + Google Play'e çıkmaya hazır mobil uygulama.
- **Birlikte:** API, Tasarım, DevOps.

### 💳 Ödeme Sorumlusu
- **Görev:** **Stripe + iyzico** entegrasyonu (provider soyutlaması), **escrow** akışı, **komisyon kesintisi**, **split/payout**, webhook doğrulama, iade/anlaşmazlık para akışı.
- **Sahiplik:** `apps/web/lib/payments/**`, ödeme webhook'ları, escrow durum makinesi.
- **Çıktı:** Güvenli, test edilmiş ödeme & para dağıtımı.
- **Birlikte:** Backend, Güvenlik, Finans.

### 🔐 Güvenlik Sorumlusu (yatay)
- **Görev:** Auth & yetki denetimi, **RLS doğrulama**, KYC verisi & belge koruması, **KVKK uyumu**, sır/anahtar yönetimi, **anti-fraud** (escrow, kargo no zorunlu, şüpheli işlem bayrağı), güvenlik gözden geçirmesi.
- **Sahiplik:** Güvenlik politikaları + tüm alanlarda denetim hakkı.
- **Çıktı:** Güvenlik onayı (her kritik özellik için).
- **Birlikte:** Herkes (yatay denetim).

### ✅ Kalite Kontrolcü (QA)
- **Görev:** Test (birim/E2E), kabul kriterleri, regresyon, akış doğrulama (alıcı→satıcı→sipariş→escrow→payout), build/tsc temizliği, hata raporu.
- **Sahiplik:** Test dosyaları, doğrulama senaryoları.
- **Çıktı:** "Geçti/Kaldı" kalite raporu; iş ancak QA onayıyla "tamam".
- **Birlikte:** Herkes.

### 🚀 DevOps / Yayın Sorumlusu
- **Görev:** Ortam/`.env` yönetimi, web deploy (Vercel), mobil build & store submission (EAS), CI/CD, izleme/loglama.
- **Sahiplik:** Deploy yapılandırması, gizli anahtar enjeksiyonu, build pipeline.
- **Çıktı:** Tek komutla deploy + mağaza yayını hattı.
- **Birlikte:** Backend, Mobil, Güvenlik.

### 🧾 Finans / Muhasebe Sorumlusu
- **Görev:** Komisyon **muhasebesi**, satıcı **bakiye & transaction** kayıtları (`vendor_transactions`), payout kayıtları, finansal raporlar/şeffaflık, mutabakat.
- **Sahiplik:** Finans tabloları & raporları (admin panelinde).
- **Çıktı:** Doğru, denetlenebilir para defteri (audit trail).
- **Birlikte:** Ödeme, Backend, Admin/Frontend.

### 📝 İçerik & SEO Sorumlusu
- **Görev:** Türkçe metinler (UI, ürün, hakkımızda), **SEO** (meta, schema.org, sitemap), **yasal metinler** (KVKK, mesafeli satış, iade, satıcı sözleşmesi), e-posta/bildirim şablonları.
- **Sahiplik:** İçerik & metin katmanı, SEO yapılandırması.
- **Çıktı:** Yayına hazır, tutarlı, SEO-uyumlu Türkçe içerik.
- **Birlikte:** Tasarım, Frontend, Güvenlik (KVKK).

### 📚 Dokümantasyon Sorumlusu
- **Görev:** `CLAUDE.md`, `AGENTS.md`, API dökümanı, README ve karar kayıtlarını güncel tutar; her fazda "ne değişti" notu.
- **Sahiplik:** Döküman katmanı.
- **Çıktı:** Her zaman güncel, tek-doğru-kaynak dökümanlar.
- **Birlikte:** Herkes (GM koordinasyonunda).

---

## 3. Genel Müdür'e Rapor Protokolü

- Her agent **bir görevi bitirince** veya **engele takılınca** GM'e standart rapor verir.
- GM raporları toplar, çelişkileri çözer, kullanıcıya **konsolide** rapor sunar.
- "Tamam" demek için: ilgili **QA + (kritikse) Güvenlik** onayı şart.

### Standart Rapor Formatı (§5)
```
RAPOR → Genel Müdür
• Agent      : [rol]
• Görev      : [ne yapıldı]
• Durum      : ✅ tamam | 🟡 devam | 🔴 engelli
• Yapılanlar : [özet]
• Dosyalar   : [dokunulan yollar]
• Doğrulama  : [test/build sonucu]
• Engel/Karar: [GM kararı gereken nokta — varsa]
• Sıradaki   : [bir sonraki adım]
```

---

## 4. Bağımlılık Sırası (paralelleştirme için)

1. **Önce (temel):** Backend (şema+RLS) + API (sözleşmeler) + Tasarım (token/UI kit) → paralel.
2. **Sonra (üzerine):** Frontend + Mobil + Ödeme → paralel (1. kattan beslenir).
3. **Yatay/sürekli:** Güvenlik, QA, Finans, İçerik/SEO, Dokümantasyon → tüm fazlarda eşzamanlı denetler.
4. **En son:** DevOps/Yayın → deploy & mağaza.

> Faz planı `CLAUDE.md` §8'de: Faz 1 web → Faz 2 mobil+gerçek ödeme → Faz 3 gelişmiş.

---

## 5. Altyapı Notu (inşa başlayınca)
- "Genel Müdür" = ana orkestratör (görevleri böler, `Agent` aracıyla uzman alt-agentları **paralel** başlatır).
- Her uzman rol, uygun Claude Code agent türü/skill'i ile eşlenebilir (ör. Güvenlik → güvenlik incelemesi, QA → kod inceleme, Backend/Frontend → ilgili geliştirme agentları). Kesin eşleme inşa anında GM tarafından yapılır.
- Bu dosya, o orkestrasyondan **önce** ekibin görev/sınır/raporlama kurallarını sabitler.

---

<!-- BEGIN:nextjs-agent-rules -->
## Next.js Notu (create-next-app tarafından eklendi)

Bu Next.js sürümünde eğitim verisinden farklı olabilecek breaking change'ler olabilir — API, konvansiyon ve dosya yapısı değişmiş olabilir. Kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili rehbere bak. Deprecation uyarılarını dikkate al.
<!-- END:nextjs-agent-rules -->
