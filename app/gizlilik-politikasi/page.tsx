import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Gizlilik Politikası — Golden Oremar",
  description:
    "Golden Oremar gizlilik politikası: hesap verileriniz, çerezler, ödeme güvenliği ve verilerinizin korunma yöntemleri.",
};

const sections: LegalSection[] = [
  {
    title: "Genel İlkeler",
    body: [
      "Golden Oremar, kimliği doğrulanmış üreticilerle alıcıları buluşturan bir doğal ürün pazaryeridir. Gizliliğiniz, platformun kurucu değeri olan güvenin ayrılmaz parçasıdır: verilerinizi yalnızca hizmeti sunmak için gereken en az kapsamda toplar, asla satmayız.",
      "Bu politika, kişisel verilerin işlenmesine dair KVKK Aydınlatma Metni ile birlikte okunmalıdır.",
    ],
  },
  {
    title: "Hesap ve Sipariş Verileri",
    body: [
      "Üyelik sırasında ad-soyad, e-posta ve isteğe bağlı telefon bilgisi alınır. Sipariş verirken teslimat adresiniz kaydedilir ve yalnızca siparişin ulaştırılması amacıyla ilgili satıcı ve kargo firmasıyla paylaşılır.",
      "Satıcı olmak isteyen kullanıcılardan kimlik doğrulama (KYC) kapsamında ek belgeler istenir; bu belgeler şifreli olarak saklanır ve yalnızca doğrulama yetkisi olan yöneticiler tarafından görüntülenebilir.",
    ],
  },
  {
    title: "Ödeme Güvenliği",
    body: [
      "Kart bilgileriniz platform sunucularında saklanmaz ve platform çalışanları tarafından görülemez. Ödemeler, PCI-DSS sertifikalı lisanslı ödeme kuruluşlarının güvenli altyapısında, 3D Secure doğrulamasıyla gerçekleştirilir.",
      "Ödemeniz, sipariş teslim edilip onay süresi tamamlanana kadar güvenli havuz hesabında (emanet/escrow) tutulur; satıcıya aktarım ancak bundan sonra yapılır. Bu mekanizma hem alıcıyı hem üreticiyi korur.",
    ],
  },
  {
    title: "Çerezler ve Yerel Depolama",
    body: [
      "Platform, oturumunuzu sürdürmek (kimlik doğrulama) ve tercihlerinizi hatırlamak (dil seçimi, sepet, favoriler) için zorunlu çerezler ve tarayıcı yerel depolaması kullanır.",
      "Üçüncü taraf reklam veya izleme çerezi kullanılmamaktadır. Analitik amaçlı bir araç eklenirse bu politika güncellenir ve gerekli hâllerde onayınız istenir.",
      "Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz; ancak zorunlu çerezler engellendiğinde giriş ve sepet gibi temel işlevler çalışmayabilir.",
    ],
  },
  {
    title: "Verilerin Korunması",
    body: [
      "Veriler, satır düzeyinde erişim kontrolü (RLS) uygulanan, şifreli bağlantı (TLS) ile erişilen bir veri tabanında saklanır. Her kullanıcı yalnızca kendi verilerine erişebilir; satıcılar yalnızca kendi sipariş ve ürünlerini görür.",
      "Yönetici işlemleri kayıt altına alınır. Şüpheli erişim tespitinde ilgili hesaplar güvenlik incelemesine alınır.",
    ],
  },
  {
    title: "Üçüncü Taraf Bağlantıları",
    body: [
      "Platformda satıcı hikâyeleri veya destek kanalları (örn. WhatsApp) gibi üçüncü taraf hizmetlere bağlantılar bulunabilir. Bu hizmetlerin gizlilik uygulamalarından ilgili sağlayıcılar sorumludur.",
    ],
  },
  {
    title: "Çocukların Gizliliği",
    body: [
      "Platform 18 yaşın altındaki kullanıcılara yönelik değildir. 18 yaş altı bir kullanıcıya ait veri işlendiğini fark edersek makul süre içinde sileriz.",
    ],
  },
  {
    title: "Değişiklikler",
    body: [
      "Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler sitede duyurulur; güncel sürüm her zaman bu sayfada yayımlanır.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="Gizlilik Politikası"
      intro="Verilerinizi nasıl koruduğumuz, çerez kullanımımız ve ödeme güvenliği hakkında açık bilgilendirme."
      updatedAt="2 Temmuz 2026"
      sections={sections}
    />
  );
}
