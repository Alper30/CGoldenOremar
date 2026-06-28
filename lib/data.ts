import type { Category, Producer, Product, Review } from "./types";

/**
 * Front-end veri katmanı (backend bir sonraki faz).
 * Ürün/kategori/üretici studio görselleri public/images altında (yerel).
 * Üretici portreleri Unsplash (placeholder).
 */
const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;

export const categories: Category[] = [
  {
    slug: "bal",
    name: "Bal",
    description: "Karakovan, çiçek balı, petek.",
    image: "/images/cat-honey.png",
    productCount: 142,
  },
  {
    slug: "sut-urunleri",
    name: "Süt Ürünleri",
    description: "Tulum peyniri, tereyağı, çökelek.",
    image: "/images/cat-dairy.png",
    productCount: 98,
  },
  {
    slug: "zeytin-zeytinyagi",
    name: "Zeytin & Zeytinyağı",
    description: "Erken hasat sızma, sele zeytin.",
    image: "/images/cat-olive.png",
    productCount: 167,
  },
  {
    slug: "yumurta",
    name: "Yumurta",
    description: "Gezen tavuk, organik köy yumurtası.",
    image: "/images/cat-eggs.png",
    productCount: 54,
  },
  {
    slug: "recel-pekmez",
    name: "Reçel & Pekmez",
    description: "Kuşburnu reçeli, dut pekmezi.",
    image: "/images/cat-jam.png",
    productCount: 89,
  },
  {
    slug: "yore-lezzetleri",
    name: "Yöre Lezzetleri",
    description: "Ceviz, kuru domates, yöresel tatlar.",
    image: "/images/cat-regional.png",
    productCount: 211,
  },
];

export const producers: Producer[] = [
  {
    slug: "karadeniz-aricilik",
    name: "Karadeniz Arıcılık",
    person: "Yusuf Karadeniz",
    avatar: portrait("1500648767791-00dcc994a43e"),
    cover: "/images/producer-1.png",
    location: "Maçka, Trabzon",
    verified: true,
    memberSince: "2022",
    story:
      "Üç kuşaktır yaylada karakovan balı üretiyoruz. Arılarımızı yüksek rakımlı çiçek bahçelerinde, hiçbir katkı kullanmadan besliyoruz. Her kavanozun arkasında bir mevsimlik emek var.",
    unitsSold: 3340,
    positivePct: 99,
    rating: 4.9,
    reviewCount: 1340,
    productCount: 18,
    badges: ["Karakovan", "Gezginci Arı", "Lab Analizli"],
  },
  {
    slug: "merez-hatun",
    name: "Merez Hatun'un Sofrası",
    person: "Merez Aydın",
    avatar: portrait("1544005313-94ddf0286df2"),
    cover: "/images/cat-dairy.png",
    location: "Yüksekova, Hakkâri",
    verified: true,
    memberSince: "2024",
    story:
      "Otuz yıldır Oremar yaylasında süt sağıyor, kendi ellerimle peynir ve tereyağı yapıyorum. Hayvanlarım yazın yüksek otlaklarda otluyor; bu yüzden sütümüz kokulu, peynirim bambaşka olur.",
    unitsSold: 1240,
    positivePct: 99,
    rating: 4.9,
    reviewCount: 213,
    productCount: 9,
    badges: ["Otlak Peyniri", "El Yapımı", "Kadın Üretici"],
  },
  {
    slug: "ege-zeytin",
    name: "Ege Zeytin Bahçeleri",
    person: "Ayşe Ege",
    avatar: portrait("1573497019940-1c28c88b4f3e"),
    cover: "/images/producer-3.png",
    location: "Ayvalık, Balıkesir",
    verified: true,
    memberSince: "2021",
    story:
      "Aile bahçelerimizde yetişen zeytinleri erken hasatta soğuk sıkım ile işliyoruz. Topraktan şişeye kadar tüm süreç bizde; bu yüzden her damla kendi emeğimiz.",
    unitsSold: 2890,
    positivePct: 98,
    rating: 4.9,
    reviewCount: 1025,
    productCount: 24,
    badges: ["Erken Hasat", "Soğuk Sıkım", "Organik"],
  },
  {
    slug: "bereket-ciftligi",
    name: "Bereket Çiftliği",
    person: "Hasan Bereket",
    avatar: portrait("1568602471122-7832951cc4c5"),
    cover: "/images/cat-eggs.png",
    location: "Mengen, Bolu",
    verified: true,
    memberSince: "2023",
    story:
      "Tavuklarımız gün boyu açık alanda gezer, doğal yemle beslenir. Yumurtalarımızı her sabah elle toplar, aynı gün kargoya veririz.",
    unitsSold: 4120,
    positivePct: 98,
    rating: 4.9,
    reviewCount: 412,
    productCount: 6,
    badges: ["Gezen Tavuk", "Günlük Toplama"],
  },
  {
    slug: "anadolu-bahcem",
    name: "Anadolu Bahçem",
    person: "Fatma Demir",
    avatar: portrait("1607746882042-944635dfe10e"),
    cover: "/images/cat-jam.png",
    location: "Gümüşhane Merkez",
    verified: true,
    memberSince: "2024",
    story:
      "Bahçemizin meyvelerinden, bakır kazanda, şeker katmadan reçel ve pekmez yapıyorum. Annemden öğrendiğim tarifleri olduğu gibi sürdürüyorum.",
    unitsSold: 870,
    positivePct: 97,
    rating: 4.7,
    reviewCount: 134,
    productCount: 11,
    badges: ["Katkısız", "Bakır Kazan", "Ev Yapımı"],
  },
  {
    slug: "yayla-kuruyemis",
    name: "Yayla Kuruyemiş",
    person: "Baran Çelik",
    avatar: portrait("1531123897727-8f129e1688ce"),
    cover: "/images/cat-regional.png",
    location: "Kahramanmaraş Merkez",
    verified: false,
    memberSince: "2026",
    story:
      "Köyümüzün asırlık ceviz ağaçlarından elle toplar, güneşte kuruturuz. Doğrulama belgelerimi yüklüyorum; çok yakında onaylı üretici olacağım.",
    unitsSold: 320,
    positivePct: 96,
    rating: 4.7,
    reviewCount: 143,
    productCount: 7,
    badges: ["Yeni Mahsul", "Elle Toplandı"],
  },
];

