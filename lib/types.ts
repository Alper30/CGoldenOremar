// Golden Oremar — veri tipleri (front-end; backend bir sonraki faz)

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
};

export type Review = {
  author: string;
  location: string;
  rating: number; // 1-5
  date: string; // "Mart 2026"
  text: string;
  product?: string;
};

export type Producer = {
  slug: string;
  name: string; // mağaza / üretici adı
  person: string; // gerçek kişi adı
  avatar: string;
  cover: string;
  location: string; // İlçe, İl
  verified: boolean; // kimlik doğrulandı (KYC)
  memberSince: string; // "2024"
  story: string;
  unitsSold: number;
  positivePct: number; // %olumlu geri bildirim
  rating: number; // ortalama yıldız
  reviewCount: number;
  productCount: number;
  badges: string[]; // ör. "Organik", "Arıcı", "El Yapımı"
};

export type Product = {
  slug: string;
  name: string;
  category: string; // Category.slug
  price: number; // ₺
  oldPrice?: number; // üstü çizili eski fiyat
  unit: string; // "500 g", "1 kg", "10'lu"
  image: string;
  gallery?: string[];
  region: string; // bölge / menşe (sağ üst rozet + kart altı)
  producer: string; // Producer.slug
  rating: number;
  reviewCount: number;
  badge: string; // tekil vurgu rozeti: "Katkısız" | "Organik" | "Doğal" | "Şeker İlavesiz"
  tags: string[]; // ek etiketler
  coldChain?: boolean;
  description: string;
  story?: string; // üretici ağzından ürün hikâyesi
  features?: string[]; // öne çıkan özellikler / seçenekler
  reviews?: Review[];
};
