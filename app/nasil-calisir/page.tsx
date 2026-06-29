import Link from "next/link";
import {
  VerifiedIcon,
  ShieldIcon,
  SnowIcon,
  TruckIcon,
  PinIcon,
  LeafIcon,
  ArrowRightIcon,
} from "@/components/icons";

const buyerSteps = [
  {
    icon: PinIcon,
    title: "Üreticiyi ve menşeini gör",
    text: "Her ürünün üzerinde nereden geldiği yazar. Üreticinin profiline girip kaç ürün sattığını, puanını ve yorumlarını incelersiniz.",
  },
  {
    icon: ShieldIcon,
    title: "Güvenle öde",
    text: "Ödemeniz doğrudan satıcıya geçmez; ürünü teslim alıp onaylayana kadar platformda emanette (escrow) bekler.",
  },
  {
    icon: TruckIcon,
    title: "Siparişini izle",
    text: "Kargo takip numarası zorunludur. Ürününüz yola çıktığı andan kapınıza gelene dek her adımı görürsünüz.",
  },
  {
    icon: SnowIcon,
    title: "Tazeliğiyle teslim al",
    text: "Süt, peynir gibi ürünler soğuk zincir ambalajıyla serinliği korunarak gelir. Beğenmezseniz iade güvencesi.",
  },
];

const sellerSteps = [
  {
    icon: VerifiedIcon,
    title: "Kimliğini doğrula (KYC)",
    text: "Basit bir kimlik doğrulamasıyla güvenilir satıcı rozetini alırsın. Böylece alıcılar sana güvenir.",
  },
  {
    icon: LeafIcon,
    title: "Ürününü ekle — yalnız değilsin",
    text: "Teknolojiyle aran iyi olmasa da olur. Fotoğraf, açıklama ve fiyatlandırmada ekibimiz ve Kürtçe/Türkçe destek hattımız yanında.",
  },
  {
    icon: PinIcon,
    title: "İlçe merkezine getir",
    text: "Ürününü ilçe merkezindeki toplama noktasına bırak; istersen özel soğuk/koruyucu ambalajları da oradan al ya da adresine getirt.",
  },
  {
    icon: ShieldIcon,
    title: "Sat, kazancını al",
    text: "Alıcı ürünü onayladığında komisyon düşülür, kalan tutar bakiyene geçer. Tüm hareketler şeffaf biçimde kayıt altındadır.",
  },
];

function StepCard({
  index,
  icon: Icon,
  title,
  text,
}: {
  index: number;
  icon: typeof PinIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-line bg-card p-6">
      <span className="absolute right-5 top-5 font-display text-3xl text-line">
        {index}
      </span>
      <Icon className="h-7 w-7 text-forest" />
      <h3 className="mt-4 font-display text-xl text-forest-deep">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div>
      {/* Başlık */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Güven, baştan sona
          </p>
          <h1 className="mt-2 font-display text-3xl text-forest-deep sm:text-4xl lg:text-5xl">
            Nasıl çalışır?
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            Üreticiyi alıcıyla, emeği güvenle buluşturuyoruz. Aradaki her adımı
            şeffaf tuttuk; ne aldığınızı ve kimden aldığınızı her zaman bilin.
          </p>
        </div>
      </section>

      {/* Alıcı için */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-3xl text-forest-deep">Alıcıysanız</h2>
        <p className="mt-2 text-muted">Dört adımda, gönül rahatlığıyla.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {buyerSteps.map((s, i) => (
            <StepCard key={s.title} index={i + 1} {...s} />
          ))}
        </div>
      </section>

      {/* Satıcı için */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-3xl text-forest-deep">
            Üreticiyseniz
          </h2>
          <p className="mt-2 text-muted">
            Bahçenizdeki bereketi gelire dönüştürün; gerisini biz hallederiz.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sellerSteps.map((s, i) => (
              <StepCard key={s.title} index={i + 1} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Lojistik notu */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[1.5rem] border border-line bg-card p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <SnowIcon className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <h3 className="font-display text-2xl text-forest-deep">
                Soğuk zincir & toplama noktası
              </h3>
              <p className="mt-3 leading-relaxed text-muted">
                Taze ürünlerin bozulmaması için özel yalıtımlı, soğuk tutan
                ambalajlar sağlıyoruz. Üreticiler bu ambalajları{" "}
                <strong className="text-forest">platformdan sipariş edebilir</strong>{" "}
                ya da ürünlerini getirdikleri{" "}
                <strong className="text-forest">
                  ilçe merkezindeki toplama noktasından
                </strong>{" "}
                teslim alabilir. Tek lokasyon, çift işlev: hem ürün toplama hem
                ambalaj dağıtım.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-forest-deep px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl text-cream lg:text-4xl">
            Doğanın bereketini keşfetmeye hazır mısınız?
          </h2>
          <Link
            href="/urunler"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-forest-deep transition-transform hover:scale-[1.02]"
          >
            Ürünleri keşfet
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
