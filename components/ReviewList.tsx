import type { Review } from "@/lib/types";
import { StarRating } from "./StarRating";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return (
      <p className="text-sm text-muted">Henüz yorum yok. İlk değerlendiren siz olun.</p>
    );
  }
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <div key={i} className="rounded-2xl border border-line bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-forest-deep">{r.author}</p>
              <p className="text-xs text-muted">
                {r.location} · {r.date}
              </p>
            </div>
            <StarRating rating={r.rating} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink/90">{r.text}</p>
        </div>
      ))}
    </div>
  );
}
