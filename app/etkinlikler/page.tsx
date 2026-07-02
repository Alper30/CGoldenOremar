import Image from "next/image";
import { EVENTS } from "@/lib/content";
import { ContentHero } from "@/components/ContentCards";
import { PinIcon, ClockIcon } from "@/components/icons";

export const metadata = {
  title: "Etkinlikler — Golden Oremar",
  description:
    "Bal hasadı şenliği, yayla göçü, peynir ve doğal yaşam atölyeleri — Yüksekova'da yılın geleneksel etkinlikleri.",
};

export default function EventsPage() {
  return (
    <div>
      <ContentHero
        eyebrow="Yayla Takvimi"
        title="Etkinlikler"
        intro="Hasat şenliklerinden atölyelere; üretimin içine davetlisiniz. Kesin tarihler her sezon duyurulur."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((ev) => (
            <div
              key={ev.slug}
              className="overflow-hidden rounded-2xl border border-line bg-card"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={ev.image}
                  alt={ev.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg leading-snug text-forest-deep">
                  {ev.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <ClockIcon className="h-4 w-4 text-gold" />
                  {ev.date}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <PinIcon className="h-4 w-4 text-gold" />
                  {ev.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {ev.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-2xl border border-line bg-canvas p-5 text-sm text-muted">
          Etkinlik tarihleri her sezon kesinleşince burada ve sosyal medya
          hesaplarımızda duyurulur. Katılım için İletişim sayfasından bize
          ulaşabilirsiniz.
        </p>
      </section>
    </div>
  );
}
