import { notFound } from "next/navigation";
import { RECIPES } from "@/lib/content";
import { ArticleBody } from "@/components/ContentCards";

export function generateStaticParams() {
  return RECIPES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = RECIPES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — Golden Oremar`,
    description: article.summary,
    openGraph: { images: [article.image] },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = RECIPES.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <ArticleBody
      article={article}
      eyebrow="Tarif"
      backHref="/tarifler"
      backLabel="Tüm tarifler"
    />
  );
}
