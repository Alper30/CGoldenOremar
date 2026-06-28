import { StarIcon } from "./icons";

export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const px = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            className={`${px} ${
              i <= Math.round(rating) ? "text-gold" : "text-line"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-ink">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted">({count})</span>
      )}
    </div>
  );
}
