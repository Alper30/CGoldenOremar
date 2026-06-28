import Image from "next/image";
import Link from "next/link";
import type { Producer } from "@/lib/types";
import { VerifiedIcon, PinIcon, ArrowRightIcon } from "./icons";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-xl text-forest-deep">{value}</p>
      <p className="text-[11px] leading-tight text-muted">{label}</p>
    </div>
  );
}

/**
 * Satıcı güven profili kartı (CLAUDE.md §8.4.2).
 * Alıcının "rahat ve güvende" hissetmesi için: doğrulama + satılan adet + %olumlu + puan.
 */
export function ProducerTrustCard({ producer }: { producer: Producer }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-cream">
          <Image
            src={producer.avatar}
            alt={producer.person}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-lg text-forest-deep">
              {producer.name}
            </p>
            {producer.verified && (
              <VerifiedIcon className="h-4 w-4 shrink-0 text-gold" />
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-muted">
            <PinIcon className="h-3.5 w-3.5" />
            {producer.location}
          </p>
        </div>
      </div>

      {producer.verified ? (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <VerifiedIcon className="h-3.5 w-3.5" />
          Kimliği doğrulanmış üretici · {producer.memberSince}'ten beri
        </p>
      ) : (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
          Doğrulama sürüyor
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
        <Stat value={producer.unitsSold.toLocaleString("tr-TR")} label="ürün satıldı" />
        <Stat value={`%${producer.positivePct}`} label="olumlu geri bildirim" />
        <Stat value={producer.rating.toFixed(1)} label={`${producer.reviewCount} yorum`} />
      </div>

      <Link
        href={`/satici/${producer.slug}`}
        className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
      >
        Üreticinin profilini gör
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
