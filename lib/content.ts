// İçerik bölümü verisi — müşteri deposundan (bilgideposu) taşınan
// sağlık rehberleri, tarifler ve etkinlikler. Statik/SEO odaklı; DB gerekmez.

export type Article = {
  slug: string;
  title: string;
  summary: string;
  content: string; // düz metin; paragraflar \n\n ile ayrılır
  image: string;
  date: string; // "12 Mart 2024" — gösterim metni
  category?: string;
};

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
};

export const HEALTH_GUIDES: Article[] = [
  {
    slug: "karakovan-balinin-bilinmeyen-5-faydasi",
    title: "Karakovan Balının Bilinmeyen 5 Faydası",
    summary:
      "Bağışıklığı güçlendirmekten cilt sağlığına kadar karakovan balının mucizeleri.",
    content:
      "Karakovan balı, insan eli değmeden üretilen en saf bal türüdür.\n\n1. Bağışıklık sistemini çelik gibi yapar.\n2. Doğal bir antibiyotiktir, boğaz enfeksiyonlarına iyi gelir.\n3. Mide rahatsızlıklarını hafifletir.\n4. Enerji verir, yorgunluğu alır.\n5. Cilt yaralarının iyileşmesini hızlandırır.\n\nKarakovan balı, yüksek prolin değeri ile diğer ballardan ayrılır. Düzenli tüketimi, vücudun direncini artırır ve hastalıklara karşı kalkan oluşturur. Özellikle kış aylarında sabahları bir kaşık tüketilmesi önerilir.",
    image:
      "https://images.unsplash.com/photo-1587049352847-4d43ac7b98d3?auto=format&fit=crop&q=80&w=800",
    date: "12 Mart 2024",
  },
  {
    slug: "dag-kekigi-nasil-kullanilir",
    title: "Dağ Kekiği Nasıl Kullanılır?",
    summary:
      "Yemeklerden çaylara, dağ kekiğinin kullanım alanları ve şifalı etkileri.",
    content:
      "Dağ kekiği (Zahter), sadece bir baharat değil, aynı zamanda güçlü bir antiseptiktir. Et yemeklerinde marinasyon için harikadır. Çay olarak demlendiğinde öksürüğü keser ve hazmı kolaylaştırır. Zeytinyağı ile karıştırılıp kahvaltıda tüketilebilir.\n\nAyrıca, dağ kekiği yağı, ciltteki sivilce ve yaralar için doğal bir tedavi edici olarak da kullanılabilir. Keskin kokusu, zihni açar ve odaklanmayı artırır.",
    image:
      "https://images.unsplash.com/photo-1596541571217-14234054fa25?auto=format&fit=crop&q=80&w=800",
    date: "05 Nisan 2024",
  },
  {
    slug: "neden-mevsiminde-beslenmeliyiz",
    title: "Neden Mevsiminde Beslenmeliyiz?",
    summary: "Doğanın döngüsüne uyum sağlamanın bedenimiz üzerindeki etkileri.",
    content:
      "Mevsiminde yenen sebze ve meyveler, o mevsimin getirdiği hastalıklara karşı vücudumuzu korur. Kışın C vitamini deposu turunçgiller, yazın su ihtiyacımızı karşılayan karpuz ve domates... Doğanın bize sunduğu bu dengeyi korumak, sağlıklı bir yaşamın temelidir.\n\nMevsim dışı ürünler, genellikle seralarda ve kimyasal gübrelerle yetiştirildiği için besin değerleri düşüktür. Doğal döngüye uymak, hem sağlığımızı korur hem de çevreyi destekler.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
    date: "20 Mayıs 2024",
  },
  {
    slug: "cevizin-beyin-sagligina-etkileri",
    title: "Cevizin Beyin Sağlığına Etkileri",
    summary: "Ceviz tüketimi hafızayı güçlendirir mi?",
    content:
      "Ceviz, omega-3 yağ asitleri bakımından zengindir. Düzenli tüketimi beyin fonksiyonlarını destekler, odaklanmayı artırır ve hafızayı güçlendirir. Günde 2-3 tam ceviz tüketmek, kalp ve beyin sağlığı için mükemmel bir yatırımdır.\n\nCeviz, aynı zamanda antioksidanlar açısından da zengindir ve hücrelerin yaşlanmasını geciktirir. Özellikle sınav dönemlerinde veya yoğun çalışma temposunda ceviz tüketimi, zihinsel performansı artırır.",
    image:
      "https://images.unsplash.com/photo-1599598425947-33002620ebb6?auto=format&fit=crop&q=80&w=800",
    date: "10 Haziran 2024",
  },
  {
    slug: "dogal-probiyotik-kaynagi-tarhana",
    title: "Doğal Probiyotik Kaynağı: Tarhana",
    summary: "Tarhana çorbası neden bu kadar faydalı?",
    content:
      "Tarhana, fermente bir gıda olduğu için doğal bir probiyotik kaynağıdır. Bağırsak florasını düzenler, sindirimi kolaylaştırır ve bağışıklık sistemini destekler. İçeriğindeki sebzelerle zenginleşen tarhana, kış aylarının vazgeçilmezidir.\n\nProbiyotikler, bağırsak sağlığı için kritik öneme sahiptir ve tarhana, bu probiyotikleri doğal yollarla almamızı sağlar. Düzenli tarhana tüketimi, sindirim sistemi şikayetlerini azaltır ve vücudun genel direncini artırır.",
    image:
      "https://images.unsplash.com/photo-1548943487-a2e4f43b4852?auto=format&fit=crop&q=80&w=800",
    date: "05 Temmuz 2024",
  },
];

