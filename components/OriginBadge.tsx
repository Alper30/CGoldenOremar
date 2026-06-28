import { PinIcon } from "./icons";

/**
 * Menşe rozeti — ürün görselinin SAĞ ÜST köşesinde durur.
 * "Ürün nerden?" sorusunu ilk bakışta yanıtlar (CLAUDE.md §8.4.1).
 */
export function OriginBadge({ origin }: { origin: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream/95 px-2.5 py-1 text-xs font-semibold text-forest-deep shadow-sm ring-1 ring-black/5 backdrop-blur">
      <PinIcon className="h-3.5 w-3.5 text-gold" />
      {origin}
    </span>
  );
}