export const products: Product[] = [
  // --- Bal ---
  {
    slug: "karakovan-cam-bali",
    name: "Karakovan Çam Balı 850 g",
    category: "bal",
    price: 489.9,
    oldPrice: 549.9,
    unit: "850 g cam kavanoz",
    image: "/images/prod-honey.png",
    gallery: ["/images/prod-honey.png", "/images/cat-honey.png"],
    region: "Trabzon",
    producer: "karadeniz-aricilik",
    rating: 4.9,
    reviewCount: 326,
    badge: "Katkısız",
    tags: ["Lab Analizli", "Yüksek Rakım"],
    description:
      "Karadeniz'in yüksek yaylalarındaki çam ormanlarından, geleneksel karakovan yöntemiyle alınan koyu, yoğun çam balı. Şeker veya glikoz katkısı yoktur; her partinin analizi paylaşılır.",
    reviews: [
      { author: "Elif Yıldırım", location: "İstanbul", rating: 5, date: "Mayıs 2026", text: "Balın tadı tam çocukluğumdaki gibi. Üreticinin hikâyesini okumak ve kimin ürettiğini bilmek çok güven veriyor." },
      { author: "Mehmet T.", location: "Ankara", rating: 5, date: "Nisan 2026", text: "Kıvamı ve aroması bambaşka. Kargo takibi sorunsuzdu." },
    ],
  },
  {
    slug: "suzme-cicek-bali",
    name: "Yüksek Yayla Süzme Çiçek Balı 850 g",
    category: "bal",
    price: 439.0,
    unit: "850 g cam kavanoz",
    image: "/images/prod-honey.png",
    region: "Trabzon",
    producer: "karadeniz-aricilik",
    rating: 4.8,
    reviewCount: 174,
    badge: "Doğal",
    tags: ["Süzme", "Yüksek Rakım"],
    description:
      "Yüksek rakımlı çiçeklerden süzme çiçek balı. Akışkan, berrak ve aromatik.",
  },
  // --- Süt Ürünleri ---
  {
    slug: "koy-tulum-peyniri",
    name: "Tam Yağlı Köy Tulum Peyniri 500 g",
    category: "sut-urunleri",
    price: 264.5,
    unit: "500 g",
    image: "/images/prod-cheese.png",
    gallery: ["/images/prod-cheese.png", "/images/cat-dairy.png"],
    region: "Yüksekova",
    producer: "merez-hatun",
    rating: 4.7,
    reviewCount: 188,
    badge: "Doğal",
    tags: ["Otlak Sütü", "Soğuk Zincir"],
    coldChain: true,
    description:
      "Yaz boyunca yüksek otlaklarda otlayan hayvanların sütünden, geleneksel yöntemle olgunlaştırılmış tam yağlı tulum peyniri. Tuz dengesi elle ayarlanır.",
    reviews: [
      { author: "Zeynep Kaya", location: "İzmir", rating: 5, date: "Mart 2026", text: "Peynir çok lezzetli ve doğal. Güvenli ödeme sayesinde içim rahat alışveriş yaptım." },
    ],
  },
  {
    slug: "koy-tereyagi",
    name: "Yayla Tereyağı 500 g",
    category: "sut-urunleri",
    price: 359.0,
    oldPrice: 399.0,
    unit: "500 g",
    image: "/images/prod-butter.png",
    region: "Yüksekova",
    producer: "merez-hatun",
    rating: 4.9,
    reviewCount: 88,
    badge: "Katkısız",
    tags: ["El Yapımı", "Soğuk Zincir"],
    coldChain: true,
    description:
      "Yayıkta çalkalanmış, sarı, kokulu köy tereyağı. Kahvaltıya ve hamur işine birebir.",
  },
  // --- Zeytin & Zeytinyağı ---
  {
    slug: "sizma-zeytinyagi",
    name: "Erken Hasat Sızma Zeytinyağı 1 L",
    category: "zeytin-zeytinyagi",
    price: 379.0,
    unit: "1 L cam şişe",
    image: "/images/prod-oil.png",
    gallery: ["/images/prod-oil.png", "/images/cat-olive.png"],
    region: "Ayvalık",
    producer: "ege-zeytin",
    rating: 4.8,
    reviewCount: 254,
    badge: "Organik",
    tags: ["Soğuk Sıkım", "Düşük Asit"],
    description:
      "Aile bahçelerinde erken hasatta toplanan zeytinlerin soğuk sıkımıyla elde edilen, yoğun aromalı sızma zeytinyağı.",
    reviews: [
      { author: "Mehmet Demir", location: "Ankara", rating: 5, date: "Nisan 2026", text: "Zeytinyağı gerçekten erken hasat, kokusu muhteşem. İki günde elime ulaştı." },
    ],
  },
  {
    slug: "sele-zeytin",
    name: "Salamura Sele Zeytin 1 kg",
    category: "zeytin-zeytinyagi",
    price: 219.0,
    unit: "1 kg",
    image: "/images/cat-olive.png",
    region: "Ayvalık",
    producer: "ege-zeytin",
    rating: 4.7,
    reviewCount: 96,
    badge: "Doğal",
    tags: ["Doğal Salamura", "Az Tuzlu"],
    description:
      "Geleneksel yöntemle salamura edilmiş, etli ve aromatik sele zeytin.",
  },
  // --- Yumurta ---
  {
    slug: "gezen-tavuk-yumurtasi",
    name: "Gezen Tavuk Köy Yumurtası 30 Adet",
    category: "yumurta",
    price: 159.9,
    oldPrice: 179.9,
    unit: "30 adet",
    image: "/images/prod-eggs.png",
    gallery: ["/images/prod-eggs.png", "/images/cat-eggs.png"],
    region: "Bolu",
    producer: "bereket-ciftligi",
    rating: 4.9,
    reviewCount: 412,
    badge: "Katkısız",
    tags: ["Gezen Tavuk", "Günlük"],
    description:
      "Açık alanda gezen, doğal yemle beslenen tavukların yumurtaları. Her sabah elle toplanır, aynı gün gönderilir.",
  },
  {
    slug: "organik-koy-yumurtasi",
    name: "Organik Köy Yumurtası 15 Adet",
    category: "yumurta",
    price: 94.9,
    unit: "15 adet",
    image: "/images/prod-eggs.png",
    region: "Bolu",
    producer: "bereket-ciftligi",
    rating: 4.8,
    reviewCount: 137,
    badge: "Organik",
    tags: ["Organik Sertifikalı"],
    description: "Organik sertifikalı yemle beslenen tavuklardan, daha küçük paket.",
  },
  // --- Reçel & Pekmez ---
  {
    slug: "kusburnu-receli",
    name: "Ev Yapımı Kuşburnu Reçeli 380 g",
    category: "recel-pekmez",
    price: 124.0,
    unit: "380 g",
    image: "/images/prod-jam.png",
    gallery: ["/images/prod-jam.png", "/images/cat-jam.png"],
    region: "Gümüşhane",
    producer: "anadolu-bahcem",
    rating: 4.6,
    reviewCount: 97,
    badge: "Şeker İlavesiz",
    tags: ["Ev Yapımı", "Bakır Kazan"],
    description:
      "Dağ kuşburnundan, şeker eklenmeden, bakır kazanda kaynatılarak yapılan yoğun reçel.",
  },
  {
    slug: "dut-pekmezi",
    name: "Geleneksel Dut Pekmezi 600 g",
    category: "recel-pekmez",
    price: 149.5,
    oldPrice: 169.5,
    unit: "600 g",
    image: "/images/prod-molasses.png",
    region: "Malatya",
    producer: "anadolu-bahcem",
    rating: 4.7,
    reviewCount: 121,
    badge: "Katkısız",
    tags: ["Şeker İlavesiz", "Odun Ateşi"],
    description:
      "Beyaz duttan, odun ateşinde, katkısız kaynatılan geleneksel dut pekmezi.",
  },
  // --- Yöre Lezzetleri ---
  {
    slug: "taspaski-ceviz-ici",
    name: "Taş Baskı Ceviz İçi 500 g",
    category: "yore-lezzetleri",
    price: 219.9,
    unit: "500 g iç",
    image: "/images/prod-walnut.png",
    gallery: ["/images/prod-walnut.png", "/images/cat-regional.png"],
    region: "Kahramanmaraş",
    producer: "yayla-kuruyemis",
    rating: 4.8,
    reviewCount: 143,
    badge: "Doğal",
    tags: ["Yeni Mahsul", "Elle Toplandı"],
    description:
      "Asırlık ağaçlardan bu yıl toplanan, güneşte kurutulup elle çıtlatılan iç ceviz. Yağı bol, içi taze.",
  },
  {
    slug: "gunes-kurusu-domates",
    name: "Güneş Kurusu Domates 400 g",
    category: "yore-lezzetleri",
    price: 134.9,
    unit: "400 g",
    image: "/images/prod-tomato.png",
    region: "Manisa",
    producer: "ege-zeytin",
    rating: 4.5,
    reviewCount: 76,
    badge: "Organik",
    tags: ["Güneşte Kurutuldu", "Katkısız"],
    description:
      "Ege güneşinde kurutulan, yoğun aromalı kuru domates. Zeytinyağıyla kavanoza birebir.",
  },
];