export const RECIPES: Article[] = [
  {
    slug: "karakovan-balli-kuru-incirli-enerji-toplari",
    title: "Karakovan Ballı, Kuru İncirli Enerji Topları",
    summary:
      "Golden Oremar Karakovan Balı ve kuru incirleriyle hazırlayabileceğiniz şekersiz, doğal atıştırmalık.",
    content:
      "Malzemeler:\n- 1 su bardağı kurutulmuş dağ inciri\n- Yarım su bardağı ceviz veya fındık içi\n- 2 yemek kaşığı süzme çiçek balı\n- 1 tatlı kaşığı tarçın\n- Bulamak için Hindistan cevizi\n\nHazırlanışı:\n1. İncirleri 10 dakika sıcak suda bekletip yumuşatın. Suyunu iyice süzün.\n2. Cevizleri mutfak robotunda iri parçalar halinde çekin.\n3. Yumuşayan incirleri, balı ve tarçını robota ekleyip macun kıvamına gelene kadar çekin.\n4. Karışımı buzdolabında 15 dakika dinlendirin.\n5. Elinizi hafifçe ıslatarak karışımdan ceviz büyüklüğünde parçalar koparıp yuvarlayın.\n6. Hindistan cevizine bulayıp servis yapın. Afiyet olsun!",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1200&h=800",
    date: "15 Nisan 2024",
    category: "Şekersiz Atıştırmalık",
  },
  {
    slug: "dag-kekikli-firin-somon",
    title: "Dağ Kekikli Fırın Somon",
    summary:
      "Dağ kekiği ile aromalandırılmış, sağlıklı fırın somon tarifi.",
    content:
      "Malzemeler:\n- 2 dilim somon fileto\n- 1 tatlı kaşığı dağ kekiği\n- 3 yemek kaşığı zeytinyağı\n- Yarım limonun suyu\n- Tuz ve taze çekilmiş karabiber\n\nHazırlanışı:\n1. Zeytinyağı, limon suyu, dağ kekiği, tuz ve karabiberi küçük bir kasede karıştırın.\n2. Somon filetoları bu sosla harmanlayıp 20 dakika buzdolabında marine edin.\n3. Yağlı kağıt serili fırın tepsisine somonları yerleştirin.\n4. Önceden ısıtılmış 200 derece fırında yaklaşık 15-20 dakika (somonun kalınlığına göre) pişirin.\n5. Taze salata veya buharda pişmiş sebzelerle sıcak servis yapın.",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1200&h=800",
    date: "10 Nisan 2024",
    category: "Ana Yemek",
  },
  {
    slug: "koy-peynirli-ve-cevizli-ev-yapimi-pide",
    title: "Köy Peynirli ve Cevizli Ev Yapımı Pide",
    summary:
      "Klasik peynirli pideye köy peyniri ve ceviz ile farklı bir dokunuş.",
    content:
      "Malzemeler:\n- Hamur için: 3 su bardağı un, 1 tatlı kaşığı maya, tuz, su.\n- İç harcı için: 250 g köy peyniri (rendelenmiş), 1 su bardağı kırık ceviz, 1 yumurta.\n\nHazırlanışı:\n1. Hamur malzemelerini karıştırıp yumuşak bir hamur yoğurun. 45 dk mayalandırın.\n2. Peynir, ceviz ve yumurtayı karıştırın.\n3. Hamurdan bezeler alıp uzunlamasına açın ve iç harcı ortasına yayın.\n4. Kenarlarını kıvırıp 200 derece fırında kızarana kadar pişirin.",
    image:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=80&w=1200&h=800",
    date: "5 Nisan 2024",
    category: "Hamur İşi",
  },
];

