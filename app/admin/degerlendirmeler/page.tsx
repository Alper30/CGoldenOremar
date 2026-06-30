import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReviewsModerator, type AdminReview } from "@/components/admin/ReviewsModerator";

export const metadata = { title: "Değerlendirmeler · Yönetim" };

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  // RLS: product_reviews herkese okunur → admin tüm yorumları görür.
  const { data } = await supabase
    .from("product_reviews")
    .select("id, author, location, rating, text, created_at, products(name, slug)")
    .order("created_at", { ascending: false })
    .limit(300);

  return <ReviewsModerator reviews={(data ?? []) as unknown as AdminReview[]} />;
}
