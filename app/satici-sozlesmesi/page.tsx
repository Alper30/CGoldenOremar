import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Satıcı Sözleşmesi ve Satış Politikası — Golden Oremar",
  description:
    "Golden Oremar satıcı sözleşmesi: üyelik ve KYC şartları, komisyon ve escrow ödeme akışı, kargo yükümlülükleri, ürün kuralları ve satıcı sorumlulukları.",
};

const sections: LegalSection[] = [
  {
    title: "Taraflar ve Platformun Rolü",
    body: [
      "Bu sözleşme; Golden Oremar platformu (\"Platform\") ile Platform üzerinde ürün satmak üzere başvuran/onaylanan üretici-satıcı (\"Satıcı\") arasında, satıcı başvurusunun onaylanmasıyla yürürlüğe girer.",
      "Platform, 6563 sayılı Kanun kapsamında aracı hizmet sağlayıcıdır: satış sözleşmesi doğrudan Alıcı ile Satıcı arasında kurulur; Platform ürünün üreticisi veya satıcısı değildir. Platform; listeleme, ödeme aracılığı (güvenli havuz/escrow), moderasyon ve anlaşmazlık hakemliği hizmetlerini sunar.",
      "Satıcı, Platformda kendi adına ve kendi mağaza profiliyle satış yapar; ilan içeriğinden, ürünün niteliğinden ve mevzuata uygunluğundan bizzat sorumludur.",
    ],
  },
  {
    title: "Üyelik Şartları ve Kimlik Doğrulama (KYC)",
    body: [
      "Satıcı olabilmek için başvuruda şu bilgi ve belgeler zorunludur:",
      "- T.C. kimlik numarası ve kimlik belgesi görselleri (ön/arka) ile doğrulama fotoğrafı (selfie),",
      "- Satıcının kendi adına açılmış banka hesabına ait IBAN,",
      "- İletişim bilgileri (telefon) ve mağaza/üretim yeri konumu (il/ilçe).",
      "Satıcı, verdiği tüm bilgilerin doğru ve güncel olduğunu taahhüt eder. Bilgilerin yanlış, eksik veya başkasına ait olduğu tespit edilirse başvuru reddedilir; onaylanmış hesap askıya alınır ve bekleyen ödemeler doğrulama tamamlanana kadar bekletilir.",
      "KYC kapsamında toplanan kişisel veriler yalnızca kimlik doğrulama, ödeme aktarımı ve yasal yükümlülükler için işlenir; ayrıntılar KVKK Aydınlatma Metni'nde açıklanmıştır.",
      "Başvurular Platform tarafından incelenir; Platform, gerekçesini bildirerek başvuruyu reddetme hakkını saklı tutar. Yardımlı kayıt (operatör aracılığıyla kayıt) durumunda da bu sözleşmenin kabulü şarttır ve kabul kaydı başvuruyla birlikte saklanır.",
    ],
  },
  {
    title: "Komisyon ve Ödeme (Escrow)",
    body: [
      "Platform, her tamamlanan satış üzerinden hizmet bedeli ve işlem bedelinden oluşan bir komisyon alır. Güncel komisyon oranı satıcı panelinde ilan edilir; oran değişiklikleri panelden duyurulur ve duyuruda belirtilen tarihten itibaren yeni siparişlere uygulanır.",
      "Ödeme akışı güvenli havuz (escrow) esasına dayanır:",
      "- Alıcının ödemesi önce Platform nezdindeki güvenli havuzda tutulur; Satıcıya hemen aktarılmaz.",
      "- Alıcı teslimatı onayladığında veya teslimden sonraki onay süresi sorunsuz dolduğunda, komisyon düşülerek net tutar Satıcının panel bakiyesine işlenir.",
      "- Bakiye, Satıcının KYC'de doğrulanmış IBAN'ına aktarılır. Güvenlik gereği yeni satıcılarda ilk ödemelere kısa bir bekleme süresi uygulanabilir.",
      "İade, iptal veya hakemlik kararıyla alıcıya dönen tutarlar Satıcı bakiyesinden mahsup edilir. Tüm para hareketleri kayıt altındadır ve satıcı panelinden şeffaf biçimde izlenebilir.",
    ],
  },
  {
    title: "Kargo ve Teslimat Yükümlülükleri",
    body: [
      "Siparişin kargolanması Satıcının sorumluluğundadır. Satıcı, siparişi makul sürede hazırlayıp göndermeyi kabul eder.",
      "- Kargo takip numarası girilmesi zorunludur; takip numarası girilmeden sipariş \"kargolandı\" durumuna alınamaz ve ödeme akışı ilerlemez.",
      "- Çabuk bozulabilen ürünlerde (süt ürünleri, taze gıda vb.) soğuk zincire uygun yalıtımlı ambalaj kullanılması zorunludur. Uygun ambalajlar Platform üzerinden temin edilebilir veya ilçe teslim noktasından alınabilir.",
      "- Gönderilemeyen veya makul süre içinde kargoya verilmeyen siparişler Platform tarafından iptal edilerek bedeli alıcıya iade edilebilir.",
      "Taşıma sırasında uygun olmayan ambalajdan kaynaklanan bozulma ve hasarların sorumluluğu Satıcıya aittir.",
    ],
  },
  {
    title: "Ürün Kuralları ve Moderasyon",
    body: [
      "Her ürün ilanı yayına alınmadan önce Platform moderasyonundan geçer. Satıcı, ilanlarında şu kurallara uyar:",
      "- Ürün adı, açıklaması, menşe/konum bilgisi ve görselleri gerçeği yansıtmalıdır; yanıltıcı menşe veya \"organik/doğal\" iddiası yasaktır.",
      "- Gıda güvenliği mevzuatına aykırı ürünler satılamaz: denetimsiz kesim et ve et ürünleri, açık (ambalajsız/etiketsiz) çiğ süt, sağlık beyanı ile satılan ürünler ve satışı izne tabi tüm ürünler yasaklıdır.",
      "- Satılan ürünün üreticisi/toplayıcısı bizzat Satıcı olmalı veya ürünün kaynağı açıkça belirtilmelidir; başka platformlardan alınıp yeniden satış (dropshipping) yasaktır.",
      "- Stok ve fiyat bilgisi güncel tutulmalıdır; stokta olmayan ürünün satışa açık bırakılması kuralın ihlalidir.",
      "Platform; kurallara aykırı ilanları yayından kaldırma, düzeltme isteme veya yayına almama hakkını saklı tutar.",
    ],
  },
  {
    title: "Kural İhlalleri ve Yaptırımlar",
    body: [
      "Aşağıdaki durumlarda Platform, ihlalin ağırlığına göre kademeli yaptırım uygular: uyarı → ilanların geçici kapatılması → mağazanın askıya alınması → hesabın kapatılması.",
      "- Sahte/yanıltıcı ilan, başkasına ait kimlik veya IBAN kullanımı,",
      "- Tekrarlayan kargo gecikmesi, takipsiz gönderim veya yüksek iade/şikâyet oranı,",
      "- Alıcıyı Platform dışına yönlendirerek satış yapma girişimi,",
      "- Moderasyon kararlarını aşmaya yönelik tekrarlı ihlaller.",
      "Askıya alınan mağazanın bekleyen bakiyesi, açık siparişler ve olası iadeler sonuçlanana kadar güvenli havuzda bekletilir; hak edilen tutarlar süreç tamamlandığında ödenir. Dolandırıcılık şüphesinde Platform, yasal mercilere bildirme hakkını saklı tutar.",
    ],
  },
  {
    title: "Vergi ve Yasal Sorumluluklar",
    body: [
      "Satış gelirlerine ilişkin vergi yükümlülükleri Satıcıya aittir. Satıcı; durumuna göre esnaf vergi muafiyeti belgesi almak, gerektiğinde fatura/gider pusulası düzenlemek ve ilgili mevzuata (vergi, gıda, etiketleme, tüketici hukuku) uymakla yükümlüdür.",
      "Platform, yasal zorunluluk hâlinde satış ve ödeme bilgilerini yetkili kamu kurumlarıyla paylaşabilir.",
      "Satıcı; ürünlerinden kaynaklanan tüketici taleplerinde (ayıplı mal, gıda güvenliği vb.) asıl sorumlunun kendisi olduğunu, Platformun aracı hizmet sağlayıcı sıfatını kabul eder.",
    ],
  },
  {
    title: "Sözleşme Değişiklikleri ve Fesih",
    body: [
      "Platform bu sözleşmeyi güncelleyebilir; önemli değişiklikler satıcı panelinden ve/veya e-posta ile duyurulur. Değişiklik sonrası satışa devam edilmesi, güncel sözleşmenin kabulü anlamına gelir.",
      "Satıcı, açık siparişlerini tamamlamak kaydıyla dilediği zaman mağazasını kapatabilir. Kapanışta bekleyen bakiye, açık sipariş ve iade süreçleri sonuçlandıktan sonra ödenir.",
      "Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır.",
    ],
  },
];

export default function VendorTermsPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="Satıcı Sözleşmesi ve Satış Politikası"
      intro="Golden Oremar'da üretici olarak satış yapmanın şartları: kimlik doğrulama, komisyon ve escrow ödeme, kargo yükümlülükleri ve ürün kuralları."
      updatedAt="2 Temmuz 2026"
      sections={sections}
    />
  );
}
