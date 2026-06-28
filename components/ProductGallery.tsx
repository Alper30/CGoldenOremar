"use client";

import Image from "next/image";
import { useState } from "react";
import { OriginBadge } from "./OriginBadge";

export function ProductGallery({
  images,
  alt,
  badge,
  region,
}: {
  images: string[];
  alt: string;
  badge: string;
  region: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [images[0]];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-line bg-canvas">
        <Image
          key={active}
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="rise object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-success px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
        <div className="absolute right-4 top-4">
          <OriginBadge origin={region} />
        </div>
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-3">
          {list.map((g, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Görsel ${i + 1}`}
              className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? "border-gold" : "border-line hover:border-gold/40"
              }`}
            >
              <Image src={g} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
