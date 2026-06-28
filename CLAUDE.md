# Yeni ve Modern Golden Oremar

> **🧠 DURUM: BEYİN / SPEC GELİŞTİRME AŞAMASI — kod yazılmıyor.**
> Kullanıcı **"başla"** diyene kadar yalnızca bu döküman geliştirilir. İnşa onaydan sonra. (Bkz. §9.0)

> Bu dosya, sıfırdan yapılacak **yeni nesil Golden Oremar** projesinin referans/anayasa dökümanıdır.
> Mevcut iki proje incelenerek hazırlandı:
> 1. **Legacy sürüm** → `/Users/alper/Downloads/golden-oremar` (Vite + Express + SQLite + Firebase + Capacitor, çok-satıcılı marketplace)
> 2. **Next.js sürümü** → `/Users/alper/Desktop/Golden-Oremar-New` (Next.js 16 + Prisma + PostgreSQL, tek-satıcılı mağaza)
>
> Yeni proje adı: **Yeni ve Modern Golden Oremar**.
> **Karar (özet):** Next.js tabanlı, **çok-satıcılı doğal ürün pazaryeri**. İnsanlar kimlik doğrulamasıyla satıcı olur, kendi ürünlerini satar; platform **komisyon** alır. Ödeme: **Stripe + iyzico**. Ayrıntılar §8'de.

---

## 1. Marka & Amaç (Purpose)

**Golden Oremar**, Hakkâri / Yüksekova **Oremar yaylalarından** çıkan %100 doğal, organik ve geleneksel gıda ürünlerini doğrudan tüketiciye ulaştıran bir **doğal ürün e-ticaret markası**dır.

- **Slogan (legacy):** *"Doğanın Kalbinden Gelen Şifa"*
- **Konumlandırma (legacy):** *"VIP Organik Ekosistem"* — premium / concierge teslimat dili.
- **Ana vaat:** *"Yaylalardan sofranıza gelen %100 doğal, organik ve geleneksel lezzetler."*
- **Coğrafi/duygusal kök:** Berçelan Yaylası, Avaşin Deresi, 3000 rakım karakovan balı, sınır ötesi yüksek dağ ürünleri — yöresel hikâye ve menşe (terroir) anlatısı markanın kalbidir.
- **Resmî alan adı (hedef):** `goldenoremar.com`

### Marka değerleri
- Doğallık / organiklik / katkısız (ilaçsız, şekersiz, glutensiz, vegan etiketleri vurgulanıyor)
- Yöresellik & hikâye (üreticinin adıyla anılan ürünler: *"Merez Hatun'un Mağara Tulum Peyniri"*, *"Naciye'nin Saf Yayık Tereyağı"*)
- Güven & şeffaflık (menşe, hasat, "sağımdan kapıya")
- Premium his + erişilebilir fiyat

---

## 2. Kişiler / Paydaşlar (People)

| Rol | Açıklama | Sistemdeki karşılığı |
|-----|----------|----------------------|
| **Müşteri (alıcı)** | Doğal/organik gıda arayan son kullanıcı. Üye olur, sipariş verir, favori ekler. | `User (role: USER)` |
| **Satıcı / Üretici (Vendor)** | **Sıradan insanlar** — kendi bahçesindeki/evindeki ürünü satmak isteyen üreticiler. **Kimlik doğrulaması (KYC)** sonrası satış yapar, para kazanır. Kendi ürünlerini, stoğunu, siparişlerini ve kazancını yönetir. | `User (role: VENDOR)` + `VendorProfile` |
| **Yönetici (Admin)** | Platform işletmecisi. Satıcı onayı/KYC, ürün moderasyonu, komisyon, sipariş, kullanıcı, finans yönetir. | `User (role: ADMIN)` |
| **Platform / Marka sahibi** | Pazaryerini işleten taraf; her satıştan **komisyon** alır. | — |

> **✅ KARAR (yeni proje): Çok-satıcılı pazaryeri (multi-vendor marketplace).**
> Web sitesi bir **doğal ürünler satış platformu**dur. İnsanlar **kimlik doğrulaması ile** satıcı olur, kendi bahçe/ev ürünlerini satar ve para kazanır. **Platform her satıştan komisyon alır (hizmet bedeli + işlem bedeli).**

