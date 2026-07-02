import { notFound } from "next/navigation";
import { HEALTH_GUIDES } from "@/lib/content";
import { ArticleBody } from "@/components/ContentCards";

export function generateStaticParams() {
  return HEALTH_GUIDES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = HEALTH_GUIDES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} — Golden Oremar`,
    description: article.summary,
    openGraph: { images: [article.image] },
  };
}

export default async function HealthGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = HEALTH_GUIDES.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <ArticleBody
      article={article}
      eyebrow="Sağlık Rehberi"
      backHref="/saglik-rehberi"
      backLabel="Tüm rehberler"
    />
  );
}
