import { RECIPES } from "@/lib/content";
import { ContentHero, ArticleCard } from "@/components/ContentCards";

export const metadata = {
  title: "Tarifler — Golden Oremar",
  description:
    "Yayla ürünleriyle hazırlanan doğal, katkısız tarifler: enerji topları, dağ kekikli somon, köy peynirli pide ve daha fazlası.",
};

export default function RecipesPage() {
  return (
    <div>
      <ContentHero
        eyebrow="Mutfak"
        title="Tarifler"
        intro="Üreticilerimizin doğal ürünleriyle hazırlayabileceğiniz, denenmiş köy tarifleri."
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECIPES.map((a) => (
            <ArticleCard key={a.slug} base="/tarifler" article={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
