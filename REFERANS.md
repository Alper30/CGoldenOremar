# Referans & Doldurulacaklar — Yeni ve Modern Golden Oremar

> Bu dosya **senin doldurman** içindir. Köşeli parantezli `[ ... ]` alanların içini doldur.
> Doldurdukça projenin beyni (`CLAUDE.md`) netleşir. **Bilmediğin/sonra karar vereceğin yeri boş bırak** ya da `SONRA` yaz.
> İşaretler: 🔴 = inşaya başlamadan gerekli · 🟡 = ilk fazda iyi olur · 🟢 = sonra (yayın aşaması).

---

## 1. 🎨 Tasarım Referansı (en önemli — "sıfırdan modern redesign" buna göre olacak)

- **Beğendiğin örnek site/uygulamalar** (link veya isim — 1-5 adet):
  - [ ... ]
  - [ ... ]
  - [ ... ]
- **Bu örneklerin neyini beğendin?** (renk / sadelik / yazı tipi / düzen / animasyon vb.)
  - [ ... ]
- **Genel his/atmosfer** (örn: doğal-sıcak / minimal-lüks / canlı-modern / başka):
  - [ ... ]
- **Renkler** (varsa kesin istediklerin; yoksa boş bırak):
  - Ana renk: [ ... ]   İkincil: [ ... ]   Vurgu: [ ... ]
- **Logo** var mı? (dosya yolu / "yok, tasarlanacak"):
  - [ ... ]
- **Yazı tipi (font)** tercihi (varsa):
  - [ ... ]
- **Görsel/ekran görüntüsü/moodboard** koyacağın yer: bu klasöre at, yolunu yaz:
  - [ ... ]   (örn: `Yeni-Golden-Oremar/referans-gorseller/`)

> 💡 Ekran görüntüsü, PDF, Figma linki, ya da "şu siteye benzesin" demen yeter. Dosyaları bu klasöre koyup buraya yollarını yaz.

---

## 1.B 🔍 Rakip & Örnek Siteler

> Buraya rakip/örnek site linkleri ekle. Ben her birini inceleyip güçlü/zayıf yanlarını çıkarır,
> bizi onlardan **öne çıkaracak** farklılaşmayı `CLAUDE.md` §10'a işlerim.

**İncelenenler:**

1. **https://omcakoyurunleri.com.tr/** — Omca Köy Ürünleri (Manisa/Turgutlu)
   - Satıyor: asma yaprak, zeytin/zeytinyağı, salça, tarhana, reçel/pekmez (≈300–2.500₺)
   - Model: **tek satıcılı** (kendi ürünleri)
   - Güçlü: net "doğal" konumlandırma, WhatsApp destek, farklı paket boyutları (perakende+toptan)
   - Zayıf: **yorum/puan yok**, sertifika yok, içerik/blog yok, bazı ürünler stok dışı, ürün detayı zayıf

2. **https://koyumdengelsin.com/** — Köyümden Gelsin
   - Satıyor: peynir/tereyağı, bal/pekmez, zeytin, salça, Anadolu lezzetleri (≈249–1.099₺)
   - Model: **tek satıcılı** (bölgesel üreticilerden tedarik; gerçek pazaryeri değil)
   - Güçlü: indirim kampanyaları, ürün karşılaştırma, hızlı görünüm, detaylı ürün açıklaması
   - Zayıf: **üretici profili/hikâyesi yok**, **yorum/puan yok**, kargo/ödeme bilgisi belirsiz, sertifika yok, "satıcı ol" yok

**Ortak boşluk (= bizim fırsatımız):** İkisi de gerçek **pazaryeri değil**; üreticiler kendi profiliyle satmıyor, **sosyal kanıt (yorum/puan) ve güven katmanı (KYC, sertifika, escrow) yok.** Detaylı strateji → `CLAUDE.md` §10.

**Türkiye'deki GERÇEK pazaryeri rakipleri** (derin analiz → `CLAUDE.md` §10.4):
- **ÇiftçidenEve** (en yakın rakip): açık üretici pazaryeri, 900+ üretici, KYC + ödeme koruması var. Komisyon **%7–15** (abonelik kademeli). → komisyon benchmark'ımız.
- **Çiftçipark** (büyüyen pazaryeri) · **Tazedirekt** (Migros, küratörlü) · **Trendyol/Hepsiburada** (genel).
- Bizim farkımız: görünür güven katmanı + premium tasarım + native app + üretici hikâyeleri.

**Senin ekleyeceğin diğer örnek/rakip siteler:**
- [ ... ]
- [ ... ]

---

## 2. 🏷️ Marka

- 🟡 Müşteriye görünen **marka adı**: [ Golden Oremar / başka? ]
- 🟢 **Alan adı (domain)**: [ goldenoremar.com / başka? ] — elinde mi, alınacak mı? [ ... ]
- 🟡 **Slogan**: [ "Doğanın Kalbinden Gelen Şifa" / yeni? ]
- 🟡 **Marka hikâyesi / hakkımızda metni** (kısa): [ ... ]

---

## 3. 💰 Komisyon & Para Kuralları

