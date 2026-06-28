import { Suspense } from "react";
import { CatalogClient } from "@/components/CatalogClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">
          Yükleniyor…
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
