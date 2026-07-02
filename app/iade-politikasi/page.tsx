import { LegalPage, type LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "İade ve Cayma Politikası — Golden Oremar",
  description:
    "Golden Oremar iade politikası: 14 gün cayma hakkı, bozulabilir gıda istisnaları, hasarlı ürün süreci ve güvenli havuz (escrow) ile geri ödeme.",
};

const sections: LegalSection[] = [
  {
    title: "Özet",
    body: [
      "Teslimattan itibaren 14 gün içinde cayma hakkınız vardır; çabuk bozulabilen gıdalar bu hakkın yasal istisnasıdır. Hasarlı, bozuk veya siparişe aykırı ürünlerde ise her durumda ücretsiz iade/değişim hakkınız saklıdır.",
      "Ödemeniz teslim onayına kadar güvenli havuzda (escrow) tutulduğundan, haklı iade taleplerinde geri ödeme beklemeden yapılır.",
    ],
  },
  {
    title: "14 Gün Cayma Hakkı",
    body: [
      "Raf ömrü uzun ürünlerde (bal, zeytinyağı, reçel, pekmez, kuruyemiş, ambalajı açılmamış ürünler) teslim tarihinden itibaren 14 gün içinde gerekçe göstermeksizin cayabilirsiniz.",
      "Cayma bildirimini hesabınızdaki ilgili siparişin detay sayfasından veya İletişim kanallarımızdan yapabilirsiniz.",
      "İade edilecek ürünün kullanılmamış ve yeniden satılabilir durumda olması gerekir.",
    ],
  },
  {
    title: "Cayma Hakkının İstisnaları",
    body: [
      "Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca aşağıdaki ürünlerde cayma hakkı kullanılamaz:",
      "- Çabuk bozulabilen gıdalar: taze süt ürünleri (peynir, tereyağı, çökelek), taze yumurta, taze sebze-meyve.",
      "- Ambalajı açıldıktan sonra sağlık ve hijyen açısından iadeye uygun olmayan ürünler.",
      "Bu istisnalar yalnızca \"fikir değiştirme\" kaynaklı iadeler içindir — ürün kusurluysa bir sonraki bölümdeki süreç her ürün için geçerlidir.",
    ],
  },
  {
    title: "Hasarlı / Ayıplı Ürün",
    body: [
      "Ürün elinize hasarlı, bozulmuş, eksik veya ilandaki niteliklere aykırı ulaştıysa:",
      "- Teslimattan itibaren en geç 48 saat içinde sipariş detayındaki \"Sorun bildir\" adımından veya İletişim kanallarından bize ulaşın.",
      "- Ürünün ve ambalajın fotoğrafını ekleyin; soğuk zincir ürünlerinde ambalajın açılış hâli önemlidir.",
      "- Talebiniz platform hakemliğinde incelenir; haklı bulunursa ücret iadesi veya yeniden gönderim seçeneği sunulur. İade kargo bedeli alıcıya yansıtılmaz.",
    ],
  },
  {
    title: "İade Süreci Adım Adım",
    body: [
      "1. Talep: Sipariş detayından veya İletişim kanallarından iade/cayma talebinizi iletin.",
      "2. Onay: Talebiniz istisna kapsamında değilse iade kodu ve gönderim yönergesi paylaşılır.",
      "3. Gönderim: Ürünü, mümkünse orijinal ambalajıyla, yönergedeki kargo firmasına teslim edin.",
      "4. Kontrol: Ürün satıcıya ulaştığında durumu kontrol edilir.",
      "5. Geri ödeme: Onaylanan iadelerde bedel, ödemenin yapıldığı karta en geç 14 gün içinde iade edilir (bankanıza yansıması 2-10 iş günü sürebilir).",
    ],
  },
  {
    title: "Anlaşmazlık Durumunda Platform Hakemliği",
    body: [
      "Alıcı ve satıcının uzlaşamadığı durumlarda platform; sipariş kayıtları, kargo takip verileri ve taraflarca sunulan kanıtlar üzerinden bağlayıcı bir değerlendirme yapar. Ödeme güvenli havuzda tutulduğu için karar, para satıcıya aktarılmadan uygulanabilir.",
      "Bu süreç, yasal haklarınızı (Tüketici Hakem Heyeti / Tüketici Mahkemesi) kullanmanıza engel değildir.",
    ],
  },
];

export default function ReturnsPage() {
  return (
    <LegalPage
      eyebrow="Yasal"
      title="İade ve Cayma Politikası"
      intro="Hangi ürünlerde 14 gün cayma hakkınız var, bozulabilir gıdalarda süreç nasıl işler, hasarlı üründe ne yapmalısınız — hepsi burada."
      updatedAt="2 Temmuz 2026"
      sections={sections}
    />
  );
}
