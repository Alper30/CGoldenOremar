import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "KVKK Aydınlatma Metni — Golden Oremar",
  description:
    "Golden Oremar'ın 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki aydınlatma metni: hangi verileri, hangi amaçla ve nasıl işlediğimiz.",
};

const sections: LegalSection[] = [
  {
    title: "Veri Sorumlusu",
    body: [
      "Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca, Golden Oremar platformunu işleten veri sorumlusu (\"Platform\") tarafından hazırlanmıştır. Platform, üreticiler (satıcılar) ile alıcıları buluşturan bir aracı hizmet sağlayıcıdır.",
      "Satıcıların kendi mağaza faaliyetleri kapsamında işledikleri kişisel veriler bakımından ilgili satıcı ayrıca veri sorumlusu sıfatı taşıyabilir.",
    ],
  },
  {
    title: "İşlenen Kişisel Veriler",
    body: [
      "Platformu kullanımınıza bağlı olarak aşağıdaki veri kategorileri işlenir:",
      "- Kimlik ve iletişim bilgileri: ad-soyad, e-posta, telefon (üyelik ve sipariş süreçleri).",
      "- Teslimat bilgileri: adres, il/ilçe (siparişin ulaştırılması).",
      "- Satıcı adayları için KYC (kimlik doğrulama) verileri: T.C. kimlik numarası, IBAN, kimlik belgesi görüntüsü ve doğrulama fotoğrafı (selfie). Bu veriler yalnızca satıcı doğrulaması ve ödeme (hak ediş) aktarımı amacıyla işlenir.",
      "- Sipariş ve işlem bilgileri: sipariş içeriği, tutar, sipariş durumu, iade/itiraz kayıtları.",
      "- İşlem güvenliği verileri: IP adresi, oturum kayıtları, log kayıtları.",
      "Kredi kartı bilgileriniz Platform tarafından saklanmaz; ödeme, lisanslı ödeme kuruluşlarının güvenli altyapısı üzerinden gerçekleştirilir.",
    ],
  },
  {
    title: "İşleme Amaçları ve Hukuki Sebepler",
    body: [
      "Kişisel verileriniz KVKK m.5'te sayılan hukuki sebeplere dayanılarak şu amaçlarla işlenir:",
      "- Üyelik sözleşmesinin kurulması ve ifası (m.5/2-c): hesap oluşturma, sipariş, teslimat, iade.",
      "- Hukuki yükümlülüklerin yerine getirilmesi (m.5/2-ç): fatura düzenleme, mevzuat gereği saklama, resmî makam talepleri.",
      "- Meşru menfaat (m.5/2-f): platform güvenliği, sahtekârlığın önlenmesi, satıcı güven skoru ve değerlendirme sisteminin işletilmesi.",
      "- Açık rıza (m.5/1): pazarlama iletileri ve bülten gönderimi yalnızca açık rızanıza bağlıdır; dilediğinizde geri alabilirsiniz.",
    ],
  },
  {
    title: "Verilerin Aktarılması",
    body: [
      "Kişisel verileriniz, yalnızca hizmetin gerektirdiği ölçüde şu taraflara aktarılabilir:",
      "- Siparişinizin teslimi için kargo/lojistik firmalarına (ad, adres, telefon).",
      "- Ödemenin gerçekleştirilmesi için lisanslı ödeme kuruluşlarına.",
      "- Siparişi hazırlaması için ilgili satıcıya (yalnızca teslimata gerekli bilgiler).",
      "- Barındırma ve veri tabanı hizmeti aldığımız altyapı sağlayıcılarına (veriler sözleşmesel güvencelerle korunur).",
      "- Kanunen yetkili kamu kurumlarına, talep hâlinde ve mevzuat çerçevesinde.",
    ],
  },
  {
    title: "Saklama Süreleri",
    body: [
      "Veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen asgari saklama süreleri (örn. 6563 sayılı kanun ve vergi mevzuatı uyarınca işlem kayıtları) boyunca saklanır; sürelerin sonunda silinir, yok edilir veya anonim hâle getirilir.",
      "Üyeliğinizi sonlandırdığınızda, yasal saklama yükümlülüğü bulunmayan verileriniz makul süre içinde silinir.",
    ],
  },
  {
    title: "KVKK m.11 Kapsamındaki Haklarınız",
    body: [
      "Veri sahibi olarak dilediğiniz zaman şu haklara sahipsiniz:",
      "- Verilerinizin işlenip işlenmediğini öğrenme ve bilgi talep etme.",
      "- İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.",
      "- Yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme.",
      "- Eksik veya yanlış işlenmişse düzeltilmesini isteme.",
      "- KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme.",
      "- İşlemenin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme.",
      "- Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.",
      "Başvurularınızı İletişim sayfamızdaki kanallardan yazılı olarak iletebilirsiniz; talebiniz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.",
    ],
  },
];

export default function KvkkPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="KVKK Aydınlatma Metni"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hangi verilerinizi, hangi amaçla ve nasıl işlediğimize dair bilgilendirme."
      updatedAt="2 Temmuz 2026"
      sections={sections}
    />
  );
}
