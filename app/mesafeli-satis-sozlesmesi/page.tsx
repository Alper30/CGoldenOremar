import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi — Golden Oremar",
  description:
    "Golden Oremar pazaryerinde verilen siparişler için geçerli mesafeli satış sözleşmesi: taraflar, teslimat, ödeme, cayma hakkı ve uyuşmazlık çözümü.",
};

const sections: LegalSection[] = [
  {
    title: "Taraflar ve Platformun Rolü",
    body: [
      "Bu sözleşme, Golden Oremar platformu üzerinden sipariş veren ALICI ile siparişe konu ürünü satışa sunan SATICI (kimliği doğrulanmış üretici) arasında kurulur.",
      "Golden Oremar, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun kapsamında \"aracı hizmet sağlayıcı\"dır: satış sözleşmesinin tarafı değildir; satıcı ile alıcıyı buluşturur, ödemenin güvenli havuz (emanet/escrow) üzerinden gerçekleşmesini ve sipariş sürecinin takibini sağlar.",
      "Her siparişte satıcının mağaza adı ve konumu sipariş özetinde ve ürün sayfasında açıkça gösterilir.",
    ],
  },
  {
    title: "Sözleşmenin Konusu",
    body: [
      "Sözleşmenin konusu, alıcının platform üzerinden elektronik ortamda sipariş verdiği, nitelikleri ve satış fiyatı ürün sayfasında belirtilen ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.",
    ],
  },
  {
    title: "Ürün, Fiyat ve Ödeme",
    body: [
      "Ürünlerin temel nitelikleri, birim fiyatı (KDV dâhil, ₺), kargo bedeli ve toplam tutar sipariş onayından önce alıcıya açıkça gösterilir.",
      "Ödeme, lisanslı ödeme kuruluşları aracılığıyla kredi/banka kartı ile alınır. Ödenen tutar, teslimat tamamlanıp onay süresi dolana kadar güvenli havuz hesabında tutulur; satıcıya aktarım bu süreçten sonra yapılır.",
      "Platformda gösterilen sepet tutarı ile tahsil edilen tutarın eşleşmesi sunucu tarafında doğrulanır.",
    ],
  },
  {
    title: "Teslimat",
    body: [
      "Ürünler, satıcı tarafından kargo takip numarası girilerek kargoya verilir; takip numarası girilmeden sipariş \"kargolandı\" durumuna geçemez. Alıcı, siparişini hesabından ve Sipariş Takip sayfasından anlık izleyebilir.",
      "Teslimat süresi, satıcının hazırlama süresi ile kargo firmasının taşıma süresine bağlı olarak değişir ve her hâlükârda yasal azami süre olan 30 günü aşamaz.",
      "Bozulabilir ürünler (süt ürünleri, tereyağı vb.) soğuk zincir kurallarına uygun yalıtımlı ambalajla gönderilir.",
      "Alıcının adresinde bulunmaması veya hatalı adres bildirmesi nedeniyle teslim edilemeyen siparişlerde doğan ek masraflar alıcıya aittir.",
    ],
  },
  {
    title: "Cayma Hakkı",
    body: [
      "Alıcı, Mesafeli Sözleşmeler Yönetmeliği uyarınca, teslim tarihinden itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin cayma hakkına sahiptir. Cayma bildirimi hesabınızdaki sipariş detayından veya İletişim kanallarından yapılabilir.",
      "Ancak Yönetmelik m.15 uyarınca aşağıdaki ürünlerde cayma hakkı KULLANILAMAZ:",
      "- Çabuk bozulabilen veya son kullanma tarihi geçebilecek gıda ürünleri (taze süt ürünleri, taze sebze-meyve vb.) (m.15/1-c).",
      "- Ambalajı açılmış olup sağlık ve hijyen açısından iadeye uygun olmayan ürünler (m.15/1-e).",
      "Cayma hakkının kullanılamadığı ürünlerde dahi, ürünün hasarlı, bozuk veya siparişe aykırı (ayıplı) çıkması hâlinde alıcının yasal hakları saklıdır; bu durumda İade Politikası'ndaki süreç işletilir.",
    ],
  },
  {
    title: "İade ve Geri Ödeme",
    body: [
      "Cayma hakkının usulüne uygun kullanılması veya ürünün ayıplı çıkması hâlinde, ürün bedeli ve varsa teslimat masrafları, ürünün satıcıya ulaşmasını takiben 14 gün içinde, ödemenin yapıldığı yöntemle iade edilir.",
      "Ödeme güvenli havuzda tutulduğundan, satıcıya aktarım yapılmadan çözülen anlaşmazlıklarda geri ödeme gecikmesiz gerçekleştirilir.",
      "Alıcı ile satıcı arasında anlaşmazlık doğması hâlinde platform, sipariş ve kargo kayıtları üzerinden hakem rolü üstlenir ve tarafları bağlayan karar sürecini işletir.",
    ],
  },
  {
    title: "Satıcının Yükümlülükleri",
    body: [
      "Satıcı; ürünün ilanda belirtilen niteliklere uygun, gıda güvenliği kurallarına uygun şekilde hazırlanmış ve ambalajlanmış olmasından, yasal fatura/belge düzenlenmesinden ve teslim yükümlülüğünden sorumludur.",
      "Satıcılar platforma kimlik doğrulamasından (KYC) geçerek kabul edilir; kimliği doğrulanmamış satıcı satış yapamaz ve hak edişi aktarılmaz.",
    ],
  },
  {
    title: "Uyuşmazlık Çözümü",
    body: [
      "Bu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı'nca ilan edilen parasal sınırlar dâhilinde alıcının yerleşim yerindeki Tüketici Hakem Heyetleri, sınırı aşan durumlarda Tüketici Mahkemeleri yetkilidir.",
      "Alıcı, şikâyet ve itirazlarını öncelikle platformun destek kanalları üzerinden iletebilir; platform çözüm sürecinde taraflara yardımcı olur.",
    ],
  },
  {
    title: "Yürürlük",
    body: [
      "Alıcı, sipariş onayı öncesinde bu sözleşmeyi ve ön bilgilendirmeyi okuduğunu ve kabul ettiğini elektronik ortamda teyit eder. Sipariş tarihinde yürürlükteki sürüm uygulanır.",
    ],
  },
];

export default function DistanceSalesPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="Mesafeli Satış Sözleşmesi"
      intro="Platform üzerinden verilen siparişlerde geçerli sözleşme koşulları: taraflar, teslimat, ödeme, cayma hakkı ve uyuşmazlık çözümü."
      updatedAt="2 Temmuz 2026"
      sections={sections}
    />
  );
}
