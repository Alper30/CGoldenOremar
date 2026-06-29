import Image from "next/image";
import Link from "next/link";
import {
  LeafIcon,
  VerifiedIcon,
  ShieldIcon,
  PersonIcon,
  ArrowRightIcon,
} from "@/components/icons";

const values = [
  {
    icon: LeafIcon,
    title: "Doğallık",
    text: "Hiçbir kimyasal katkı maddesi kullanmadan, doğanın saf halini koruyoruz.",
  },
  {
    icon: VerifiedIcon,
    title: "Kalite",
    text: "En yüksek kalite standartlarında üretim yaparak müşteri memnuniyetini sağlıyoruz.",
  },
  {
    icon: ShieldIcon,
    title: "Güvenilirlik",
    text: "Müşterilerimizle kurduğumuz güven ilişkisi bizim en değerli varlığımızdır.",
  },
  {
    icon: PersonIcon,
    title: "Topluluk",
    text: "Yerel toplulukla birlikte büyüyor, sürdürülebilir kalkınmaya katkı sağlıyoruz.",
  },
];

const team = [
  {
    name: "İshak Alper",
    position: "Kurucu & Genel Müdür",
    description:
      "Golden Oremar'ın kurucusu ve vizyoneri. 20 yıllık arıcılık deneyimi ile şirketin tüm operasyonlarını yönetir. Pazarlama, müşteri memnuniyeti ve genel işletme stratejilerinden sorumludur.",
    keywords: ["20+ Yıl Deneyim", "Arıcılık Uzmanı"],
  },
  {
    name: "Cahit Çakmakçı",
    position: "Kalite Kontrol & Üretim Müdürü",
    description:
      "Geleneksel üretim yöntemlerinin uzmanı ve koruyucusu. Ürünlerimizin kalitesini garanti altına alır, üretim süreçlerini geliştirir ve üreticilerimizi eğitir.",
    keywords: ["Kalite Uzmanı", "Geleneksel Üretim"],
  },
  {
    name: "Selim Alper",
    position: "Dijital Operasyonlar Müdürü",
    description:
      "Web sitesinin geliştirilmesi, güncellemeleri ve dijital pazarlama stratejilerinden sorumludur. Site yönetimi, müşteri ilişkileri ve reklam kampanyalarını koordine eder.",
    keywords: ["Dijital Uzman", "Müşteri Deneyimi"],
  },
  {
    name: "İmran Alper",
    position: "İçerik & Lojistik Müdürü",
    description:
      "Ürünlerimizin fotoğraf, video ve tanıtım içeriklerini hazırlar. Üretim alanlarını ziyaret ederek otantik içerikler oluşturur; kargolama ve paketleme süreçlerini yönetir.",
    keywords: ["İçerik Uzmanı", "Lojistik"],
  },
];

function initials(name: string) {
  const p = name.trim().split(" ");
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase();
}

export const metadata = {
  title: "Hakkımızda — Golden Oremar",
  description:
    "Golden Oremar'ın hikâyesi, misyonu, değerleri ve ekibi. Hakkâri Yüksekova Yeşiltaş Köyü'nden doğanın saf hâli.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Başlık */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Golden Oremar
          </p>
          <h1 className="mt-2 font-display text-3xl text-forest-deep sm:text-4xl lg:text-5xl">
            Hakkımızda
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Doğanın en saf hâlini koruyan köyümüzden, geleneksel değerleri ve
            köyümüzün samimiyetini sofranıza taşıyoruz.
          </p>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">
              Hikayemiz
            </p>
            <h2 className="mt-2 font-display text-3xl text-forest-deep lg:text-4xl">
              Bir köyden Türkiye&apos;nin sofralarına
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted">
              <p>
                Golden Oremar, 2020 yılında küçük bir köy işletmesi olarak
                başladı. Hakkâri&apos;nin Yüksekova ilçesi, Dağlıca&apos;nın
                Yeşiltaş Köyü&apos;nde, doğanın en saf hâlini koruyan köyümüzden
                çıktık ve Türkiye&apos;nin dört bir yanına doğal, katkısız
                ürünlerimizi ulaştırmak için yola çıktık.
              </p>
              <p>
                Her ürünümüz, nesiller boyu aktarılan geleneksel yöntemlerle
                üretiliyor. Köyümüzün deneyimli ustaları her sabah güneş
                doğmadan işe başlıyor; arılarımız doğal çiçeklerden bal topluyor,
                ineklerimiz otlaklarda özgürce besleniyor, zeytinlerimiz soğuk
                sıkım yöntemiyle yağa dönüşüyor.
              </p>
              <p>
                Bugün binlerce mutlu müşterimiz var. Biz sadece ürün satmıyoruz;
                doğanın cömertliğini, geleneksel değerleri ve köyümüzün
                samimiyetini paylaşıyoruz.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line">
            <Image
              src="/images/seller-cta.png"
              alt="Golden Oremar üreticisi"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
          <div className="rounded-[1.5rem] border border-line bg-card p-8 lg:p-10">
            <h3 className="font-display text-2xl text-forest-deep">Misyonumuz</h3>
            <p className="mt-4 leading-relaxed text-muted">
              Doğal, katkısız ve geleneksel yöntemlerle üretilmiş ürünleri en
              güvenilir şekilde müşterilerimizin sofrasına ulaştırmak. Köyümüzün
              değerlerini koruyarak modern çağın gereksinimlerine uyum sağlamak
              ve sürdürülebilir bir gelecek inşa etmek.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-card p-8 lg:p-10">
            <h3 className="font-display text-2xl text-forest-deep">Vizyonumuz</h3>
            <p className="mt-4 leading-relaxed text-muted">
              Türkiye&apos;nin en güvenilir doğal ürün markası olmak. Her haneye
              doğal lezzeti ulaştırarak sağlıklı yaşam bilincini yaygınlaştırmak.
              Köy ekonomisini güçlendirerek geleneksel üretim yöntemlerinin
              nesiller boyu sürmesini sağlamak.
            </p>
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Değerlerimiz
          </p>
          <h2 className="mt-2 font-display text-3xl text-forest-deep lg:text-4xl">
            Bizi biz yapan ilkeler
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-card p-6 text-center transition-colors hover:border-gold/40"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-bg text-gold-deep">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl text-forest-deep">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ekibimiz */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">
              Ekibimiz
            </p>
            <h2 className="mt-2 font-display text-3xl text-forest-deep lg:text-4xl">
              İşin başındaki yüzler
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Yeşiltaş Köyü&apos;nün deneyimli ustaları ve doğal üretim
              uzmanları.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {team.map((m) => (
              <div
                key={m.name}
                className="flex gap-5 rounded-2xl border border-line bg-card p-6"
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold/15 font-display text-xl font-semibold text-gold-deep">
                  {initials(m.name)}
                </span>
                <div>
                  <h3 className="font-display text-lg text-forest-deep">{m.name}</h3>
                  <p className="text-sm font-semibold text-gold">{m.position}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {m.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-medium text-forest"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[2rem] bg-forest-deep px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl text-cream lg:text-4xl">
            Doğanın bereketini keşfetmeye hazır mısınız?
          </h2>
          <Link
            href="/urunler"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
          >
            Ürünleri Keşfet
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
