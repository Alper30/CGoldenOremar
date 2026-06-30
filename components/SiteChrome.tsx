"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppWidget } from "./WhatsAppWidget";
import { CartDrawer } from "./CartDrawer";

// Panel rotalarında (/admin, /satici-panel) public header/footer/sepet GÖSTERİLMEZ
// — paneller kendi tam-ekran kabuğunu (AdminShell / VendorNav) kullanır.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/satici-panel");

  if (bare) return <>{children}</>;

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppWidget />
    </>
  );
}
