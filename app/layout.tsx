import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { StoreProvider } from "@/components/store";
import { CatalogProvider } from "@/components/CatalogProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/Toaster";
import { fetchCatalogData } from "@/lib/queries";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Golden Oremar — Doğanın Kalbinden, Doğrudan Üreticiden",
  description:
    "Hakkâri, Yüksekova, Şırnak ve çevresinin doğal ürünleri; kimliği doğrulanmış üreticilerden, güvenli ödeme ve soğuk zincirle kapınıza.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const catalog = await fetchCatalogData();
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <CatalogProvider data={catalog}>
          <StoreProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Toaster />
            <WhatsAppWidget />
          </StoreProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
