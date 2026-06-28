"use client";

import Link from "next/link";
import { LeafIcon } from "./icons";
import { useStore } from "./store";

export function Footer() {
  const { t } = useStore();

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
        { href: "#", label: t("footKvkk") },
        { href: "#", label: t("footDistance") },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
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

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-base text-forest-deep">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-forest"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Golden Oremar — {t("footRights")}</p>
          <p>{t("footTagline")}</p>
        </div>
      </div>
    </footer>
  );
}