export const EVENTS: EventItem[] = [
  {
    slug: "bal-hasadi-senligi",
    title: "Bal Hasadı Şenliği",
    date: "Eylül ayı (her yıl)",
    location: "Oremar Yaylası, Yüksekova",
    description:
      "Geleneksel bal hasadımızı şenlik havasında kutluyoruz. Arıcılarımızla tanışın, taze balın tadına bakın ve yayla havasının keyfini çıkarın.",
    image:
      "https://images.unsplash.com/photo-1587049352847-4d43ac7b98d3?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "kuzu-kirkimi-ve-yayla-gocu",
    title: "Kuzu Kırkımı ve Yayla Göçü",
    date: "Haziran ayı (her yıl)",
    location: "Köy Meydanı",
    description:
      "Yüzyıllardır süren geleneği yaşatıyoruz. Koyunların kırkılması ve yaylaya göç hazırlıklarına tanıklık edin. Yöresel yemek ikramlarımız olacaktır.",
    image:
      "https://images.unsplash.com/photo-1484704324500-528d0ae4dc7d?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "dogal-yasam-atolyesi",
    title: "Doğal Yaşam Atölyesi",
    date: "Temmuz ayı (her yıl)",
    location: "Oremar Kültür Evi",
    description:
      "Kendi yoğurdunu mayalamayı, sirke kurmayı ve doğal reçel yapmayı öğrenmek isteyenler için uygulamalı atölye çalışması.",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "peynir-yapim-atolyesi",
    title: "Yayla Peyniri Yapım Atölyesi",
    date: "Ağustos ayı (her yıl)",
    location: "Oremar Yaylası",
    description:
      "Geleneksel yöntemlerle tulum peyniri yapımını öğrenin. Sütün mayalanmasından olgunlaşma sürecine kadar tüm aşamaları ustalarından dinleyin.",
    image:
      "https://images.unsplash.com/photo-1486297672625-f5dc1bfe7c04?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "sonbahar-hasadi-ve-kis-hazirligi",
    title: "Sonbahar Hasadı ve Kış Hazırlığı",
    date: "Eylül sonu (her yıl)",
    location: "Köy Meydanı",
    description:
      "Kışlık hazırlıkların yapıldığı, imece usulü bir gün. Tarhana kurutma, pekmez kaynatma ve kışlık sebzelerin hazırlanmasına katılın.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
  },
];
