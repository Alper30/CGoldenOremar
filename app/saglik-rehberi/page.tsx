import { HEALTH_GUIDES } from "@/lib/content";
import { ContentHero, ArticleCard } from "@/components/ContentCards";

export const metadata = {
  title: "Sağlık Rehberi — Golden Oremar",
  description:
    "Karakovan balından dağ kekiğine, doğal ürünlerin faydaları ve doğru kullanımı üzerine rehberler.",
};

export default function HealthGuidesPage() {
  return (
    <div>
      <ContentHero
        eyebrow="Rehber"
        title="Sağlık Rehberi"
        intro="Doğal ürünlerin faydalarını ve doğru kullanımını, yaylanın bilgeliğiyle anlatıyoruz."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HEALTH_GUIDES.map((a) => (
            <ArticleCard key={a.slug} base="/saglik-rehberi" article={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
