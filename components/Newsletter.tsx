"use client";

import { LeafIcon, ArrowRightIcon } from "./icons";
import { useStore } from "./store";

export function Newsletter() {
  const { t, toast } = useStore();
  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-amber-bg px-6 py-12 text-center sm:px-10 lg:py-16">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-cream">
        <LeafIcon className="h-6 w-6" />
      </span>
      <h2 className="mx-auto mt-4 max-w-xl font-display text-2xl text-forest-deep sm:text-3xl">
        {t("newsTitle")}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gold-deep/80">
        {t("newsSub")}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.currentTarget.reset();
          toast(t("newsThanks"));
        }}
        className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row"
      >
        <input
          type="email"
          required
          placeholder={t("newsPlaceholder")}
          aria-label={t("newsPlaceholder")}
          className="h-12 flex-1 rounded-full border border-line bg-card px-5 text-sm text-ink outline-none placeholder:text-muted focus:border-gold"
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep"
        >
          {t("newsBtn")}
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
