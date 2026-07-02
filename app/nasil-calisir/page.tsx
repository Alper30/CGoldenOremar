"use client";

import Link from "next/link";
import { useStore } from "@/components/store";
import {
  VerifiedIcon,
  ShieldIcon,
  SnowIcon,
  TruckIcon,
  PinIcon,
  LeafIcon,
  ArrowRightIcon,
} from "@/components/icons";

// Adım kartları çeviri anahtarlarıyla tanımlanır (TR/KU dil deposundan gelir).
const buyerSteps = [
  { icon: PinIcon, title: "hwB1Title", text: "hwB1Text" },
  { icon: ShieldIcon, title: "hwB2Title", text: "hwB2Text" },
  { icon: TruckIcon, title: "hwB3Title", text: "hwB3Text" },
  { icon: SnowIcon, title: "hwB4Title", text: "hwB4Text" },
] as const;

const sellerSteps = [
  { icon: VerifiedIcon, title: "hwS1Title", text: "hwS1Text" },
  { icon: LeafIcon, title: "hwS2Title", text: "hwS2Text" },
  { icon: PinIcon, title: "hwS3Title", text: "hwS3Text" },
  { icon: ShieldIcon, title: "hwS4Title", text: "hwS4Text" },
] as const;

function StepCard({
  index,
  icon: Icon,
  title,
  text,
}: {
  index: number;
  icon: typeof PinIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl border border-line bg-card p-6">
      <span className="absolute right-5 top-5 font-display text-3xl text-line">
        {index}
      </span>
      <Icon className="h-7 w-7 text-forest" />
      <h3 className="mt-4 font-display text-xl text-forest-deep">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}

export default function HowItWorksPage() {
  const { t } = useStore();
  return (
    <div>
      {/* Başlık */}
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            {t("hwEyebrow")}
          </p>
          <h1 className="mt-2 font-display text-4xl text-forest-deep lg:text-5xl">
            {t("hwTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
            {t("hwIntro")}
          </p>
        </div>
      </section>

      {/* Alıcı için */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-3xl text-forest-deep">{t("hwBuyerTitle")}</h2>
        <p className="mt-2 text-muted">{t("hwBuyerSub")}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {buyerSteps.map((s, i) => (
            <StepCard
              key={s.title}
              index={i + 1}
              icon={s.icon}
              title={t(s.title)}
              text={t(s.text)}
            />
          ))}
        </div>
      </section>

      {/* Satıcı için */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-3xl text-forest-deep">
            {t("hwSellerTitle")}
          </h2>
          <p className="mt-2 text-muted">{t("hwSellerSub")}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sellerSteps.map((s, i) => (
              <StepCard
                key={s.title}
                index={i + 1}
                icon={s.icon}
                title={t(s.title)}
                text={t(s.text)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lojistik notu */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[1.5rem] border border-line bg-card p-8 lg:p-10">
          <div className="flex items-start gap-4">
            <SnowIcon className="h-8 w-8 shrink-0 text-gold" />
            <div>
              <h3 className="font-display text-2xl text-forest-deep">
                {t("hwColdTitle")}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{t("hwColdText")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-forest-deep px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl text-cream lg:text-4xl">
            {t("hwCtaTitle")}
          </h2>
          <Link
            href="/urunler"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-forest-deep transition-transform hover:scale-[1.02]"
          >
            {t("hwCtaBtn")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