export const reviews: Review[] = [
  {
    author: "Elif Yıldırım",
    location: "İstanbul",
    rating: 5,
    product: "Karakovan Çam Balı",
    date: "Mayıs 2026",
    text: "Balın tadı tam çocukluğumdaki gibi. Üreticinin hikâyesini okumak ve kimin ürettiğini bilmek çok güven veriyor.",
  },
  {
    author: "Mehmet Demir",
    location: "Ankara",
    rating: 5,
    product: "Sızma Zeytinyağı",
    date: "Nisan 2026",
    text: "Zeytinyağı gerçekten erken hasat, kokusu muhteşem. Kargo takibi sorunsuzdu, iki günde elime ulaştı.",
  },
  {
    author: "Zeynep Kaya",
    location: "İzmir",
    rating: 4,
    product: "Köy Tulum Peyniri",
    date: "Mart 2026",
    text: "Peynir çok lezzetli ve doğal. Güvenli ödeme sayesinde içim rahat alışveriş yaptım, kesinlikle tavsiye ederim.",
  },
];

// --- Yardımcılar ---
export const getProducer = (slug: string) =>
  producers.find((p) => p.slug === slug);

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const productsByProducer = (slug: string) =>
  products.filter((p) => p.producer === slug);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const featuredProducts = () =>
  products.filter((p) =>
    [
      "karakovan-cam-bali",
      "sizma-zeytinyagi",
      "koy-tulum-peyniri",
      "gezen-tavuk-yumurtasi",
      "kusburnu-receli",
      "taspaski-ceviz-ici",
      "koy-tereyagi",
      "dut-pekmezi",
    ].includes(p.slug),
  );

export const fmtPrice = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
