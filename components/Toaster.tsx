"use client";

import { useStore } from "./store";
import { VerifiedIcon } from "./icons";

export function Toaster() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rise pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-forest-deep px-4 py-2.5 text-sm font-medium text-cream shadow-lg"
        >
          <VerifiedIcon className="h-4 w-4 text-gold-soft" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