- 🟡 **Komisyon oranı**: [ örn. %10 ] — yüzde mi, sabit+yüzde mi? [ ... ]
- 🟡 **Hizmet bedeli** (varsa sabit ek ücret): [ ... ]
- 🟡 **İşlem/ödeme bedeli** alıcıdan mı satıcıdan mı kesilecek? [ ... ]
- 🟡 **İade/teslim onay penceresi** (escrow süresi): [ örn. 3 gün / 7 gün ]
- 🟡 **Satıcıya ödeme (payout) zamanı**: [ teslimden X gün sonra / haftalık / talep üzerine ]
- 🟢 **Minimum çekim tutarı** (varsa): [ ... ]

---

## 4. 💳 Ödeme Altyapısı (Stripe + iyzico)

- 🟡 **Hangisi öncelikli / hangi durumda?** [ örn. iyzico yurt içi, Stripe yurt dışı ]
- 🔴 (gerçek ödeme fazında) **iyzico hesabı** var mı? API anahtarları: [ SONRA ver — gizli ]
- 🔴 (gerçek ödeme fazında) **Stripe hesabı** var mı? API anahtarları: [ SONRA ver — gizli ]
- 🟡 **Taksit** desteklenecek mi? [ ... ]

> 🔐 API anahtarlarını bu dosyaya YAZMA. Sırası gelince güvenli şekilde `.env`'e koyarız.

---

## 5. 🪪 Satıcı & KYC (Kimlik Doğrulama)

- 🟡 **KYC seviyesi**: hangileri zorunlu olsun?
  - [ ] Ad-Soyad
  - [ ] TC Kimlik No
  - [ ] IBAN
  - [ ] Telefon
  - [ ] Kimlik belgesi fotoğrafı (ön/arka)
  - [ ] Selfie / yüz doğrulama
  - [ ] Adres belgesi
  - [ ] Vergi levhası (esnaf satıcı için)
- 🟡 **Bireysel mi, esnaf/şirket satıcı da olacak mı?** [ ... ]
- 🟡 **Onay süreci**: manuel admin onayı mı, otomatik mi? [ manuel öneriliyor ]

---

## 6. 📦 Kargo & Teslimat

- 🟡 **Anlaşmalı kargo firmaları** (varsa): [ Aras / MNG / Yurtiçi / PTT / yok ]
- 🟡 **Kargo ücretini kim öder?** [ alıcı / satıcı / ücretsiz eşik ]
- 🟡 **Kargo takip no zorunlu** (anti-fraud için öneriliyor): [ evet / hayır ]
- 🟢 **Soğuk zincir / hızlı teslim** gereken ürünler var mı? (süt, taze ürün) [ ... ]

---

## 7. 🗂️ İçerik & Katalog (başlangıç verisi)

- 🟡 **Kategoriler** (başlangıç listesi — istediğin gibi düzenle):
  - [ Bal Ürünleri ]
  - [ Süt Ürünleri ]
  - [ ... ]
  - [ ... ]
- 🟡 **İlk örnek ürünler** (varsa isim/fiyat/görsel): [ ... veya "satıcılar ekleyecek" ]
- 🟡 **İletişim bilgileri** (footer için): telefon [ ... ] · e-posta [ ... ] · adres [ ... ]
- 🟡 **Sosyal medya** linkleri: Instagram [ ... ] · diğer [ ... ]

---

## 8. ⚖️ Yasal / Zorunlu Metinler (Türkiye e-ticaret)

- 🟢 KVKK / Gizlilik Politikası metni: [ var / hazırlanacak ]
- 🟢 Mesafeli Satış Sözleşmesi: [ var / hazırlanacak ]
- 🟢 İade & İptal Politikası: [ var / hazırlanacak ]
- 🟢 Satıcı Sözleşmesi (komisyon şartları): [ var / hazırlanacak ]

---

## 9. 🔑 Hesaplar & Erişimler (yayın/inşa için — sırası gelince)

- 🟡 **Supabase**: yeni proje açılsın mı? [ evet → ben açarım / kendi hesabın ]
- 🟢 **Hosting (web)**: Vercel hesabın var mı? [ ... ]
- 🟢 **Apple Developer** hesabı (iOS yayını için, ~99$/yıl): [ var / yok ]
- 🟢 **Google Play Console** hesabı (Android yayını için, ~25$ tek sefer): [ var / yok ]
- 🟢 **E-posta gönderimi** (sipariş/bildirim): hangi servis? [ Resend / SMTP / ? ]

---

## 10. 📝 Aklındaki Diğer Her Şey

> Yukarıda olmayan ama istediğin özellik, fikir, kısıt, örnek — buraya serbestçe yaz:

- [ ... ]
- [ ... ]
- [ ... ]

---

### Nasıl ilerleyeceğiz
1. Sen bu dosyayı doldur (ya da sadece şimdilik **§1 Tasarım** ve **§3 Komisyon**'u).
2. Bana "doldurdum" de.
3. Ben doldurduklarını `CLAUDE.md`'ye (projenin beyni) işlerim.
4. Her şey netleşip **"başla"** dediğinde inşaya geçeriz.
