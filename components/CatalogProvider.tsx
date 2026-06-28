"use client";

import { createContext, useContext, useMemo } from "react";
import { buildHelpers, type CatalogData } from "@/lib/queries";

type CatalogContext = CatalogData & ReturnType<typeof buildHelpers>;

const Ctx = createContext<CatalogContext | null>(null);

/**
 * Sunucuda çekilen katalog verisini (layout'tan prop) client component'lere
 * eski lib/data API'siyle (products, getProduct, featuredProducts...) sunar.
 */
export function CatalogProvider({
  data,
  children,
}: {
  data: CatalogData;
  children: React.ReactNode;
}) {
  const value = useMemo<CatalogContext>(
    () => ({ ...data, ...buildHelpers(data) }),
    [data],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