---

## 3. Hedef Kitle & Müşteri (Target / Customer)

- **Birincil müşteri:** Şehirde yaşayan, doğal/organik/katkısız gıdaya değer veren, premium ödemeye razı Türk tüketici.
- **İkincil:** Sağlık/şifa odaklı tüketiciler (bitki çayları, propolis, arı sütü, şifalı bitkiler), hediye alıcıları (hediye kartı / hediye siparişi özelliği var).
- **Dil:** Arayüz **Türkçe** + **Kürtçe** (çok dilli). Para birimi **₺ (TRY)**, `tr-TR` formatı (`₺249,90`).
- **Cihaz:** Mobil öncelikli. Mobil deneyim kritik (iOS + Android).

### 3.1 Coğrafi Odak & Konumlandırma (kullanıcı talebi ✅ — stratejik fark)
- **Bölgesel ilk-girişen (first-mover):** Proje öncelikle **Güneydoğu** için planlandı — **Hakkâri, Yüksekova, Şırnak, Başkale, Şemdinli** ve bu **il/ilçelere bağlı her köy ve belde**. Bu bölgede bu ölçekte bir üretici pazaryeri **yok → "Güneydoğu'da İLK biz olacağız."**
- **Üretici tabanı:** Bu yörelerin köylüleri/üreticileri (3000 rakım balı, dağ peyniri, yayla ürünleri vb.) → markanın yöresel hikâyesiyle birebir örtüşür.
- **Genişleme:** Aynı altyapı **batıda da** birebir kullanılabilir; sistem ülke geneline ölçeklenecek şekilde tasarlanır (il/ilçe/köy hiyerarşisi veri modelinde — bkz. §8.4.1 konum).
- **Çok dillilik:** **Türkçe + Kürtçe** arayüz; ayrıca **Kürtçe müşteri hizmetleri/destek** → bölge halkı için erişilebilirlik ve güven (rakiplerde yok). Kürtçe için bölgede baskın **Kurmancî** lehçesi esas alınır.
- **İçerik & destek sağlayıcı:** Kürtçe çeviri ve müşteri hizmetleri **kullanıcı + ekibi** tarafından sağlanacak; ayrıca **çok dilli AI chatbot** (Türkçe+Kürtçe) destek hattı olacak. (Claude taslak çeviri üretebilir, ekip doğrular.)

---

## 4. Ürün Kataloğu (Domain)

### Kategoriler

**Legacy sürüm (8 kategori — geniş):**
1. Et, Balık & Yumurta
2. Süt & Şarküteri
3. Taze Meyve & Sebze
4. Kurutulmuş Gıda & Kiler
5. Dağ Mahsulleri
6. Doğal Taşlar & Enerji
7. Bal & Şifalı Bitkiler
8. Yöresel İçecekler

**Next.js sürüm (5 kategori — sadeleştirilmiş):**
1. Bal Ürünleri
2. Süt Ürünleri
3. Zeytin Ürünleri
4. Yumurta
5. Tatlı & Şekerleme

### Örnek ürünler (marka tonunu gösterir)
- Sınır Ötesi 3000 Rakım Karakovan Balı
- Berçelan Yaylası Bahar Çiçek Balı / Avaşin Meşe Balı
- Merez Hatun'un Mağara Tulum Peyniri
- Naciye'nin Saf Yayık Tereyağı
- Hakkari Dağ Elması (İlaçsız), Yüksekova Yayla Domatesi
- Avaşin Deresi Canlı Alabalığı (Özel Hasat)
- Ekşi Karadut Suyu (Şekersiz), Hardaliye, Ata Tohumu Dağ Kekiği Suyu
- Propolis, Arı Sütü, Organik Zeytinyağı, Köy Yumurtası

> Ürün isimleri **hikâye + menşe + "katkısız" etiketi** kalıbını izler. Yeni projede de bu ton korunmalı.

