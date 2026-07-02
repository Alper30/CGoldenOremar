"use client";

import { useState } from "react";
import Link from "next/link";
import { LeafIcon } from "./icons";
import { useStore } from "./store";

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Footer() {
  const { t } = useStore();
  // Mobilde aynı anda tek bölüm açık (accordion); md+ hepsi açık.
  const [openCol, setOpenCol] = useState<string | null>(null);

  const cols = [
    {
      title: t("footExploreTitle"),
      links: [
        { href: "/urunler", label: t("footAllProducts") },
        { href: "/urunler?kategori=bal", label: t("catBal") },
        { href: "/urunler?kategori=sut-urunleri", label: t("catSut") },
        { href: "/urunler?kategori=zeytin-zeytinyagi", label: t("catZeytin") },
        { href: "/urunler?kategori=recel-pekmez", label: t("catRecel") },
      ],
    },
    {
      title: t("footPlatformTitle"),
      links: [
        { href: "/nasil-calisir", label: t("navHow") },
        { href: "/siparis-takip", label: t("navTracking") },
        { href: "/randevu", label: t("navBooking") },
        { href: "/nasil-calisir", label: t("navSell") },
      ],
    },
    {
      title: t("footCorpTitle"),
      links: [
        { href: "/hakkimizda", label: t("footAbout") },
        { href: "/iletisim", label: t("footContact") },
        { href: "/kvkk", label: t("footKvkk") },
        { href: "/gizlilik-politikasi", label: t("footPrivacy") },
        { href: "/mesafeli-satis-sozlesmesi", label: t("footDistance") },
        { href: "/satici-sozlesmesi", label: t("footVendorTerms") },
        { href: "/iade-politikasi", label: t("footReturns") },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl text-forest-deep">Golden</span>
              <span className="font-display text-2xl text-gold">Oremar</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {t("footBrandDesc")}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest">
              <LeafIcon className="h-4 w-4 text-gold" />
              {t("footSupport")}
            </p>
          </div>

          {cols.map((col) => {
            const isOpen = openCol === col.title;
            return (
              <div
                key={col.title}
                className="border-b border-line md:border-0"
              >
                {/* Başlık — mobilde aç/kapa butonu, md+ düz başlık */}
                <button
                  type="button"
                  onClick={() => setOpenCol(isOpen ? null : col.title)}
                  aria-expanded={isOpen}
                  className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left md:pointer-events-none md:min-h-0"
                >
                  <h4 className="font-display text-base text-forest-deep">{col.title}</h4>
                  <ChevronIcon
                    className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 md:hidden ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {/* İçerik — max-height ile yumuşak aç/kapa; md+ daima açık */}
                <div
                  className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${
                    isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
                  }`}
                >
                  <ul className="space-y-1 pb-3 md:mt-3 md:pb-0">
                    {col.links.map((l, i) => (
                      <li key={i}>
                        <Link
                          href={l.href}
                          className="block py-1 text-sm text-muted transition-colors hover:text-forest"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Golden Oremar — {t("footRights")}</p>
          <p>{t("footTagline")}</p>
        </div>
      </div>
    </footer>
  );
}