---

## 5. İki Mevcut Projenin Karşılaştırması

| Konu | Legacy (`Downloads/golden-oremar`) | Next.js (`Desktop/Golden-Oremar-New`) |
|------|-----------------------------------|---------------------------------------|
| **Mimari** | Vite SPA + tek dosya `App.tsx` (tab-based routing, ~binlerce satır) | Next.js 16 App Router (dosya bazlı route, sayfa başına `page.tsx`) |
| **Backend** | `server.ts` (~34KB Express monolith) | Next.js API Routes (`app/api/**`) |
| **DB** | SQLite (`better-sqlite3`) + Firebase/Firestore (hibrit) | PostgreSQL + Prisma ORM |
| **Auth** | JWT + Firebase Auth (Google/Facebook/Apple OAuth) | JWT (jose/jsonwebtoken) + bcrypt + next-auth |
| **Ödeme** | Stripe entegre | Henüz yok (planlı) |
| **Mobil** | Capacitor (iOS+Android) + PWA | Ayrı Expo mobil iskeleti (`mobile/`) |
| **AI** | `@google/genai` (Gemini) — AI Studio'dan üretilmiş | Yok |
| **Satıcı modeli** | **Çok-satıcılı** (vendor başvuru, onay, vendor finans, vendor mağaza) | **Tek-satıcılı** |
| **Admin kapsamı** | Çok geniş: Dashboard, Products, Categories, Orders, Users, Vendors, VendorApplications, Stock, Returns, Reviews, Campaigns, Events, Finance, Marketing, Notifications, Content, Settings | Daha sade: Dashboard, Products, Categories, Orders, Bookings, GiftCards, Users |
| **Ekstra özellikler** | Etkinlikler (Events), Sağlık Rehberleri (HEALTH_GUIDES), Tarifler (Recipes), Blog, Yorumlar (Reviews), Adres yönetimi, Bildirimler | Booking (randevu), Golden Kulüp (üyelik), Hediye siparişi, Favoriler, Abandoned-cart e-posta |
| **Tasarım** | Yeşil (#16A34A) ağırlıklı, lucide-react ikonlar, motion | Altın/amber palet (#C9A961 / gold) + koyu yeşil, framer-motion, Playfair font |
| **Durum** | Orijinal/prototip (AI Studio üretimi, script bolluğu: `fix_*.cjs`) | Production'a hazırlanan denetlenmiş sürüm (0 TS hatası, build ✅) |

---

## 6. Teknik Detaylar (Referans)

### Next.js sürümü — Veri Modeli (Prisma)
Modeller: `User`, `Category`, `Product`, `CartItem`, `Order`, `OrderItem`, `GiftCard`, `Favorite`, `Booking`, `GiftOrder`, `PasswordResetToken`
Enumlar: `Role(USER|ADMIN)`, `OrderStatus(PENDING|CONFIRMED|PROCESSING|SHIPPED|DELIVERED|CANCELLED|REFUNDED)`, `PaymentStatus`, `BookingStatus`, `GiftOrderStatus`

> Para alanları `Decimal(10,2)`; API'de `serialize()` ile number'a çevrilir. Fiyat/stok hesabı **her zaman sunucuda** yapılır (istemciye güvenilmez).

### Next.js sürümü — Stack
`next@16`, `@prisma/client`, `bcryptjs`, `jose`, `jsonwebtoken`, `next-auth`, `react-hot-toast`, `framer-motion`, `winston`, `zod`

### Legacy sürümü — API yüzeyi (server.ts)
auth (register/login/me), products, vendors, categories, cart, favorites, addresses, checkout (Stripe), orders, admin/dashboard, admin/orders, vendor başvuru & onay, stock reports, reviews moderasyon...

---

## 7. Tasarım Dili (yeni projede korunacak)

- **Renk paleti:** Altın/amber `#C9A961` (light) + `gold` (dark), koyu yeşil arka plan (`green-primary`), turuncu vurgu (`orange-accent`). **Emoji yok, neon yok** (denetimde temizlendi).
- **Tipografi:** Başlıklar `font-playfair` (zarif serif), gövde sans-serif.
- **Hareket:** `framer-motion` ile yumuşak giriş animasyonları.
- **Dil & format:** Türkçe metin, `₺` + `tr-TR` sayı formatı.
- **Mobil öncelikli**, responsive grid, dark mode birinci sınıf vatandaş.

---

## 8. Yeni Proje — Kesinleşmiş Kararlar ✅

| Konu | Karar |
|------|-------|
| **İş modeli** | **Çok-satıcılı pazaryeri** — doğal ürünler satış platformu |
| **Satıcı** | Sıradan bireyler; **kimlik doğrulaması (KYC)** sonrası kendi ürünlerini satar |
| **Gelir modeli** | Platform her satıştan **komisyon** alır = **hizmet bedeli + işlem bedeli** |
| **Web** | **Next.js** (App Router) — profesyonel, production-grade |
| **Mobil** | **Expo / React Native** → iOS (App Store) + Android (Google Play) |
| **Backend / DB** | **Supabase** (PostgreSQL + Auth + Storage + Realtime). Web & mobil aynı backend'i kullanır |
| **Ödeme** | **Stripe + iyzico** (ikisi birden, provider soyutlaması ile) |
| **Tasarım** | **Sıfırdan modern redesign** (marka adı kalır; renk/tipografi/düzen baştan) |
| **Strateji** | **Aşamalı** (Faz 1 web çekirdek → Faz 2 mobil → Faz 3 gelişmiş) |
| **Hedef platformlar** | Profesyonel web + iOS app + Google Play app |

### 8.1 Pazaryeri akışı (marketplace flow)
1. Kullanıcı kayıt olur (alıcı).
2. "Satıcı ol" → **KYC / kimlik doğrulaması** (TC kimlik, ad-soyad, IBAN, iletişim, opsiyonel belge/selfie).
3. Admin başvuruyu inceler → **onay**. Satıcı paneli açılır.
4. Satıcı ürün ekler → ürünler **moderasyondan** geçip yayına girer.
5. Alıcı sipariş verir, ödeme alınır.
6. **Komisyon** otomatik kesilir; satıcı kazancı (net tutar) **payout/bakiye** olarak satıcıya yansır.
7. Satıcı kazancını takip eder; admin tüm finansı yönetir.

### 8.2 Komisyon modeli
- Her satışta: **`platform_komisyonu = hizmet_bedeli + işlem/ödeme_bedeli`**.
- Satıcıya ödenen net = `ürün tutarı − komisyon (− varsa kargo/iade)`.
- Komisyon oranı yapılandırılabilir olmalı (genel veya kategori/satıcı bazlı).
- Her sipariş kaleminde komisyon **kaydedilmeli** (muhasebe/şeffaflık için).
- _Açık detay:_ komisyon oranı yüzdesi? sabit + yüzde mi? — kullanıcı belirleyecek.

### 8.3 Ödeme & para akışı (kritik mimari)
- **✅ KARAR: Her iki ödeme altyapısı da kullanılacak (Stripe + iyzico).** Kod, ödeme sağlayıcısını soyutlayan bir **payment provider arayüzü** üzerinden yazılmalı (ileride hangisinin ne zaman kullanılacağı netleşecek).
- **iyzico** → Türkiye için ideal: **alt üye işyeri (submerchant / marketplace) modeli** ile parayı satıcılara böler, komisyonu platformda tutar. TC/IBAN ile yerel ödeme + taksit.
- **Stripe** → **Stripe Connect** ile uluslararası/kart ödemeleri ve otomatik split/payout.
- Sipariş birden çok satıcının ürününü içerebilir → **çoklu satıcıya bölünmüş ödeme** (split payment) gerekir.
- _Açık detay (sonra):_ varsayılan sağlayıcı / yurt içi-dışı dağılımı.

### 8.3.1 Kargo & Sahtekârlık Önleme (anti-fraud) — KRİTİK ✅
> **Karar:** Kargoyu **satıcı gönderir**, ama platform **tam kontrol** sağlar; sahtekârlık engellenecek. Bu marketplace'in en hassas parçası.

**Mekanizma — Emanet (Escrow) ödeme:**
1. Alıcı öder → para **platformda tutulur (escrow)**, satıcıya HEMEN gönderilmez.
2. Satıcı ürünü kargolar → **kargo takip numarası girmek ZORUNLU** (numara olmadan sipariş "kargolandı" olamaz).
3. Sistem kargo durumunu izler (kargo API entegrasyonu / takip).
4. Alıcı teslim alır → **"Teslim aldım" onayı** veya teslimden sonra **otomatik onay süresi** (örn. 3-7 gün iade penceresi).
5. Onay/süre sonunda → **komisyon kesilir, net tutar satıcının bakiyesine/payout'una geçer.**
6. Anlaşmazlık varsa → **admin hakemliği** (dispute), para iade veya satıcıya aktarılır.

**Ek sahtekârlık önlemleri:**
- Satıcı KYC (TC + IBAN + kimlik doğrulama) — payout öncesi zorunlu.
- Yeni satıcıya **payout bekleme süresi / hold**.
- Ürün moderasyonu (yayına girmeden admin onayı).
- Alıcı↔satıcı puan/yorum sistemi (güven skoru).
- Şüpheli işlem/iade oranı yüksek satıcı için otomatik bayrak.
- Tüm para hareketleri `VendorTransaction` olarak kayıt altında (audit trail).

### 8.3.2 Lojistik, Kargo & Soğuk Zincir (kullanıcı talebi ✅)
- **Toplama/teslim noktası modeli:** Üretici ürünü **ilçe merkezine getirir** (kargo köye uğramayabilir). Sistem buna göre çalışır; ürünü merkeze **getirebilen** üreticiler için akış desteklenir (esnek). İleride ilçe bazlı toplama noktaları/anlaşmalı kargo şubesi.
- **Soğuk zincir / bozulabilir ürünler (süt, peynir, tereyağı):** Platform **özel yalıtımlı / soğuk tutan ambalaj** (buz aküsü/termal kutu) sağlayacak. Ürünler bozulmadan gönderilecek.
- **Ambalaja erişim (iki yol):**
  1. **Platformdan sipariş:** Satıcılar özel soğuk/koruyucu ambalajları **platform üzerinden bizden sipariş edebilir** (adrese gönderim). Veri modeline `PackagingOrder` benzeri kavram.
  2. **Belirli noktadan teslim alma:** Ürünü **ilçe merkezine getiren üretici**, ambalajları **belirlenmiş bir noktadan (toplama noktası/depo) fiziksel olarak alır** — getirirken hazır ambalajı orada teslim alır. Sipariş/kargo beklemeden anında.
- _Not:_ İlçe merkezindeki **toplama noktası = ambalaj dağıtım noktası** olarak da çalışabilir (tek lokasyon, çift işlev).
- _Açık detay (sonra):_ anlaşmalı kargo firması, soğuk zincir teslim süresi/garantisi, ambalaj fiyatlandırması.

### 8.3.3 Yardımlı Kayıt (Assisted Onboarding) (kullanıcı talebi ✅)
- **Evet, yardımlı kayıt olacak.** Üreticinin akıllı telefonu/teknik becerisi yoksa **biz/ekip onun adına** (telefonla veya yüz yüze) kayıt + ürün girişi yapabilir.
- Bunun için **admin/operatör "satıcı adına işlem" yetkisi** (bir tür temsilci/temsili kayıt rolü) gerekir → admin panelinde "üretici ekle / üretici adına ürün gir" akışı.
- KYC bilgileri (TC/IBAN vb.) operatör tarafından üreticiden alınıp girilir; onay yine admin/KYC sürecinden geçer.

### 8.4 Veri modeli eklemeleri (legacy'den taşınacak + yeni)
- `VendorProfile` (mağaza adı, KYC durumu, IBAN, komisyon oranı, bakiye, **konum: il/ilçe/yöre + opsiyonel koordinat**)
- `Product.vendorId` (her ürün bir satıcıya ait)
- `Product.origin` / **menşe-konum** (ürünün geldiği yer; satıcı konumundan miras alır ama ürün bazında değiştirilebilir — bal Hakkâri, zeytin Ayvalık olabilir)
- `Order` / `OrderItem` → satıcı bazlı kırılım, komisyon ve net tutar alanları
- `VendorApplication` (KYC başvuru & onay durumu)
- `Payout` / `VendorTransaction` (satıcı kazanç & ödeme geçmişi)
- `Review` (ürün/satıcı puanı + yorum — güven için kritik)
- **Satıcı istatistikleri** (hesaplanan/agregat): toplam satılan ürün adedi, tamamlanan sipariş sayısı, **olumlu geri bildirim oranı (%)**, ortalama puan, yorum sayısı, üyelik tarihi, **güven skoru/rozetler** (KYC doğrulandı, hızlı kargo, yüksek puanlı satıcı vb.)

### 8.4.1 Konum & Menşe (kullanıcı talebi ✅)
- **Her satıcı kayıtta/onboarding'de konumunu seçer** (il/ilçe, yöre; opsiyonel harita/koordinat).
- **Ürün kartında menşe/konum etiketi**: ürün görselinin **sağ üst köşesinde** "📍 {yöre/şehir}" rozeti (ör. "Hakkâri", "Ayvalık") — ürünün nereden geldiğini anında gösterir.
- Konuma göre filtreleme/arama (ör. "Ege zeytinyağı", "Doğu balı") ileride mümkün.

### 8.4.2 Satıcı Güven Profili (kullanıcı talebi ✅ — projenin farkı)
> Amaç: alıcı satıcının profiline girince **rahat ve güvende** hissetsin.
- Alıcı, ürün/karttan satıcı adına tıklayıp **satıcı profil/mağaza sayfasına** gider.
- Profilde gösterilecekler: mağaza adı + konum + **KYC doğrulandı rozeti**, ortalama **yıldız puanı**, **yorum sayısı**, **toplam satılan ürün/sipariş adedi**, **olumlu geri bildirim oranı (%)**, üyelik tarihi, güven rozetleri, satıcının diğer ürünleri ve **müşteri yorumları** (yıldız + metin).
- Bu şeffaflık katmanı rakiplerde yok (bkz. §10) → ana farklılaştırıcımız.

### 8.5 Korunacak ilkeler
- **GÜVEN & FARK ilkesi (en üst öncelik):** Proje **farklı ve güvenilir** olmalı. Güven sinyalleri (KYC doğrulandı rozeti, menşe/konum, satıcı puanı, olumlu geri bildirim %, yorumlar, escrow) **her ekranda görünür** olacak; amaç alıcının **rahat ve güvende** hissetmesi. (Detay: §8.4.1, §8.4.2, §10)
- Marka tonu: yöresel hikâye, premium his, **Türkçe + Kürtçe** (çok dilli). (Renk/tipografi: tasarım referansına göre.)
- **Bölgesel ilk-girişen**: Güneydoğu (Hakkâri/Yüksekova/Şırnak/Başkale/Şemdinli + bağlı köyler) odaklı; batıya ölçeklenebilir. (bkz. §3.1)
- Production-grade: gerçek ödeme, e-posta, görsel depolama, deploy.
- Mobil öncelikli (PWA + opsiyonel native).
- Fiyat/komisyon/stok hesabı **her zaman sunucuda**.

### 8.6 Platform hedefleri ✅
- **Profesyonel web sitesi** (Next.js, responsive, production-grade).
- **iOS uygulaması** (App Store) → **Expo / React Native**.
- **Android uygulaması** (Google Play) → **Expo / React Native**.
- Web + mobil **ortak backend (Supabase)** ve **ortak tip/şema katmanı** kullanır.

### 8.7 Sonra karara bağlanacaklar (ertelendi)
- **Tasarım/görsel kimlik** → kullanıcı **referans dosyası** verecek; ona göre uygulanacak.
- **Komisyon oranı** → sonra belirlenecek. (Kod: oran **yapılandırılabilir** olmalı, sabit kodlanmamalı.)
- Stripe ↔ iyzico rol dağılımı (yurt içi/dışı) → sonra.
- Faz 1 ödeme kapsamı (gerçek ödeme mi, önce katalog+sipariş mi) → sonra.
- KYC seviyesi (TC+IBAN zorunlu; belge/selfie eklenecek mi?) → **henüz karar verilmedi, bakılacak.**
- Pilot/başlangıç bölgesi (tek ilçe mi tüm bölge mi) → **sonra düşünülecek.**
- Marka adı (varsayılan: Golden Oremar) → sonra teyit.
- Hosting (web: Vercel önerisi) → sonra. (Depolama: Supabase Storage ✅)
- Lojistik detayları: anlaşmalı kargo, soğuk zincir süre garantisi, ambalaj fiyatı → sonra. (Model: §8.3.2)

---

## 9. Çalışma Notları (Claude için)

### 9.0 ÇALIŞMA KURALI — ÖNEMLİ ⛔
- **Kullanıcı açıkça "başla" demeden KOD YAZMA / proje iskeleti kurma / paket kurma.**
- Şu an **beyin/spec geliştirme aşamasındayız**: sadece bu `CLAUDE.md` dosyasını geliştirip netleştiriyoruz.
- Her şey konuşulup onaylanınca, kullanıcının "başla" komutuyla inşaya geçilecek.
- Bu aşamada izinli tek eylem: bu dökümanı güncellemek + sorular sormak + mevcut projeleri incelemek (salt-okunur).

### 9.1 Kod yazım kuralları (inşa başlayınca)
- Arayüz **çok dilli (i18n): Türkçe + Kürtçe (Kurmancî)**. Metinler sabit kodlanmaz, çeviri katmanından gelir (Türkçe varsayılan). Kürtçe müşteri hizmetleri de planlı.
- Fiyat gösterimi: `₺{value.toLocaleString("tr-TR", {minimumFractionDigits:2})}`.
- Para/komisyon/stok mantığı **sunucuda**, istemci değerlerine güvenme.
- Emoji kullanma; tasarım referans dosyasına/markaya sadık kal.
- Yeni özellik eklerken önce ilgili mevcut projedeki karşılığına bak (iki referans klasör).

---

## 10. Rekabet & Farklılaşma (bizi öne çıkaracak)

> İncelenen rakipler (detay: `REFERANS.md` §1.B): **omcakoyurunleri.com.tr** ve **koyumdengelsin.com**.
> Kullanıcı yeni siteler ekledikçe burası güncellenecek.

### 10.1 Rakiplerin ortak zaafları
- İkisi de **gerçek pazaryeri değil** (tek satıcı / kapalı tedarik). Üretici kendi adıyla satmıyor.
- **Müşteri yorumu / puanı yok** → sosyal kanıt zayıf.
- **Üretici profili / hikâyesi yok** → menşe güveni eksik.
- **Güven katmanı yok**: KYC, sertifika, escrow, net iade/kargo politikası belirsiz.
- İçerik/SEO, çok dillilik, mobil app yok ya da zayıf.

### 10.2 Bizim üstünlüklerimiz (onlardan öne çıkış)
1. **Gerçek çok-satıcılı pazaryeri**: Üreticiler **KYC ile** kendi adına satar → çeşitlilik + ölçeklenebilirlik (onlar tek mağaza, biz binlerce üretici).
2. **Güven & şeffaflık katmanı**: Escrow ödeme, kargo takip zorunlu, teslim onayı, **müşteri yorum/puan**, üretici **güven skoru** → onlarda hiç yok.
3. **Üretici hikâyeleri & profilleri**: Her ürünün arkasında yüz/menşe (legacy markanın "Merez Hatun'un peyniri" tonu) → duygusal bağ + premium algı.
4. **Üstün tasarım**: `impeccable` + `taste-skill` ile jenerik UI yerine özgün, modern, premium arayüz (rakipler şablon tema kullanıyor).
5. **Çok platform**: Profesyonel web + **iOS + Android app** (rakiplerde yok).
6. **İçerik & SEO + sağlık/tarif rehberleri** (legacy'den): organik trafik + değer.
7. **Sertifika & kalite rozetleri**: organik/laboratuvar/hijyen belgeleri ürün/satıcı sayfasında.
8. **Net lojistik & ödeme**: şeffaf kargo, çoklu ödeme (Stripe+iyzico), taksit.
9. **Bölgesel ilk-girişen (Güneydoğu'da İLK)**: Hakkâri/Yüksekova/Şırnak/Başkale/Şemdinli ve bağlı köyler — rakipler (ÇiftçidenEve dahil) batı-merkezli; bu bölgenin üreticisi dijital pazaryerine erişemiyor. Biz bu boşluğu **ilk** dolduruyoruz. (Detay: §3.1)
10. **Kürtçe dil + Kürtçe müşteri hizmetleri**: arayüz Türkçe+Kürtçe (Kurmancî), destek Kürtçe → bölge halkı için erişilebilirlik ve **güven**; hiçbir rakipte yok. Güçlü yerel benimseme avantajı.

### 10.3 Onlardan örnek alınacaklar (iyi yanları)
- Farklı **paket boyutları** (perakende + toptan) — Omca.
- **İndirim/kampanya** etiketleri, **ürün karşılaştırma**, **hızlı görünüm** — Köyümden Gelsin.
- Detaylı ürün açıklaması (ham madde, ağırlık, üretim) — ikisinden.
- WhatsApp/canlı destek — Omca.

### 10.4 Türkiye'deki GERÇEK pazaryeri rakipleri (derin analiz)
> Omca & Köyümden Gelsin tek-satıcılı. Asıl rakipler aşağıdakiler — özellikle **ÇiftçidenEve** bizim modelimizin çoğunu zaten yapıyor. "İlk biz değiliz" ama "en güvenilir + en iyi tasarım" olabiliriz. Pazar **kanıtlanmış** (talep var).

**🎯 ÇiftçidenEve** (en yakın rakip — açık üretici pazaryeri, 2015'ten beri, 900+ üretici)
- **KYC (zaten yapıyorlar):** Bireysel → nüfus cüzdanı + **esnaf vergi muafiyeti belgesi** + banka hesabı. Şirket/kooperatif → vergi levhası, imza sirküleri, ticaret sicil, faaliyet belgesi, ürün sertifikaları.
- **Komisyon (KRİTİK BENCHMARK):** abonelik kademeli — Tohum (ücretsiz, **%15**), Leader (ücretsiz, **%12**), Hasat (8.970₺/6 ay, **%10**), Bereket (17.874₺/6 ay, **%7**). → **Bizim komisyon oranı kararı için referans: %7–15 bandı.**
- **Kargo paylaşımı:** <750₺ müşteri öder · 750–1.500₺ %50/%50 · >1.500₺ üretici öder.
- **Özellikler:** zorunlu **dijital fatura entegrasyonu**, kargo API, müşteri/satıcı paneli, ödeme aracılığı.
- **Güven:** ayıplı üründe iade, **kargo gecikmesine %1/gün cezai kesinti**, fatura zorunluluğu, yasaklı ürün listesi, KVKK.
- **Bizim farkımız:** daha güçlü görünür güven katmanı (güven skoru + olumlu geri bildirim % + menşe rozeti), **premium özgün tasarım**, **native iOS+Android app**, üretici hikâyeleri, escrow'u UX'te öne çıkarma.

**Çiftçipark** — üreticilerin satıcı profili açıp sattığı pazaryeri (büyüyor). **Tazedirekt** — küratörlü (açık pazaryeri değil), artık **Migros** bünyesinde. **Trendyol/Hepsiburada** — genel pazaryeri, niş değil.

**Çıkarım (komisyon kararı için):** Türkiye standardı **%7–15**. Biz rekabetçi olmak için ya bandın altında/ortasında konumlanmalı ya da düşük komisyon + güçlü güven/tasarım ile değer sunmalıyız. (Nihai oran kullanıcı kararı — bkz. §8.7)
